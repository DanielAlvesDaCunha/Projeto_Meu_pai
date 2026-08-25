import type { Metadata } from "next";
import { AdminNav } from "@/components/AdminNav";
import { AdminTopBar } from "@/components/AdminTopBar";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Gerenciar loja",
    template: "%s | Gerenciar loja",
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminSession();

  return (
    <div className="admin-app">
      <AdminTopBar userName={user.name || user.email || "Administrador"} />
      <div className="admin-shell">
        <div className="container admin-shell-body">
          <AdminNav />
          {children}
        </div>
      </div>
    </div>
  );
}
