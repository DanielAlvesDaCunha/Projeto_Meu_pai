import Link from "next/link";
import { StoreProductCard } from "@/components/StoreProductCard";
import { SortSelect } from "@/components/SortSelect";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { getNavCategories, hasUsableDatabaseUrl, prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/money";

export const dynamic = "force-dynamic";

const SUCCULENT_SLUGS = new Set([
  "suculentas",
  "gibbifloras",
  "echeverias",
  "haworthia",
  "graptopetalum",
  "sedum",
  "crassula",
  "aeonium",
  "lithops",
]);

/** Visíveis na vitrine: ativos + esgotados (estoque 0). Ocultos só pelo admin. */
const CATALOG_VISIBLE = {
  OR: [{ available: true }, { stock: { lte: 0 } }],
} as const;

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

function orderByForSort(sort: string) {
  if (sort === "menor-preco") return [{ price: "asc" as const }, { name: "asc" as const }];
  if (sort === "maior-preco") return [{ price: "desc" as const }, { name: "asc" as const }];
  if (sort === "a-z" || sort === "nome") return [{ name: "asc" as const }];
  if (sort === "z-a") return [{ name: "desc" as const }];
  if (sort === "mais-antigo") return [{ id: "asc" as const }];
  return [{ stock: "desc" as const }, { id: "desc" as const }];
}

export default async function SuculentasPage({ searchParams }: Props) {
  const sp = await searchParams;
  const sort = sp.ordenar || "mais-novo";
  const allCategories = hasUsableDatabaseUrl()
    ? await getNavCategories()
    : getDemoCatalog().categories;

  const succulentTypes = allCategories.filter((c) => SUCCULENT_SLUGS.has(c.slug));
  const listingSlugs = new Set(
    succulentTypes.filter((c) => !c.comingSoon).map((c) => c.slug)
  );
  // Categoria legada "suculentas" ainda no banco
  if (succulentTypes.some((c) => c.slug === "suculentas")) {
    listingSlugs.add("suculentas");
  }

  let products: ReturnType<typeof toProductDTO>[] = [];

  if (hasUsableDatabaseUrl()) {
    try {
      const categoryIds = succulentTypes
        .filter((c) => listingSlugs.has(c.slug))
        .map((c) => c.id);

      const where: {
        categoryId: { in: number[] };
        OR: Array<{ available: boolean } | { stock: { lte: number } }>;
        price?: { gte?: number; lte?: number };
      } = {
        categoryId: { in: categoryIds.length ? categoryIds : [-1] },
        ...CATALOG_VISIBLE,
      };

      const de = sp.de ? Number(String(sp.de).replace(",", ".")) : undefined;
      const ate = sp.ate ? Number(String(sp.ate).replace(",", ".")) : undefined;
      if (de != null && !Number.isNaN(de)) where.price = { ...(where.price || {}), gte: de };
      if (ate != null && !Number.isNaN(ate)) where.price = { ...(where.price || {}), lte: ate };

      const rows = await prisma.product.findMany({
        where,
        orderBy: orderByForSort(sort),
        include: { category: { select: { slug: true } } },
      });
      products = rows.map((p) => toProductDTO(p));
    } catch (error) {
      console.error("Suculentas query failed:", error);
    }
  }

  if (!products.length) {
    const demo = getDemoCatalog();
    let flat = demo.categories
      .filter((c) => listingSlugs.has(c.slug) || c.slug === "gibbifloras" || c.slug === "echeverias")
      .flatMap((c) => c.products);
    flat = [...new Map(flat.map((p) => [p.id, p])).values()];
    const de = sp.de ? Number(String(sp.de).replace(",", ".")) : undefined;
    const ate = sp.ate ? Number(String(sp.ate).replace(",", ".")) : undefined;
    if (de != null && !Number.isNaN(de)) flat = flat.filter((p) => p.price >= de);
    if (ate != null && !Number.isNaN(ate)) flat = flat.filter((p) => p.price <= ate);
    products = applySort(flat.map((p) => toProductDTO(p)), sort);
  }

  const sidebarTypes = succulentTypes.length
    ? succulentTypes
    : allCategories.filter((c) => c.slug === "gibbifloras" || c.slug === "echeverias");

  const heroImages = products
    .filter((p) => p.image)
    .slice(0, 7)
    .map((p) => p.image);

  return (
    <section className="category-page-full">
      <header className="type-hero">
        {heroImages.length > 0 && (
          <div className="type-hero-strip" aria-hidden>
            {heroImages.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${src}-${i}`} src={src} alt="" />
            ))}
          </div>
        )}
        <div className="container type-hero-copy">
          <h1>Suculentas</h1>
          <p>
            Gibbifloras, Echeverias e demais tipos — inclusive promoção e esgotado. Pedido pelo
            WhatsApp.
          </p>
        </div>
      </header>

      <div className="container category-page">
        <div className="category-toolbar">
          <nav className="breadcrumb-nav" aria-label="breadcrumb">
            <Link href="/">Início</Link>
            <span>/</span>
            <strong>Suculentas</strong>
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
                    <Link href="/suculentas" className="is-active">
                      Todas as suculentas
                    </Link>
                  </li>
                  {sidebarTypes.map((cat) => (
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
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              {products.length} anúncio(s) · esgotados aparecem com aviso por e-mail
            </p>
            <div className="product-row product-row-catalog">
              {products.length === 0 ? (
                <p className="muted">Nenhum anúncio de suculenta ainda.</p>
              ) : (
                products.map((p) => <StoreProductCard key={p.id} product={p} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
