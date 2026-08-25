"use client";

import Link from "next/link";
import { useEffect } from "react";
import { logoutUser } from "@/lib/actions/auth";

type NavCategory = { slug: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  categories: NavCategory[];
  user: { name?: string | null; role?: string } | null;
  whatsappUrl: string;
};

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/novidades", label: "Novidades" },
  { href: "/como-pedir", label: "Como pedir" },
  { href: "/contato", label: "Contato" },
] as const;

export function MobileNav({ open, onClose, categories, user, whatsappUrl }: Props) {
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
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
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`} onClick={onClose}>
              {cat.name}
            </Link>
          ))}
          {LINKS.slice(1).map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-mobile-foot">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin" onClick={onClose}>
                  Admin
                </Link>
              )}
              <Link href="/conta" onClick={onClose}>
                Minha conta
              </Link>
              <form action={logoutUser}>
                <button type="submit" className="nav-mobile-logout">
                  Sair
                </button>
              </form>
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
