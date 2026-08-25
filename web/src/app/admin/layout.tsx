import { AdminNav } from "@/components/AdminNav";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminSession();

  return (
    <div className="admin-shell">
      <div className="admin-shell-head">
        <div className="container">
          <p className="admin-shell-kicker">Área do lojista</p>
          <h1 className="admin-shell-title">Painel administrativo</h1>
          <p className="admin-shell-user">
            Logado como <strong>{user.name || user.email}</strong>
          </p>
        </div>
      </div>
      <div className="container admin-shell-body">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
