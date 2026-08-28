import Link from "next/link";
import { StoreProductCard } from "@/components/StoreProductCard";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function NovidadesPage() {
  let products: Array<{
    id: number;
    name: string;
    sku: string;
    description: string;
    price: { toString(): string } | number;
    oldPrice: { toString(): string } | number | null;
    image: string;
    featured: boolean;
  }> = [];

  if (hasUsableDatabaseUrl()) {
    try {
      products = await prisma.product.findMany({
        where: { available: true },
        orderBy: [{ createdAt: "desc" }, { order: "asc" }],
        take: 48,
      });
    } catch (error) {
      console.error("Novidades query failed:", error);
    }
  }

  if (!products.length) {
    products = getDemoCatalog().novidades;
  }

  return (
    <section className="container category-page">
      <nav className="breadcrumb-nav" aria-label="breadcrumb">
        <Link href="/">Início</Link>
        <span>/</span>
        <span>Novidades</span>
      </nav>
      <div className="category-head">
        <h1>Novidades</h1>
      </div>
      <div className="product-row product-row-catalog">
        {products.map((p) => (
          <StoreProductCard key={p.id} product={toProductDTO(p)} />
        ))}
      </div>
    </section>
  );
}
