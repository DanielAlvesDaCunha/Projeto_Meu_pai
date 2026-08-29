"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAdmin, logoutUser } from "@/lib/actions/auth";

type Props = {
  user: { name?: string | null; role?: string } | null;
};

export function AccountMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === "ADMIN";
  const isLoggedIn = !!user;
  const firstName = (user?.name || "").trim().split(/\s+/)[0] || "Conta";

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!isLoggedIn) {
    return (
      <Link className="util-item" href="/entrar">
        <IconAccount />
        <span>Entrar</span>
      </Link>
    );
  }

  return (
    <div className={`account-menu${open ? " is-open" : ""}`} ref={ref}>
      <button
        type="button"
        className="util-item account-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <IconAccount />
        <span>{isAdmin ? "Ver sua conta" : "Minha conta"}</span>
      </button>
      {open ? (
        <div className="account-menu-pop" role="menu">
          <div className="account-menu-head">
            <strong>Olá, {firstName}</strong>
            <span>{isAdmin ? "Conta do lojista" : "Sua conta"}</span>
          </div>
          <div className="account-menu-body">
            <Link href="/conta" role="menuitem" onClick={() => setOpen(false)}>
              Editar dados
            </Link>
            {isAdmin ? (
              <Link href="/admin" role="menuitem" onClick={() => setOpen(false)}>
                Painel da loja
              </Link>
            ) : (
              <Link href="/conta/pedidos" role="menuitem" onClick={() => setOpen(false)}>
                Meus pedidos
              </Link>
            )}
          </div>
          <div className="account-menu-foot">
            <form action={isAdmin ? logoutAdmin : logoutUser}>
              <button type="submit" role="menuitem" className="account-menu-logout">
                Sair
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
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
