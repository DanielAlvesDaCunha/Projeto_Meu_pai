import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminSession();

  return (
    <AdminDashboardShell userName={user.name || "Administrador"} userEmail={user.email || ""}>
      {children}
    </AdminDashboardShell>
  );
}
