import { LoginForm } from "@/components/LoginForm";
import { getSessionUser, resolveLoginRedirect } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function EntrarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const callbackUrl = sp.callbackUrl?.startsWith("/") ? sp.callbackUrl : "";
  const user = await getSessionUser();

  if (user) {
    redirect(resolveLoginRedirect(user.role, callbackUrl));
  }

  return (
    <section className="container section auth-page">
      <LoginForm callbackUrl={callbackUrl} />
    </section>
  );
}
