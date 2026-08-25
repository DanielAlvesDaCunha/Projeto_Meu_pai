"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type AuthFormState } from "@/lib/actions/auth";

const initial: AuthFormState = {};

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState(loginUser, initial);

  return (
    <form action={action} className="auth-card">
      <h1>Entrar</h1>
      <p className="muted">Admin vai para o painel; cliente vai para Minha conta.</p>
      {callbackUrl ? <input type="hidden" name="callbackUrl" value={callbackUrl} /> : null}
      <div className="form-field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="form-field">
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      {state.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn-buy" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
      <p className="auth-alt">
        Não tem conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </form>
  );
}
