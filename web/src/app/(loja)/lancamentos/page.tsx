import Link from "next/link";
import { StoreProductGrid } from "@/components/StoreProductGrid";
import { LANCAMENTOS_DAYS } from "@/lib/catalog";
import { getLancamentos } from "@/lib/listings";

export const dynamic = "force-dynamic";

export default async function LancamentosPage() {
  const products = await getLancamentos();

  return (
    <section className="container category-page">
      <nav className="breadcrumb-nav" aria-label="breadcrumb">
        <Link href="/">Início</Link>
        <span>/</span>
        <span>Lançamentos</span>
      </nav>
      <div className="category-head">
        <h1>Lançamentos</h1>
        <p className="muted" style={{ margin: 0 }}>
          Anúncios novos dos últimos {LANCAMENTOS_DAYS} dias
        </p>
      </div>
      <StoreProductGrid
        className="product-row product-row-catalog"
        products={products}
        emptyText="Nenhum lançamento nos últimos 30 dias."
      />
    </section>
  );
}
