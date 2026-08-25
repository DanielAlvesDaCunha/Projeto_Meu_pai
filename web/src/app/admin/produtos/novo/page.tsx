import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <section className="section admin-page">
      <div className="category-head">
        <h2>Novo anúncio</h2>
      </div>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Preencha nome, preço, estoque e envie a foto da planta.
      </p>
      <ProductForm categories={categories} />
    </section>
  );
}
