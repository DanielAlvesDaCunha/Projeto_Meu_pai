import Link from "next/link";
import { categoryHref, FUTURE_TYPE_LABEL, shopTypeNav } from "@/lib/catalog";
import { CartDrawer, CartToast } from "@/components/CartUI";
import { SiteHeaderClient } from "@/components/SiteHeaderClient";
import { getStoreConfig, whatsappGeneralUrl } from "@/lib/store";
import { getNavCategories } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function SiteHeader() {
  const store = getStoreConfig();
  const wa = whatsappGeneralUrl(store);
  const categories = await getNavCategories();
  const user = await getSessionUser();

  return (
    <SiteHeaderClient
      storeName={store.storeName}
      storeTagline="SUCULENTAS & CACTOS"
      whatsappUrl={wa}
      categories={categories}
      user={user}
    />
  );
}

export async function SiteFooter() {
  const store = getStoreConfig();
  const wa = whatsappGeneralUrl(store);
  const categories = shopTypeNav(await getNavCategories());
  const year = new Date().getFullYear();

  return (
    <>
      <section className="social-band">
        <div className="container social-grid">
          <div>
            <h2>Nos acompanhe pelo WhatsApp</h2>
            <p>Tire dúvidas, envie foto da muda e finalize o pedido na conversa.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontWeight: 700 }}>
              {store.whatsappLabel}
            </a>
          </div>
          <div>
            <h3>Como pedir</h3>
            <p>Escolha no site → confirme no WhatsApp → pague só depois de combinar.</p>
            <Link className="btn-light-solid" href="/como-pedir">
              Ver tutorial
            </Link>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <strong>Departamentos</strong>
            {categories.map((cat) => (
              <Link key={cat.slug} href={categoryHref(cat.slug)}>
                {cat.name}
                {cat.comingSoon ? ` · ${FUTURE_TYPE_LABEL}` : ""}
              </Link>
            ))}
            <Link href="/produtos">Catálogo completo</Link>
            <Link href="/lancamentos">Lançamentos</Link>
            <Link href="/destaques">Destaques</Link>
            <Link href="/promocoes">Promoções</Link>
          </div>
          <div>
            <strong>Navegação</strong>
            <Link href="/como-pedir">Como pedir</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/pedido">Meu pedido</Link>
            <Link href="/conta">Minha conta</Link>
          </div>
          <div>
            <strong>Entre em contato</strong>
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp {store.whatsappLabel}
            </a>
            <span>Seg a sáb · horário comercial</span>
            <span>Pagamento online (Pix) ou WhatsApp</span>
          </div>
        </div>
        <div className="container pay-row">
          <div>
            <span className="pay-label">Meios de pagamento</span>
            <div className="pay-icons">
              <span>Pix</span>
              <span>Cartão</span>
              <span>Boleto</span>
            </div>
          </div>
          <div>
            <span className="pay-label">Envio</span>
            <div className="pay-icons">
              <span>Combinado no WhatsApp</span>
            </div>
          </div>
        </div>
        <div className="footer-copy">
          Copyright {store.storeName} — {year}. Todos os direitos reservados.
        </div>
      </footer>
      <a className="wa-float" href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden>
          <path
            fill="currentColor"
            d="M16.1 3C9.4 3 4 8.3 4 14.9c0 2.1.6 4.1 1.6 5.9L4 29l8.4-1.6c1.7.9 3.6 1.4 5.6 1.4 6.7 0 12.1-5.4 12.1-12S22.8 3 16.1 3zm0 21.9c-1.8 0-3.5-.5-5-1.3l-.4-.2-5 1 1-4.8-.2-.4A9.7 9.7 0 0 1 6.3 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.9-9.8 9.9z"
          />
        </svg>
      </a>
      <CartDrawer />
      <CartToast />
    </>
  );
}
