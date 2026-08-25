import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/money";
import { getStoreConfig } from "@/lib/store";

export const dynamic = "force-dynamic";

type CatWithProducts = {
  id: number;
  name: string;
  slug: string;
  order: number;
  products: Array<{
    id: number;
    name: string;
    sku: string;
    description: string;
    price: { toString(): string } | number;
    oldPrice: { toString(): string } | number | null;
    image: string;
    featured: boolean;
  }>;
};

type ProductRow = CatWithProducts["products"][number];

export default async function HomePage() {
  const store = getStoreConfig();
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
        take: 8,
        orderBy: [{ order: "asc" }, { name: "asc" }],
      });

      novidades = await prisma.product.findMany({
        where: { available: true },
        take: 8,
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
    <>
      <section className="hero-est">
        <div className="hero-slide">
          <div className="hero-copy">
            <p className="hero-kicker">Grande variedade de</p>
            <h1>suculentas</h1>
            <Link className="btn-buy hero-cta" href="#promocoes">
              Comprar
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-plants"
            src="https://images.unsplash.com/photo-1459156212016-c8128e64e80f?auto=format&fit=crop&w=1600&q=80"
            alt={store.storeName}
          />
        </div>
      </section>

      <section className="services-row">
        <div className="container services-grid">
          <div className="service-card">
            <div className="service-badge">1</div>
            <div>
              <h3>Envio individual</h3>
              <p>As plantas são enviadas individualmente e identificadas</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-badge">2</div>
            <div>
              <h3>Site seguro</h3>
              <p>Você só paga depois de confirmar no WhatsApp</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-badge">3</div>
            <div>
              <h3>Enviamos / retirada</h3>
              <p>Receba suas plantas onde estiver!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section" id="categorias">
        <div className="section-title">
          <h2>Compre por categoria:</h2>
        </div>
        <div className="category-grid">
          {categories.map((cat) => {
            const img = cat.products[0]?.image;
            return (
              <Link key={cat.slug} className="category-card" href={`/${cat.slug}`}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={cat.name} loading="lazy" />
                ) : (
                  <div className="category-fallback" />
                )}
                <span className="category-label">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container section" id="promocoes">
        <div className="section-title">
          <h2>Promoções</h2>
        </div>
        <div className="product-row">
          {featured.map((p) => (
            <ProductCard key={p.id} product={toProductDTO(p)} />
          ))}
        </div>
      </section>

      <section className="banner-trio">
        <div className="banner-grid">
          {categories.map((cat) => {
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
          <h2>Novidades</h2>
        </div>
        <div className="product-row">
          {novidades.map((p) => (
            <ProductCard key={p.id} product={toProductDTO(p)} />
          ))}
        </div>
      </section>

      {categories.map((cat) => (
        <section key={cat.slug} className="container section" id={cat.slug}>
          <div className="section-title">
            <h2>{cat.name}</h2>
          </div>
          <div className="product-row">
            {cat.products.map((p) => (
              <ProductCard key={p.id} product={toProductDTO(p)} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
