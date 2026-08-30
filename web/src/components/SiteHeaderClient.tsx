"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  categoryHref,
  FUTURE_TYPE_LABEL,
  MAIN_CAROUSEL_LABELS,
  MAIN_CAROUSEL_SLUGS,
  PRIMARY_NAV,
  SUCCULENT_TYPE_SLUGS,
  isMainCarouselSlug,
} from "@/lib/catalog";
import { useEffect, useRef, useState } from "react";
import { CartButton } from "@/components/CartUI";
import { AccountMenu } from "@/components/AccountMenu";
import { MobileNav } from "@/components/MobileNav";

type NavCategory = { slug: string; name: string; comingSoon?: boolean };

type Props = {
  storeName: string;
  storeTagline: string;
  whatsappUrl: string;
  categories: NavCategory[];
  user: { name?: string | null; role?: string } | null;
};

const NAV_AFTER = PRIMARY_NAV;

/** Ícones de utilitário (outline) */
function IconSupport() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 12a8 8 0 0 1 16 0" strokeLinecap="round" />
      <path d="M4 12v2.5A2.5 2.5 0 0 0 6.5 17H8v-5H4zm16 0v2.5A2.5 2.5 0 0 1 17.5 17H16v-5h4z" />
      <path d="M12 19h1.5a2 2 0 0 0 2-2v-.5" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.2 16.2 20 20" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeaderClient({
  storeName,
  storeTagline,
  whatsappUrl,
  categories,
  user,
}: Props) {
  const pathname = usePathname();
  const typeCategories = categories.filter(
    (cat) => SUCCULENT_TYPE_SLUGS.has(cat.slug) && cat.slug !== "suculentas" && !isMainCarouselSlug(cat.slug)
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!produtosOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!megaRef.current?.contains(e.target as Node)) setProdutosOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProdutosOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [produtosOpen]);

  useEffect(() => {
    setProdutosOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`head-main${scrolled ? " is-compact" : ""}`}>
        {/* Faixa 1 — aviso WhatsApp */}
        <div className="head-social-bar head-desktop-only">
          <div className="head-social-inner head-adbar-inner">
            Pedidos pelo WhatsApp · envio ou retirada combinados na conversa
          </div>
        </div>

        {/* Faixa 2 — logo | busca | utilitários */}
        <div className="head-inner">
          <div className="head-top">
            <button
              type="button"
              className="menu-toggle head-mobile-only"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>

            <Link className="head-logo" href="/" onClick={() => setMenuOpen(false)}>
              <span className="logo-mark" aria-hidden />
              <span className="logo-stack">
                <span className="logo-text">{storeName}</span>
                <span className="logo-tagline">{storeTagline}</span>
              </span>
            </Link>

            <form className="head-search head-desktop-only" action="/produtos" method="get" role="search">
              <input
                type="search"
                name="q"
                placeholder="O que você está buscando?"
                aria-label="Buscar"
              />
              <button type="submit" aria-label="Buscar">
                <IconSearch />
              </button>
            </form>

            <div className="head-utilities head-desktop-only">
              <a className="util-item" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <IconSupport />
                <span>Atendimento</span>
              </a>
              <AccountMenu user={user} />
              <CartButton variant="utility" />
            </div>

            <div className="head-cart-mobile head-mobile-only">
              <CartButton />
            </div>
          </div>

          <form
            className="head-search head-search-mobile head-mobile-only"
            action="/produtos"
            method="get"
            role="search"
          >
            <input
              type="search"
              name="q"
              placeholder="O que você está buscando?"
              aria-label="Buscar"
            />
            <button type="submit" aria-label="Buscar">
              <IconSearch />
            </button>
          </form>
        </div>

        {/* Faixa 3 — menu */}
        <div className="head-nav-wrap head-desktop-only" ref={megaRef}>
          <div className="head-nav-bar">
            <nav className="nav-desktop" aria-label="Principal">
              <Link href="/" className={pathname === "/" ? "is-active" : undefined}>
                Início
              </Link>

              <Link
                href="/produtos"
                className={`nav-produtos-btn${produtosOpen || pathname === "/produtos" ? " is-open" : ""}${pathname === "/produtos" ? " is-active" : ""}`}
                aria-expanded={produtosOpen}
                aria-controls="mega-produtos"
                onMouseEnter={() => setProdutosOpen(true)}
                onClick={() => setProdutosOpen(false)}
              >
                Produtos
                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden>
                  <path fill="currentColor" d="M6.7 9.3 12 14.6l5.3-5.3 1.4 1.4L12 17.4 5.3 10.7z" />
                </svg>
              </Link>

              {NAV_AFTER.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? "is-active" : undefined}
                  onClick={() => setProdutosOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div
            id="mega-produtos"
            className={`mega-menu${produtosOpen ? " is-open" : ""}`}
            onMouseLeave={() => setProdutosOpen(false)}
          >
            <div className="mega-menu-inner">
              <div className="mega-col">
                <strong>Categorias</strong>
                <Link href="/produtos" onClick={() => setProdutosOpen(false)}>
                  Catálogo completo
                </Link>
                {MAIN_CAROUSEL_SLUGS.map((slug) => (
                  <Link key={slug} href={categoryHref(slug)} onClick={() => setProdutosOpen(false)}>
                    {MAIN_CAROUSEL_LABELS[slug]}
                  </Link>
                ))}
                <Link href="/lancamentos" onClick={() => setProdutosOpen(false)}>
                  Lançamentos
                </Link>
                <Link href="/destaques" onClick={() => setProdutosOpen(false)}>
                  Destaques
                </Link>
                <Link href="/promocoes" onClick={() => setProdutosOpen(false)}>
                  Promoções
                </Link>
              </div>
              <div className="mega-col">
                <strong>Tipos</strong>
                {typeCategories.map((cat) => (
                  <Link key={cat.slug} href={categoryHref(cat.slug)} onClick={() => setProdutosOpen(false)}>
                    {cat.name}
                    {cat.comingSoon ? <span className="nav-soon">{FUTURE_TYPE_LABEL}</span> : null}
                  </Link>
                ))}
              </div>
              <div className="mega-col">
                <strong>Pedido</strong>
                <Link href="/como-pedir" onClick={() => setProdutosOpen(false)}>
                  Como pedir
                </Link>
                <Link href="/contato" onClick={() => setProdutosOpen(false)}>
                  Contato
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp (pagamento)
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={categories}
        user={user}
        whatsappUrl={whatsappUrl}
      />
    </>
  );
}
