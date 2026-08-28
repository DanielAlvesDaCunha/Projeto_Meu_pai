import Link from "next/link";
import { notFound } from "next/navigation";
import { BannerForm } from "@/components/BannerForm";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminBannerEditPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id: Number(id) } });
  if (!slide) notFound();

  return (
    <section className="section admin-page">
      <div className="category-head">
        <h2>Editar banner</h2>
        <Link className="link-muted" href="/admin/banners">
          ← Voltar
        </Link>
      </div>
      <div className="checkout-panel">
        <BannerForm slide={slide} />
      </div>
    </section>
  );
}
