"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerCustomer, type AuthFormState } from "@/lib/actions/auth";

const initial: AuthFormState = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerCustomer, initial);

  return (
    <form action={action} className="auth-card">
      <h1>Criar conta</h1>
      <p className="muted">Cadastre-se para acompanhar pedidos e finalizar compra.</p>
      <div className="form-field">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="form-field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="form-field">
        <label htmlFor="phone">WhatsApp / telefone</label>
        <input id="phone" name="phone" autoComplete="tel" />
      </div>
      <div className="form-field">
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>
      <div className="form-field">
        <label htmlFor="confirm">Confirmar senha</label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>
      {state.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn-buy" disabled={pending}>
        {pending ? "Criando…" : "Criar conta"}
      </button>
      <p className="auth-alt">
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </form>
  );
}
