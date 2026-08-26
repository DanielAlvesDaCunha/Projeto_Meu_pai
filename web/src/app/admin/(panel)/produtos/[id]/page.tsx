import { notFound } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <section className="section admin-page">
      <div className="category-head">
        <h2>Editar anúncio</h2>
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
          gallery: product.gallery,
          featured: product.featured,
          available: product.available,
        }}
      />
    </section>
  );
}
