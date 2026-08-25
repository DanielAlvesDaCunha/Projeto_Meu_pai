"use client";

import Link from "next/link";
import { useState } from "react";
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

const NAV_LINKS = [
  { href: "/promocoes", label: "Promoções" },
  { href: "/novidades", label: "Novidades" },
  { href: "/como-pedir", label: "Como pedir" },
  { href: "/contato", label: "Contato" },
] as const;

export function SiteHeaderClient({
  storeName,
  storeTagline,
  whatsappUrl,
  categories,
  user,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="head-main">
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
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>
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
              {user?.role === "ADMIN" ? (
                <Link className="util-item util-item-admin" href="/admin">
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                    />
                  </svg>
                  <span>Painel admin</span>
                </Link>
              ) : null}
              <Link className="util-item" href={user ? "/conta" : "/entrar"}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
                <span>{user ? "Minha conta" : "Entrar"}</span>
              </Link>
              <CartButton variant="utility" />
            </div>

            <div className="head-cart-mobile head-mobile-only">
              <CartButton />
            </div>
          </div>

          <form className="head-search head-search-mobile head-mobile-only" action="/" method="get" role="search">
            <input
              type="search"
              name="q"
              placeholder="O que você está buscando?"
              aria-label="Buscar"
            />
            <button type="submit" aria-label="Buscar">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </button>
          </form>
        </div>

        <nav className="nav-desktop head-desktop-only" aria-label="Principal">
          <Link href="/">Início</Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`}>
              {cat.name}
            </Link>
          ))}
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
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
