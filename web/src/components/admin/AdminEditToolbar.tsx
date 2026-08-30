"use client";

import Link from "next/link";
import { logoutAdmin } from "@/lib/actions/auth";
import { useAdminEdit } from "@/components/admin/AdminEditContext";

export function AdminEditToolbar() {
  const { isAdmin, editMode, toggleEditMode, setEditMode } = useAdminEdit();

  if (!isAdmin) return null;

  return (
    <div className={`admin-edit-toolbar${editMode ? " is-active" : ""}`}>
      <div className="admin-edit-toolbar-inner">
        <div className="admin-edit-toolbar-copy">
          <strong>{editMode ? "Modo edição ligado" : "Você é administrador"}</strong>
          <span>
            {editMode
              ? "X fecha o anúncio. O + no espaço vazio sobe um novo."
              : "Ative para editar os anúncios direto na vitrine."}
          </span>
        </div>
        <div className="admin-edit-toolbar-actions">
          <button type="button" className="btn-edit-toggle" onClick={toggleEditMode}>
            {editMode ? "Sair da edição" : "Editar site"}
          </button>
          <Link href="/admin/produtos/novo" className="btn-edit-secondary" onClick={() => setEditMode(false)}>
            + Novo anúncio
          </Link>
          <Link href="/admin" className="btn-edit-secondary" onClick={() => setEditMode(false)}>
            Painel
          </Link>
          <form action={logoutAdmin}>
            <button type="submit" className="btn-edit-logout">
              Sair da conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
