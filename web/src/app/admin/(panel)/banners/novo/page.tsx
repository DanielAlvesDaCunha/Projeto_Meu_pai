import Link from "next/link";
import { BannerForm } from "@/components/BannerForm";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminBannerNewPage() {
  await requireAdminSession();

  return (
    <section className="section admin-page">
      <div className="category-head">
        <h2>Novo banner</h2>
        <Link className="link-muted" href="/admin/banners">
          ← Voltar
        </Link>
      </div>
      <div className="checkout-panel">
        <BannerForm />
      </div>
    </section>
  );
}
