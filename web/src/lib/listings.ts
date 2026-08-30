import { lancamentosSince } from "@/lib/catalog";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { toProductDTO, type ProductDTO } from "@/lib/money";
import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";

const VISIBLE = {
  OR: [{ available: true }, { stock: { lte: 0 } }],
};

function demoAll(): ProductDTO[] {
  return getDemoCatalog().novidades.map((p) => toProductDTO(p));
}

function demoFeatured(): ProductDTO[] {
  return getDemoCatalog().featured.map((p) => toProductDTO(p));
}

export async function getLancamentos(take?: number): Promise<ProductDTO[]> {
  if (hasUsableDatabaseUrl()) {
    try {
      const rows = await prisma.product.findMany({
        where: {
          AND: [VISIBLE, { createdAt: { gte: lancamentosSince() } }],
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take,
        include: { category: { select: { slug: true } } },
      });
      return rows.map((p) => toProductDTO(p));
    } catch (error) {
      console.error("Lançamentos query failed:", error);
    }
  }
  const demo = demoAll();
  return take ? demo.slice(0, take) : demo;
}

export async function getDestaques(take = 48): Promise<ProductDTO[]> {
  if (hasUsableDatabaseUrl()) {
    try {
      const sold = await prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          productId: { not: null },
          order: { status: { not: "CANCELLED" } },
        },
        _sum: { qty: true },
        orderBy: { _sum: { qty: "desc" } },
        take,
      });
      const soldIds = sold
        .map((row) => row.productId)
        .filter((id): id is number => typeof id === "number");

      const picked: ProductDTO[] = [];
      const seen = new Set<number>();

      if (soldIds.length) {
        const soldRows = await prisma.product.findMany({
          where: { id: { in: soldIds }, OR: VISIBLE.OR },
          include: { category: { select: { slug: true } } },
        });
        const rank = new Map(soldIds.map((id, index) => [id, index]));
        soldRows
          .sort((a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999))
          .forEach((row) => {
            if (seen.has(row.id) || picked.length >= take) return;
            seen.add(row.id);
            picked.push(toProductDTO(row));
          });
      }

      if (picked.length < take) {
        const featured = await prisma.product.findMany({
          where: {
            featured: true,
            OR: VISIBLE.OR,
            ...(seen.size ? { id: { notIn: [...seen] } } : {}),
          },
          orderBy: [{ order: "asc" }, { name: "asc" }],
          take: take - picked.length,
          include: { category: { select: { slug: true } } },
        });
        featured.forEach((row) => {
          if (seen.has(row.id) || picked.length >= take) return;
          seen.add(row.id);
          picked.push(toProductDTO(row));
        });
      }

      if (picked.length < take) {
        const newest = await prisma.product.findMany({
          where: {
            OR: VISIBLE.OR,
            ...(seen.size ? { id: { notIn: [...seen] } } : {}),
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: take - picked.length,
          include: { category: { select: { slug: true } } },
        });
        newest.forEach((row) => {
          if (seen.has(row.id) || picked.length >= take) return;
          seen.add(row.id);
          picked.push(toProductDTO(row));
        });
      }

      return picked;
    } catch (error) {
      console.error("Destaques query failed:", error);
    }
  }

  const featured = demoFeatured();
  if (featured.length) return take ? featured.slice(0, take) : featured;
  const demo = demoAll();
  return take ? demo.slice(0, take) : demo;
}
