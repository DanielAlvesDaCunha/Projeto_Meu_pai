"use client";

import { useActionState } from "react";
import { updateProfile, type AuthFormState } from "@/lib/actions/auth";

const initial: AuthFormState = {};

export function ProfileForm({
  user,
}: {
  user: { name: string; phone: string; city: string; address: string; email: string };
}) {
  const [state, action, pending] = useActionState(updateProfile, initial);

  return (
    <form action={action} className="auth-card" style={{ maxWidth: 520 }}>
      <h2>Meus dados</h2>
      <div className="form-field">
        <label>E-mail</label>
        <input value={user.email} disabled />
      </div>
      <div className="form-field">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" defaultValue={user.name} required />
      </div>
      <div className="form-field">
        <label htmlFor="phone">Telefone / WhatsApp</label>
        <input id="phone" name="phone" defaultValue={user.phone} />
      </div>
      <div className="form-field">
        <label htmlFor="city">Cidade</label>
        <input id="city" name="city" defaultValue={user.city} />
      </div>
      <div className="form-field">
        <label htmlFor="address">Endereço</label>
        <textarea id="address" name="address" rows={2} defaultValue={user.address} />
      </div>
      {state.error && <p className="form-error">{state.error}</p>}
      {state.ok && <p className="form-ok">Dados atualizados.</p>}
      <button type="submit" className="btn-buy" disabled={pending}>
        {pending ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
