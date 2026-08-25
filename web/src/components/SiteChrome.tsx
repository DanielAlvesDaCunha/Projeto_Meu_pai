import Link from "next/link";
import { CartButton, CartDrawer, CartToast } from "@/components/CartUI";
import { getStoreConfig, whatsappGeneralUrl } from "@/lib/store";
import { getNavCategories } from "@/lib/prisma";

export async function SiteHeader() {
  const store = getStoreConfig();
  const wa = whatsappGeneralUrl(store);
  const categories = await getNavCategories();

  return (
    <>
      <div className="adbar">
        Pedidos pelo WhatsApp · envio ou retirada combinados na conversa
      </div>
      <header className="site-header">
        <div className="head-row">
          <form className="search-box" action="/" method="get" role="search">
            <input type="search" name="q" placeholder="O que você está buscando?" aria-label="Buscar" />
            <button type="submit" aria-label="Buscar">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </button>
          </form>
          <Link className="logo" href="/">
            <span className="logo-mark" aria-hidden />
            <span className="logo-text">{store.storeName}</span>
          </Link>
          <div className="header-actions">
            <a className="util-wa" href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <CartButton />
          </div>
        </div>
        <nav className="nav-bar">
          <Link href="/">Início</Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`}>
              {cat.name}
            </Link>
          ))}
          <Link href="/#promocoes">Promoções</Link>
          <Link href="/como-pedir">Como pedir</Link>
          <Link href="/contato">Contato</Link>
        </nav>
      </header>
    </>
  );
}

export async function SiteFooter() {
  const store = getStoreConfig();
  const wa = whatsappGeneralUrl(store);
  const categories = await getNavCategories();
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
              <Link key={cat.slug} href={`/${cat.slug}`}>
                {cat.name}
              </Link>
            ))}
            <Link href="/#promocoes">Promoções</Link>
          </div>
          <div>
            <strong>Navegação</strong>
            <Link href="/como-pedir">Como pedir</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/pedido">Meu pedido</Link>
          </div>
          <div>
            <strong>Entre em contato</strong>
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp {store.whatsappLabel}
            </a>
            <span>Seg a sáb · horário comercial</span>
            <span>Pagamento combinado no chat (Pix)</span>
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
