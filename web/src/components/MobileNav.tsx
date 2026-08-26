"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutAdmin, logoutUser } from "@/lib/actions/auth";

type NavCategory = { slug: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  categories: NavCategory[];
  user: { name?: string | null; role?: string } | null;
  whatsappUrl: string;
};

const LINKS = [
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

export function MobileNav({ open, onClose, categories, user, whatsappUrl }: Props) {
  const [produtosOpen, setProdutosOpen] = useState(false);

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

          <button
            type="button"
            className={`nav-mobile-accordion${produtosOpen ? " is-open" : ""}`}
            aria-expanded={produtosOpen}
            onClick={() => setProdutosOpen((v) => !v)}
          >
            Produtos
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path fill="currentColor" d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          {produtosOpen && (
            <div className="nav-mobile-sub">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/${cat.slug}`} onClick={onClose}>
                  {cat.name}
                </Link>
              ))}
              <Link href="/promocoes" onClick={onClose}>
                Promoções
              </Link>
              <Link href="/novidades" onClick={onClose}>
                Novidades
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
