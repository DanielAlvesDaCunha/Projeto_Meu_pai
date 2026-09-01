import Link from "next/link";
import { BannerForm } from "@/components/BannerForm";
import { deleteHeroSlide, toggleHeroSlideActive } from "@/lib/actions/admin";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  await requireAdminSession();
  const slides = await prisma.heroSlide.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });

  return (
    <section className="section admin-page">
      <div className="category-head">
        <h2>Banners da home</h2>
        <Link className="btn-buy" href="/admin/banners/novo" style={{ maxWidth: 180 }}>
          + Novo banner
        </Link>
      </div>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Estes banners são o carrossel grande da tela inicial. Clique em Editar, troque a foto e
        salve — o site abre a home já com a imagem nova.
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Título</th>
              <th>Botão</th>
              <th>Ordem</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr key={slide.id}>
                <td>
                  {slide.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slide.image} alt="" className="admin-thumb-sm admin-banner-thumb" />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <strong>{slide.title}</strong>
                  <div className="muted" style={{ fontSize: "0.75rem" }}>
                    {slide.kicker}
                  </div>
                </td>
                <td>
                  {slide.ctaLabel}
                  <div className="muted" style={{ fontSize: "0.75rem" }}>
                    {slide.ctaHref}
                  </div>
                </td>
                <td>{slide.order}</td>
                <td>
                  {slide.active ? "Ativo" : "Inativo"}
                  <form action={toggleHeroSlideActive} style={{ marginTop: 4 }}>
                    <input type="hidden" name="id" value={slide.id} />
                    <button type="submit" className="link-muted">
                      {slide.active ? "Desativar" : "Ativar"}
                    </button>
                  </form>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/banners/${slide.id}`}>Editar</Link>
                    <form action={deleteHeroSlide}>
                      <input type="hidden" name="id" value={slide.id} />
                      <button type="submit" className="link-danger">
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!slides.length ? (
        <div className="checkout-panel" style={{ marginTop: "1.5rem" }}>
          <h3>Criar primeiro banner</h3>
          <BannerForm />
        </div>
      ) : null}
    </section>
  );
}
