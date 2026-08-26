import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { getNavCategories, hasUsableDatabaseUrl, prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/money";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ de?: string; ate?: string; ordenar?: string }>;
};

function applySort<T extends { price: number; name: string; id: number }>(products: T[], sort: string) {
  const list = [...products];
  if (sort === "menor-preco") list.sort((a, b) => a.price - b.price);
  if (sort === "maior-preco") list.sort((a, b) => b.price - a.price);
  if (sort === "a-z" || sort === "nome") list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "z-a") list.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "mais-antigo") list.sort((a, b) => a.id - b.id);
  if (sort === "mais-novo" || sort === "relevancia") list.sort((a, b) => b.id - a.id);
  return list;
}

export default async function ProdutosPage({ searchParams }: Props) {
  const sp = await searchParams;
  const sort = sp.ordenar || "mais-novo";
  const categories = hasUsableDatabaseUrl()
    ? await getNavCategories()
    : getDemoCatalog().categories;

  let products: ReturnType<typeof toProductDTO>[] = [];

  if (hasUsableDatabaseUrl()) {
    try {
      const where: {
        OR: Array<{ available: boolean } | { stock: { lte: number } }>;
        price?: { gte?: number; lte?: number };
      } = {
        OR: [{ available: true }, { stock: { lte: 0 } }],
      };

      const de = sp.de ? Number(String(sp.de).replace(",", ".")) : undefined;
      const ate = sp.ate ? Number(String(sp.ate).replace(",", ".")) : undefined;
      if (de != null && !Number.isNaN(de)) where.price = { ...(where.price || {}), gte: de };
      if (ate != null && !Number.isNaN(ate)) where.price = { ...(where.price || {}), lte: ate };

      let orderBy: { price?: "asc" | "desc"; name?: "asc" | "desc"; id?: "asc" | "desc" }[] = [
        { id: "desc" },
      ];
      if (sort === "menor-preco") orderBy = [{ price: "asc" }, { name: "asc" }];
      if (sort === "maior-preco") orderBy = [{ price: "desc" }, { name: "asc" }];
      if (sort === "a-z" || sort === "nome") orderBy = [{ name: "asc" }];
      if (sort === "z-a") orderBy = [{ name: "desc" }];
      if (sort === "mais-antigo") orderBy = [{ id: "asc" }];

      const rows = await prisma.product.findMany({
        where,
        orderBy,
        include: { category: { select: { slug: true } } },
      });
      products = rows.map((p) => toProductDTO(p));
    } catch (error) {
      console.error("Produtos query failed:", error);
    }
  }

  if (!products.length) {
    let demo = getDemoCatalog().novidades.map((p) => toProductDTO(p));
    const de = sp.de ? Number(String(sp.de).replace(",", ".")) : undefined;
    const ate = sp.ate ? Number(String(sp.ate).replace(",", ".")) : undefined;
    if (de != null && !Number.isNaN(de)) demo = demo.filter((p) => p.price >= de);
    if (ate != null && !Number.isNaN(ate)) demo = demo.filter((p) => p.price <= ate);
    products = applySort(demo, sort);
  }

  return (
    <section className="container category-page">
      <div className="category-toolbar">
        <nav className="breadcrumb-nav" aria-label="breadcrumb">
          <Link href="/">Início</Link>
          <span>/</span>
          <strong>Produtos</strong>
        </nav>
        <SortSelect defaultValue={sort} de={sp.de} ate={sp.ate} />
      </div>

      <div className="category-layout">
        <aside>
          <div className="filter-panel">
            <p className="filter-by-label">Filtrar por</p>
            <details open>
              <summary>Tipos</summary>
              <ul className="filter-cats">
                <li>
                  <Link href="/produtos" className="is-active">
                    Todos os anúncios
                  </Link>
                </li>
                <li>
                  <Link href="/suculentas">Suculentas</Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/${cat.slug}`}>
                      {cat.name}
                      {cat.comingSoon ? <span className="cat-soon-tag">Em breve</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
            <details open>
              <summary>Preço</summary>
              <form method="get" className="price-filter-form">
                {sort !== "mais-novo" && <input type="hidden" name="ordenar" value={sort} />}
                <div className="price-inputs">
                  <label>
                    <span className="muted">De</span>
                    <input type="number" name="de" step="0.01" min="0" defaultValue={sp.de || ""} />
                  </label>
                  <label>
                    <span className="muted">Até</span>
                    <input type="number" name="ate" step="0.01" min="0" defaultValue={sp.ate || ""} />
                  </label>
                  <button type="submit" className="btn-price-go" aria-label="Aplicar preço">
                    →
                  </button>
                </div>
              </form>
            </details>
          </div>
        </aside>

        <div>
          <div className="category-head">
            <h1>Todos os produtos</h1>
            <p className="muted" style={{ margin: 0 }}>
              {products.length} anúncio(s) · pedido pelo WhatsApp
            </p>
          </div>
          <div className="product-row product-row-catalog">
            {products.length === 0 ? (
              <p className="muted">Nenhum anúncio cadastrado ainda.</p>
            ) : (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
