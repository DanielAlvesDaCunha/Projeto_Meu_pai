import Link from "next/link";
import { StoreProductGrid } from "@/components/StoreProductGrid";
import { getDestaques } from "@/lib/listings";

export const dynamic = "force-dynamic";

export default async function DestaquesPage() {
  const products = await getDestaques();

  return (
    <section className="container category-page">
      <nav className="breadcrumb-nav" aria-label="breadcrumb">
        <Link href="/">Início</Link>
        <span>/</span>
        <span>Destaques</span>
      </nav>
      <div className="category-head">
        <h1>Destaques</h1>
        <p className="muted" style={{ margin: 0 }}>
          As mais pedidas da loja, com as plantas em evidência
        </p>
      </div>
      <StoreProductGrid
        className="product-row product-row-catalog"
        products={products}
        emptyText="Nenhum destaque no momento."
        defaultFeatured
      />
    </section>
  );
}
