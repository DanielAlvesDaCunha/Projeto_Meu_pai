import Link from "next/link";
import { redirect } from "next/navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCarousel } from "@/components/ProductCarousel";
import {
  categoryHref,
  MAIN_CAROUSEL_LABELS,
  MAIN_CAROUSEL_SLUGS,
  type MainCarouselSlug,
} from "@/lib/catalog";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { getHeroSlides } from "@/lib/hero";
import { getDestaques, getLancamentos } from "@/lib/listings";
import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";

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

type HomeProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: HomeProps) {
  const sp = await searchParams;
  if (sp.q?.trim()) {
    redirect(`/produtos?q=${encodeURIComponent(sp.q.trim())}`);
  }

  const heroSlides = await getHeroSlides();
  let categories: CatWithProducts[] = [];
  const [lancamentos, destaques] = await Promise.all([getLancamentos(12), getDestaques(12)]);

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
    } catch (error) {
      console.error("Home catalog query failed:", error);
    }
  }

  if (!categories.length) {
    categories = getDemoCatalog().categories;
  }

  const categoryBySlug = new Map(categories.map((cat) => [cat.slug, cat]));

  function carouselImage(slug: MainCarouselSlug) {
    return categoryBySlug.get(slug)?.products[0]?.image || "";
  }

  const carouselTiles = MAIN_CAROUSEL_SLUGS.map((slug) => ({
    slug,
    name: MAIN_CAROUSEL_LABELS[slug],
    href: categoryHref(slug),
    image: carouselImage(slug),
  }));

  return (
    <div className="template-home">
      <HeroCarousel slides={heroSlides} />

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

      <section className="container section" id="lancamentos">
        <div className="section-title is-display">
          <h2>
            <Link href="/lancamentos">Lançamentos</Link>
          </h2>
          <Link className="section-more" href="/lancamentos">
            Ver todas
          </Link>
        </div>
        <ProductCarousel
          products={lancamentos}
          emptyText="Nenhum lançamento nos últimos 30 dias."
        />
      </section>

      <section className="container section" id="destaques">
        <div className="section-title is-display">
          <h2>
            <Link href="/destaques">Destaques</Link>
          </h2>
          <Link className="section-more" href="/destaques">
            Ver todas
          </Link>
        </div>
        <ProductCarousel
          products={destaques}
          emptyText="Nenhum destaque no momento."
          defaultFeatured
        />
      </section>

      <section className="banner-trio">
        <div className="banner-grid">
          {carouselTiles.map((tile) => (
            <Link key={tile.slug} className="banner-panel" href={tile.href}>
              {tile.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tile.image} alt={tile.name} loading="lazy" />
              ) : (
                <div className="category-fallback" style={{ height: "100%" }} />
              )}
              <div className="banner-overlay">
                <h3>{tile.name}</h3>
                <p>Ver anúncios</p>
                <span className="btn-buy btn-sm-banner">Ver mais</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
