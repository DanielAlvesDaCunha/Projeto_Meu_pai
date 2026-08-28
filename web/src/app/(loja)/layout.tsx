import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { AdminEditShell } from "@/components/admin/AdminEditShell";
import { getSessionUser } from "@/lib/session";

export default async function LojaLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <AdminEditShell isAdmin={isAdmin}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </AdminEditShell>
  );
}
