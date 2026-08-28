import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreProductCard } from "@/components/StoreProductCard";
import { SortSelect } from "@/components/SortSelect";
import {
  categoryHref,
  FUTURE_TYPE_LABEL,
  SUCCULENT_TYPE_SLUGS,
} from "@/lib/catalog";
import { DEMO_CATEGORIES, getDemoCatalog } from "@/lib/demoCatalog";
import { getNavCategories, hasUsableDatabaseUrl, prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/money";
import { getStoreConfig, whatsappGeneralUrl } from "@/lib/store";

export const dynamic = "force-dynamic";

const SUCCULENT_SUBTYPE_SLUGS = new Set(
  [...SUCCULENT_TYPE_SLUGS].filter((slug) => slug !== "suculentas")
);

const CATALOG_VISIBLE = {
  OR: [{ available: true }, { stock: { lte: 0 } }],
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ de?: string; ate?: string; ordenar?: string }>;
};

type CatNav = { slug: string; name: string; comingSoon?: boolean; description?: string };

function applySort<T extends { price: number; name: string; id: number }>(
  products: T[],
  sort: string
): T[] {
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

export default async function ProductCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  if (slug === "suculentas") {
    return <SuculentasCatalog sp={sp} />;
  }

  const store = getStoreConfig();
  const wa = whatsappGeneralUrl(store);

  if (!hasUsableDatabaseUrl()) {
    const demoCat = DEMO_CATEGORIES.find((c) => c.slug === slug);
    if (!demoCat) notFound();
    const all = getDemoCatalog().categories;

    if (demoCat.comingSoon) {
      return (
        <ComingSoonView
          name={demoCat.name}
          description={demoCat.description || "Atualização futura — em breve no estoque."}
          wa={wa}
          allCategories={all}
          currentSlug={demoCat.slug}
        />
      );
    }

    const sort = sp.ordenar || "mais-novo";
    let products = applySort(
      demoCat.products.map((p) => ({ ...p, price: p.price })),
      sort
    );
    const de = sp.de ? Number(String(sp.de).replace(",", ".")) : undefined;
    const ate = sp.ate ? Number(String(sp.ate).replace(",", ".")) : undefined;
    if (de != null && !Number.isNaN(de)) products = products.filter((p) => p.price >= de);
    if (ate != null && !Number.isNaN(ate)) products = products.filter((p) => p.price <= ate);

    return (
      <CatalogView
        categoryName={demoCat.name}
        categorySlug={demoCat.slug}
        description={demoCat.description}
        allCategories={all}
        products={products.map((p) => toProductDTO(p))}
        sort={sort}
        sp={sp}
      />
    );
  }

  let category;
  try {
    category = await prisma.category.findUnique({ where: { slug } });
  } catch (error) {
    console.error("Category lookup failed:", error);
    notFound();
  }
  if (!category) notFound();

  const allCategories = await getNavCategories();

  if (category.comingSoon) {
    return (
      <ComingSoonView
        name={category.name}
        description={category.description || "Atualização futura — em breve no estoque."}
        wa={wa}
        allCategories={allCategories}
        currentSlug={category.slug}
      />
    );
  }

  const where: {
    categoryId: number;
    OR: Array<{ available: boolean } | { stock: { lte: number } }>;
    price?: { gte?: number; lte?: number };
  } = {
    categoryId: category.id,
    OR: [{ available: true }, { stock: { lte: 0 } }],
  };

  const de = sp.de ? Number(String(sp.de).replace(",", ".")) : undefined;
  const ate = sp.ate ? Number(String(sp.ate).replace(",", ".")) : undefined;
  if (de != null && !Number.isNaN(de)) where.price = { ...(where.price || {}), gte: de };
  if (ate != null && !Number.isNaN(ate)) where.price = { ...(where.price || {}), lte: ate };

  const sort = sp.ordenar || "mais-novo";
  let orderBy: { price?: "asc" | "desc"; name?: "asc" | "desc"; id?: "asc" | "desc"; stock?: "desc" }[] =
    [{ stock: "desc" }, { id: "desc" }];
  if (sort === "menor-preco") orderBy = [{ price: "asc" }, { name: "asc" }];
  if (sort === "maior-preco") orderBy = [{ price: "desc" }, { name: "asc" }];
  if (sort === "a-z" || sort === "nome") orderBy = [{ name: "asc" }];
  if (sort === "z-a") orderBy = [{ name: "desc" }];
  if (sort === "mais-antigo") orderBy = [{ id: "asc" }];
  if (sort === "mais-novo" || sort === "relevancia") orderBy = [{ id: "desc" }];

  const products = await prisma.product.findMany({ where, orderBy });

  const bounds = await prisma.product.aggregate({
    where: { categoryId: category.id, OR: [{ available: true }, { stock: { lte: 0 } }] },
    _min: { price: true },
    _max: { price: true },
  });

  return (
    <CatalogView
      categoryName={category.name}
      categorySlug={category.slug}
      description={category.description}
      allCategories={allCategories}
      products={products.map((p) => toProductDTO(p))}
      sort={sort}
      sp={sp}
      priceHints={{
        min: bounds._min.price != null ? String(Number(bounds._min.price)) : "0",
        max: bounds._max.price != null ? String(Number(bounds._max.price)) : "100",
      }}
    />
  );
}

async function SuculentasCatalog({ sp }: { sp: { de?: string; ate?: string; ordenar?: string } }) {
  const sort = sp.ordenar || "mais-novo";
  const allCategories = hasUsableDatabaseUrl()
    ? await getNavCategories()
    : getDemoCatalog().categories;

  const succulentTypes = allCategories.filter((c) => SUCCULENT_SUBTYPE_SLUGS.has(c.slug));
  const listingSlugs = new Set(
    succulentTypes.filter((c) => !c.comingSoon).map((c) => c.slug)
  );

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
            Gibbifloras e Echeverias disponíveis agora. Outros tipos com atualização futura. Pedido
            pelo WhatsApp.
          </p>
        </div>
      </header>

      <div className="container category-page">
        <div className="category-toolbar">
          <nav className="breadcrumb-nav" aria-label="breadcrumb">
            <Link href="/">Início</Link>
            <span>/</span>
            <Link href="/produtos">Produtos</Link>
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
                    <Link href={categoryHref("suculentas")} className="is-active">
                      Todas as suculentas
                    </Link>
                  </li>
                  {sidebarTypes.map((cat) => (
                    <li key={cat.slug}>
                      <Link href={categoryHref(cat.slug)}>
                        {cat.name}
                        {cat.comingSoon ? (
                          <span className="cat-soon-tag">{FUTURE_TYPE_LABEL}</span>
                        ) : null}
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

function ComingSoonView({
  name,
  description,
  wa,
  allCategories,
  currentSlug,
}: {
  name: string;
  description: string;
  wa: string;
  allCategories: CatNav[];
  currentSlug: string;
}) {
  const sidebarCats = allCategories.filter((c) => SUCCULENT_SUBTYPE_SLUGS.has(c.slug));
  return (
    <section className="category-page-full">
      <header className="type-hero">
        <div className="container type-hero-copy">
          <p className="coming-soon-kicker">Atualização futura</p>
          <h1>{name}</h1>
          <p>{description || "Este tipo ainda vai entrar no estoque da loja."}</p>
          <a className="btn-buy" href={wa} target="_blank" rel="noopener noreferrer" style={{ maxWidth: 260 }}>
            Avisar no WhatsApp
          </a>
        </div>
      </header>
      <div className="container category-page">
        <nav className="breadcrumb-nav" aria-label="breadcrumb">
          <Link href="/">Início</Link>
          <span>/</span>
          <Link href="/produtos">Produtos</Link>
          <span>/</span>
          <Link href={categoryHref("suculentas")}>Suculentas</Link>
          <span>/</span>
          <span>{name}</span>
        </nav>
        <ul className="filter-cats filter-cats-inline">
          {sidebarCats.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={categoryHref(cat.slug)}
                className={cat.slug === currentSlug ? "is-active" : undefined}
              >
                {cat.name}
                {cat.comingSoon ? ` · ${FUTURE_TYPE_LABEL}` : ""}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CatalogView({
  categoryName,
  categorySlug,
  description,
  allCategories,
  products,
  sort,
  sp,
  priceHints,
}: {
  categoryName: string;
  categorySlug: string;
  description?: string;
  allCategories: CatNav[];
  products: ReturnType<typeof toProductDTO>[];
  sort: string;
  sp: { de?: string; ate?: string };
  priceHints?: { min: string; max: string };
}) {
  const isSucculent = SUCCULENT_SUBTYPE_SLUGS.has(categorySlug);
  const sidebarCats = isSucculent
    ? allCategories.filter((c) => SUCCULENT_SUBTYPE_SLUGS.has(c.slug))
    : allCategories.filter((c) => c.slug === "cactos" || c.slug === "kits" || !SUCCULENT_SUBTYPE_SLUGS.has(c.slug));
  const heroImages = products
    .filter((p) => p.image)
    .slice(0, 7)
    .map((p) => p.image);
  const subtitle =
    description ||
    (isSucculent
      ? `Confira as variedades de ${categoryName} disponíveis na Paulo Suculentas.`
      : `Anúncios de ${categoryName}. Pedido e pagamento pelo WhatsApp.`);

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
          <h1>{categoryName}</h1>
          <p>{subtitle}</p>
        </div>
      </header>

      <div className="container category-page">
        <div className="category-toolbar">
          <nav className="breadcrumb-nav" aria-label="breadcrumb">
            <Link href="/">Início</Link>
            <span>/</span>
            <Link href="/produtos">Produtos</Link>
            <span>/</span>
            {isSucculent ? (
              <>
                <Link href={categoryHref("suculentas")}>Suculentas</Link>
                <span>/</span>
              </>
            ) : null}
            <strong>{categoryName}</strong>
          </nav>
          <SortSelect defaultValue={sort} de={sp.de} ate={sp.ate} />
        </div>

        <div className="category-layout">
          <aside>
            <div className="filter-panel">
              <p className="filter-by-label">Filtrar por</p>
              <details open>
                <summary>{isSucculent ? "Tipos" : "Categorias"}</summary>
                <ul className="filter-cats">
                  <li>
                    <Link href="/produtos">Todos os anúncios</Link>
                  </li>
                  {isSucculent && (
                    <li>
                      <Link href={categoryHref("suculentas")}>Todas as suculentas</Link>
                    </li>
                  )}
                  {sidebarCats.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={categoryHref(cat.slug)}
                        className={cat.slug === categorySlug ? "is-active" : undefined}
                      >
                        {cat.name}
                        {cat.comingSoon ? (
                          <span className="cat-soon-tag">{FUTURE_TYPE_LABEL}</span>
                        ) : null}
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
                      <input
                        type="number"
                        name="de"
                        step="0.01"
                        min="0"
                        placeholder={priceHints?.min || "0"}
                        defaultValue={sp.de || ""}
                      />
                    </label>
                    <label>
                      <span className="muted">Até</span>
                      <input
                        type="number"
                        name="ate"
                        step="0.01"
                        min="0"
                        placeholder={priceHints?.max || "100"}
                        defaultValue={sp.ate || ""}
                      />
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
            <div className="product-row product-row-catalog">
              {products.length === 0 ? (
                <p className="muted">Nenhum anúncio neste tipo ainda.</p>
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
