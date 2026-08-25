import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getSessionUser, resolveLoginRedirect } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function AdminEntrarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const callbackUrl =
    sp.callbackUrl?.startsWith("/admin") && !sp.callbackUrl.startsWith("/admin/entrar")
      ? sp.callbackUrl
      : "/admin";
  const user = await getSessionUser();

  if (user) {
    redirect(resolveLoginRedirect(user.role, callbackUrl));
  }

  return <AdminLoginForm callbackUrl={callbackUrl} />;
}
