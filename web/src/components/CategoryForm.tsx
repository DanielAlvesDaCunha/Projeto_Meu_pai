"use client";

import { useActionState } from "react";
import { saveCategory, type AdminFormState } from "@/lib/actions/admin";

const initial: AdminFormState = {};

export function CategoryForm({
  category,
}: {
  category?: {
    id: number;
    name: string;
    slug: string;
    order: number;
    comingSoon?: boolean;
    description?: string;
  };
}) {
  const [state, action, pending] = useActionState(saveCategory, initial);

  return (
    <form action={action} className="admin-form admin-form-category">
      {category?.id != null && <input type="hidden" name="id" value={category.id} />}
      <div className="admin-form-inline">
        <div className="form-field">
          <label>Nome</label>
          <input name="name" defaultValue={category?.name || ""} required />
        </div>
        <div className="form-field">
          <label>Slug</label>
          <input name="slug" defaultValue={category?.slug || ""} placeholder="auto" />
        </div>
        <div className="form-field">
          <label>Ordem</label>
          <input name="order" type="number" defaultValue={category?.order ?? 0} />
        </div>
        <button type="submit" className="btn-buy" disabled={pending}>
          {pending ? "…" : category ? "Atualizar" : "Criar"}
        </button>
      </div>
      <div className="form-field">
        <label htmlFor={`desc-${category?.id || "new"}`}>Descrição</label>
        <input
          id={`desc-${category?.id || "new"}`}
          name="description"
          defaultValue={category?.description || ""}
          placeholder="Texto curto na página do tipo"
        />
      </div>
      <label className="check-row">
        <input name="comingSoon" type="checkbox" defaultChecked={category?.comingSoon} />
        Em breve no estoque (ainda não vende neste tipo)
      </label>
      {state.error && <p className="form-error">{state.error}</p>}
      {state.ok && <p className="form-ok">Salvo!</p>}
    </form>
  );
}
