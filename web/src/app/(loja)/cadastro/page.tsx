import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

export default function CadastroPage() {
  return (
    <section className="container section auth-page">
      <RegisterForm />
    </section>
  );
}
