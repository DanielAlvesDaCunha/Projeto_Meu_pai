import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { StoreProductCard } from "@/components/StoreProductCard";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/money";

export const dynamic = "force-dynamic";

type CatWithProducts = {
  id: number;
  name: string;
  slug: string;
  order: number;
  comingSoon?: boolean;
  products: Array<{
    id: number;
    name: string;
    sku: string;
    description: string;
    price: { toString(): string } | number;
    oldPrice: { toString(): string } | number | null;
    image: string;
    featured: boolean;
    stock?: number;
  }>;
};

type ProductRow = CatWithProducts["products"][number];

export default async function HomePage() {
  let categories: CatWithProducts[] = [];
  let featured: ProductRow[] = [];
  let novidades: ProductRow[] = [];

  if (hasUsableDatabaseUrl()) {
    try {
      categories = await prisma.category.findMany({
        orderBy: { order: "asc" },
        include: {
          products: {
            where: { available: true },
            orderBy: [{ order: "asc" }, { name: "asc" }],
            take: 12,
          },
        },
      });

      featured = await prisma.product.findMany({
        where: { available: true, featured: true },
        take: 4,
        orderBy: [{ order: "asc" }, { name: "asc" }],
      });

      novidades = await prisma.product.findMany({
        where: { available: true },
        take: 4,
        orderBy: [{ createdAt: "desc" }, { order: "asc" }],
      });
    } catch (error) {
      console.error("Home catalog query failed:", error);
    }
  }

  // Sem banco / sem produtos → exemplos com fotos da web (Unsplash)
  if (!categories.length || !featured.length) {
    const demo = getDemoCatalog();
    categories = demo.categories;
    featured = demo.featured;
    novidades = demo.novidades;
  }

  return (
    <div className="template-home">
      <HeroCarousel />

      <section className="services-row">
        <div className="container services-grid">
          <div className="service-card">
            <div className="service-badge" aria-hidden>
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path
                  fill="currentColor"
                  d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3>Envio individual</h3>
              <p>As plantas são enviadas individualmente e identificadas</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-badge" aria-hidden>
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path
                  fill="currentColor"
                  d="M12 1 3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4zm-1 15.3-3.8-3.8 1.4-1.4 2.4 2.4 5.2-5.2 1.4 1.4L11 16.3z"
                />
              </svg>
            </div>
            <div>
              <h3>Site seguro</h3>
              <p>Você só paga depois de confirmar no WhatsApp</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-badge" aria-hidden>
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path
                  fill="currentColor"
                  d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                />
              </svg>
            </div>
            <div>
              <h3>Enviamos / retirada</h3>
              <p>Receba suas plantas onde estiver!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section" id="categorias">
        <div className="section-title">
          <h2>Compre por tipo:</h2>
        </div>
        <div className="category-grid">
          {categories.map((cat) => {
            const img = cat.products[0]?.image;
            return (
              <Link
                key={cat.slug}
                className={`category-card${cat.comingSoon ? " is-coming-soon" : ""}`}
                href={`/${cat.slug}`}
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={cat.name} loading="lazy" />
                ) : (
                  <div className="category-fallback" />
                )}
                <span className="category-label">
                  {cat.name}
                  {cat.comingSoon ? <span className="cat-soon-tag">Em breve</span> : null}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container section" id="promocoes">
        <div className="section-title">
          <h2>
            <Link href="/promocoes">Promoções</Link>
          </h2>
          <Link className="section-more" href="/promocoes">
            Ver todas
          </Link>
        </div>
        <div className="product-row product-row-4">
          {featured.slice(0, 4).map((p) => (
            <StoreProductCard key={p.id} product={toProductDTO(p)} />
          ))}
        </div>
      </section>

      <section className="banner-trio">
        <div className="banner-grid">
          {categories
            .filter((cat) => !cat.comingSoon)
            .slice(0, 3)
            .map((cat) => {
              const img = cat.products[0]?.image;
              return (
                <Link key={cat.slug} className="banner-panel" href={`/${cat.slug}`}>
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={cat.name} loading="lazy" />
                  ) : (
                    <div className="category-fallback" style={{ height: "100%" }} />
                  )}
                  <div className="banner-overlay">
                    <h3>{cat.name}</h3>
                    <p>Novidades</p>
                    <span className="btn-buy btn-sm-banner">Ver mais</span>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="container section" id="novidades">
        <div className="section-title">
          <h2>
            <Link href="/novidades">Novidades</Link>
          </h2>
          <Link className="section-more" href="/novidades">
            Ver todas
          </Link>
        </div>
        <div className="product-row product-row-4">
          {novidades.slice(0, 4).map((p) => (
            <StoreProductCard key={p.id} product={toProductDTO(p)} />
          ))}
        </div>
      </section>
    </div>
  );
}
