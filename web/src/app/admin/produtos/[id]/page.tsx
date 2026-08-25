import { notFound } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <section className="container section admin-page">
      <AdminNav />
      <div className="section-title">
        <h1>Editar produto</h1>
      </div>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          description: product.description,
          categoryId: product.categoryId,
          price: String(Number(product.price)),
          oldPrice: product.oldPrice != null ? String(Number(product.oldPrice)) : "",
          stock: product.stock,
          image: product.image,
          featured: product.featured,
          available: product.available,
        }}
      />
    </section>
  );
}
