"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type AuthFormState } from "@/lib/actions/auth";

const initial: AuthFormState = {};

export function AdminLoginForm({ callbackUrl = "/admin" }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState(loginUser, initial);

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <p className="admin-auth-kicker">Paulo Suculentas</p>
        <h1>Entrar como lojista</h1>
        <p className="admin-auth-lead">
          Use o e-mail e a senha da conta administrativa. Ao entrar, você vai para o painel de
          gerenciamento — separado da loja pública.
        </p>

        <form action={action} className="admin-auth-form">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div className="form-field">
            <label htmlFor="admin-email">E-mail</label>
            <input id="admin-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="form-field">
            <label htmlFor="admin-password">Senha</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {state.error && <p className="form-error">{state.error}</p>}
          <button type="submit" className="btn-buy admin-auth-submit" disabled={pending}>
            {pending ? "Entrando…" : "Entrar no painel"}
          </button>
        </form>

        <p className="admin-auth-foot">
          É cliente? <Link href="/entrar">Entrar na loja</Link>
        </p>
      </div>
    </div>
  );
}
