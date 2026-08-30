"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutAdmin, logoutUser } from "@/lib/actions/auth";
import { categoryHref, FUTURE_TYPE_LABEL, MAIN_CAROUSEL_LABELS, MAIN_CAROUSEL_SLUGS, PRIMARY_NAV, SUCCULENT_TYPE_SLUGS, isMainCarouselSlug } from "@/lib/catalog";

type NavCategory = { slug: string; name: string; comingSoon?: boolean };

type Props = {
  open: boolean;
  onClose: () => void;
  categories: NavCategory[];
  user: { name?: string | null; role?: string } | null;
  whatsappUrl: string;
};

const LINKS = PRIMARY_NAV;

function accountHref(user: Props["user"]) {
  if (!user) return "/entrar";
  return "/conta";
}

function accountLabel(user: Props["user"]) {
  if (!user) return "Entrar";
  if (user.role === "ADMIN") return "Ver sua conta";
  return "Minha conta";
}

export function MobileNav({ open, onClose, categories, user, whatsappUrl }: Props) {
  const [produtosOpen, setProdutosOpen] = useState(false);
  const typeCategories = categories.filter(
    (cat) => SUCCULENT_TYPE_SLUGS.has(cat.slug) && cat.slug !== "suculentas" && !isMainCarouselSlug(cat.slug)
  );

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) setProdutosOpen(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`site-overlay${open ? " is-visible" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`nav-mobile${open ? " is-open" : ""}`} aria-hidden={!open} aria-label="Menu">
        <div className="nav-mobile-head">
          <strong>Menu</strong>
          <button type="button" className="nav-mobile-close" onClick={onClose} aria-label="Fechar menu">
            ×
          </button>
        </div>
        <nav className="nav-mobile-body">
          <Link href="/" onClick={onClose}>
            Início
          </Link>

          <Link
            href="/produtos"
            className="nav-mobile-link-produtos"
            onClick={onClose}
          >
            Produtos
          </Link>
          <button
            type="button"
            className={`nav-mobile-accordion${produtosOpen ? " is-open" : ""}`}
            aria-expanded={produtosOpen}
            onClick={() => setProdutosOpen((v) => !v)}
          >
            Catálogo
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path fill="currentColor" d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          {produtosOpen && (
            <div className="nav-mobile-sub">
              <Link href="/produtos" onClick={onClose}>
                Catálogo completo
              </Link>
              <Link href="/lancamentos" onClick={onClose}>
                Lançamentos
              </Link>
              <Link href="/destaques" onClick={onClose}>
                Destaques
              </Link>
              {MAIN_CAROUSEL_SLUGS.map((slug) => (
                <Link key={slug} href={categoryHref(slug)} onClick={onClose}>
                  {MAIN_CAROUSEL_LABELS[slug]}
                </Link>
              ))}
              {typeCategories.map((cat) => (
                <Link key={cat.slug} href={categoryHref(cat.slug)} onClick={onClose}>
                  {cat.name}
                  {cat.comingSoon ? <span className="nav-soon">{FUTURE_TYPE_LABEL}</span> : null}
                </Link>
              ))}
              <Link href="/promocoes" onClick={onClose}>
                Promoções
              </Link>
            </div>
          )}

          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-mobile-foot">
          {user ? (
            <>
              <Link href={accountHref(user)} onClick={onClose}>
                {accountLabel(user)}
              </Link>
              <Link href={user.role === "ADMIN" ? "/admin" : "/conta/pedidos"} onClick={onClose}>
                {user.role === "ADMIN" ? "Painel da loja" : "Meus pedidos"}
              </Link>
              {user.role === "ADMIN" ? (
                <form action={logoutAdmin}>
                  <button type="submit" className="nav-mobile-logout">
                    Sair
                  </button>
                </form>
              ) : (
                <form action={logoutUser}>
                  <button type="submit" className="nav-mobile-logout">
                    Sair
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <Link href="/entrar" onClick={onClose}>
                Entrar
              </Link>
              <Link href="/cadastro" onClick={onClose}>
                Criar conta
              </Link>
            </>
          )}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={onClose}>
            WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
