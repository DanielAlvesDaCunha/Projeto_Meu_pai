import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/money";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ de?: string; ate?: string; ordenar?: string }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const allCategories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  const where: {
    available: boolean;
    categoryId: number;
    price?: { gte?: number; lte?: number };
  } = {
    available: true,
    categoryId: category.id,
  };

  const de = sp.de ? Number(String(sp.de).replace(",", ".")) : undefined;
  const ate = sp.ate ? Number(String(sp.ate).replace(",", ".")) : undefined;
  if (de != null && !Number.isNaN(de)) where.price = { ...(where.price || {}), gte: de };
  if (ate != null && !Number.isNaN(ate)) where.price = { ...(where.price || {}), lte: ate };

  const sort = sp.ordenar || "relevancia";
  let orderBy: { price?: "asc" | "desc"; name?: "asc"; order?: "asc" }[] = [
    { order: "asc" },
    { name: "asc" },
  ];
  if (sort === "menor-preco") orderBy = [{ price: "asc" }, { name: "asc" }];
  if (sort === "maior-preco") orderBy = [{ price: "desc" }, { name: "asc" }];
  if (sort === "nome") orderBy = [{ name: "asc" }];

  const products = await prisma.product.findMany({ where, orderBy });

  const bounds = await prisma.product.aggregate({
    where: { available: true, categoryId: category.id },
    _min: { price: true },
    _max: { price: true },
  });

  return (
    <section className="container category-page">
      <nav className="breadcrumb-nav" aria-label="breadcrumb">
        <Link href="/">Início</Link>
        <span>/</span>
        <span>{category.name}</span>
      </nav>

      <div className="category-layout">
        <aside>
          <div className="filter-panel">
            <details open>
              <summary>Categorias</summary>
              <ul className="filter-cats">
                {allCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/${cat.slug}`}
                      className={cat.slug === category.slug ? "is-active" : undefined}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
            <details open>
              <summary>Preço</summary>
              <form method="get">
                {sort !== "relevancia" && <input type="hidden" name="ordenar" value={sort} />}
                <div className="price-inputs">
                  <label>
                    <span className="muted">De</span>
                    <input
                      type="number"
                      name="de"
                      step="0.01"
                      min="0"
                      placeholder={
                        bounds._min.price != null ? String(Number(bounds._min.price)) : "0"
                      }
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
                      placeholder={
                        bounds._max.price != null ? String(Number(bounds._max.price)) : "100"
                      }
                      defaultValue={sp.ate || ""}
                    />
                  </label>
                </div>
                <button type="submit" className="btn-filter">
                  Aplicar
                </button>
              </form>
            </details>
          </div>
        </aside>

        <div>
          <div className="category-head">
            <h1>{category.name}</h1>
            <SortSelect defaultValue={sort} de={sp.de} ate={sp.ate} />
          </div>

          <div className="product-row">
            {products.length === 0 ? (
              <p className="muted">Nenhum produto nesta categoria.</p>
            ) : (
              products.map((p) => <ProductCard key={p.id} product={toProductDTO(p)} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
