"use client";

import Link from "next/link";
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
  { href: "/promocoes", label: "Promoções" },
  { href: "/novidades", label: "Novidades" },
  { href: "/como-pedir", label: "Como pedir" },
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      />
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <header className="head-main">
        <div className="head-social-bar head-desktop-only">
          <div className="head-social-inner">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                <path
                  fill="currentColor"
                  d="M16.1 3C9.4 3 4 8.3 4 14.9c0 2.1.6 4.1 1.6 5.9L4 29l8.4-1.6c1.7.9 3.6 1.4 5.6 1.4 6.7 0 12.1-5.4 12.1-12S22.8 3 16.1 3zm0 21.9c-1.8 0-3.5-.5-5-1.3l-.4-.2-5 1 1-4.8-.2-.4A9.7 9.7 0 0 1 6.3 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.9-9.8 9.9z"
                />
              </svg>
            </a>
            <a href="/contato" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                <path
                  fill="currentColor"
                  d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
                />
              </svg>
            </a>
            <a href="/contato" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                <path
                  fill="currentColor"
                  d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z"
                />
              </svg>
            </a>
          </div>
        </div>

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
                <SearchIcon />
              </button>
            </form>

            <div className="head-utilities head-desktop-only">
              <a className="util-item" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"
                  />
                </svg>
                <span>Atendimento</span>
              </a>
              <Link className="util-item" href={accountHref(user)}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
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
              <SearchIcon />
            </button>
          </form>
        </div>

        <div className="head-nav-wrap head-desktop-only" ref={megaRef}>
          <nav className="nav-desktop" aria-label="Principal">
            <Link href="/">Início</Link>

            <button
              type="button"
              className={`nav-produtos-btn${produtosOpen ? " is-open" : ""}`}
              aria-expanded={produtosOpen}
              aria-controls="mega-produtos"
              onClick={() => setProdutosOpen((v) => !v)}
              onMouseEnter={() => setProdutosOpen(true)}
            >
              Produtos
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {NAV_AFTER.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setProdutosOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>

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
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    onClick={() => setProdutosOpen(false)}
                  >
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
                  Contato / WhatsApp
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Falar no WhatsApp
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
