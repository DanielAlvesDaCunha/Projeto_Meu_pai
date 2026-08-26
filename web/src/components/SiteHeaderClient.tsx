"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartButton } from "@/components/CartUI";
import { MobileNav } from "@/components/MobileNav";

type NavCategory = { slug: string; name: string };

type Props = {
  storeName: string;
  storeTagline: string;
  whatsappUrl: string;
  categories: NavCategory[];
  user: { name?: string | null; role?: string } | null;
};

const NAV_AFTER = [
  { href: "/como-pedir", label: "Como pedir" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/novidades", label: "Novidades" },
  { href: "/contato", label: "Contato" },
] as const;

function accountHref(user: Props["user"]) {
  if (!user) return "/entrar";
  if (user.role === "ADMIN") return "/admin";
  return "/conta";
}

function accountLabel(user: Props["user"]) {
  if (!user) return "Entrar";
  if (user.role === "ADMIN") return "Gerenciar loja";
  return "Minha conta";
}

/** Ícones próprios (outline) — diferentes da referência */
function IconIg() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFb() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M14 8h2V5h-2a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h2.2l.5-3H13V9a1 1 0 0 1 1-1z" strokeLinejoin="round" />
    </svg>
  );
}
function IconYt() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="M10 9.5v5l5-2.5-5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconTk() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M14 4v9.2a3.8 3.8 0 1 1-2.6-3.6" strokeLinecap="round" />
      <path d="M14 7.2c1.2 1.4 2.8 2.2 4.5 2.4" strokeLinecap="round" />
    </svg>
  );
}
function IconSupport() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 12a8 8 0 0 1 16 0" strokeLinecap="round" />
      <path d="M4 12v2.5A2.5 2.5 0 0 0 6.5 17H8v-5H4zm16 0v2.5A2.5 2.5 0 0 1 17.5 17H16v-5h4z" />
      <path d="M12 19h1.5a2 2 0 0 0 2-2v-.5" strokeLinecap="round" />
    </svg>
  );
}
function IconAccount() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.2c1.6-3.2 4-4.7 7-4.7s5.4 1.5 7 4.7" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
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
        {/* Faixa 1 — redes */}
        <div className="head-social-bar head-desktop-only">
          <div className="head-social-inner">
            <a href="/contato" aria-label="Instagram">
              <IconIg />
            </a>
            <a href="/contato" aria-label="Facebook">
              <IconFb />
            </a>
            <a href="/contato" aria-label="YouTube">
              <IconYt />
            </a>
            <a href="/contato" aria-label="TikTok">
              <IconTk />
            </a>
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

            <form className="head-search head-desktop-only" action="/" method="get" role="search">
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
              <Link className="util-item" href={accountHref(user)}>
                <IconAccount />
                <span>{accountLabel(user)}</span>
              </Link>
              <CartButton variant="utility" />
            </div>

            <div className="head-cart-mobile head-mobile-only">
              <CartButton />
            </div>
          </div>

          <form
            className="head-search head-search-mobile head-mobile-only"
            action="/"
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

              <button
                type="button"
                className={`nav-produtos-btn${produtosOpen ? " is-open" : ""}`}
                aria-expanded={produtosOpen}
                aria-controls="mega-produtos"
                onClick={() => setProdutosOpen((v) => !v)}
                onMouseEnter={() => setProdutosOpen(true)}
              >
                Produtos
                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden>
                  <path fill="currentColor" d="M6.7 9.3 12 14.6l5.3-5.3 1.4 1.4L12 17.4 5.3 10.7z" />
                </svg>
              </button>

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
                <strong>Destaques</strong>
                <Link href="/novidades" onClick={() => setProdutosOpen(false)}>
                  Novidades e lançamentos
                </Link>
                <Link href="/promocoes" onClick={() => setProdutosOpen(false)}>
                  Promoções
                </Link>
                <Link href="/pedido" onClick={() => setProdutosOpen(false)}>
                  Meu pedido
                </Link>
              </div>
              <div className="mega-col">
                <strong>Categorias</strong>
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/${cat.slug}`} onClick={() => setProdutosOpen(false)}>
                    {cat.name}
                  </Link>
                ))}
              </div>
              <div className="mega-col">
                <strong>Ajuda</strong>
                <Link href="/como-pedir" onClick={() => setProdutosOpen(false)}>
                  Como pedir
                </Link>
                <Link href="/contato" onClick={() => setProdutosOpen(false)}>
                  Contato
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp
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
