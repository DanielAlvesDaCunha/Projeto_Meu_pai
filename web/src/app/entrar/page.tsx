import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function EntrarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const callbackUrl = sp.callbackUrl?.startsWith("/") ? sp.callbackUrl : "/conta";

  return (
    <section className="container section auth-page">
      <LoginForm callbackUrl={callbackUrl} />
    </section>
  );
}
