import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function PromocoesPage() {
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
        where: { available: true, featured: true },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      });
    } catch (error) {
      console.error("Promoções query failed:", error);
    }
  }

  if (!products.length) {
    products = getDemoCatalog().featured;
  }

  return (
    <section className="container category-page">
      <nav className="breadcrumb-nav" aria-label="breadcrumb">
        <Link href="/">Início</Link>
        <span>/</span>
        <span>Promoções</span>
      </nav>
      <div className="category-head">
        <h1>Promoções</h1>
      </div>
      <div className="product-row product-row-catalog">
        {products.map((p) => (
          <ProductCard key={p.id} product={toProductDTO(p)} />
        ))}
      </div>
    </section>
  );
}
