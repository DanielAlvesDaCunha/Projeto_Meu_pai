import { AdminNav } from "@/components/AdminNav";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  await requireAdminSession();
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <section className="container section admin-page">
      <AdminNav />
      <div className="section-title">
        <h1>Novo produto</h1>
      </div>
      <ProductForm categories={categories} />
    </section>
  );
}
