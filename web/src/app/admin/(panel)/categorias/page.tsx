import { CategoryForm } from "@/components/CategoryForm";
import { deleteCategory } from "@/lib/actions/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <section className="section admin-page">
      <div className="category-head">
        <h2>Tipos / categorias</h2>
      </div>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Marque “Em breve no estoque” nos tipos que ainda vão entrar na loja.
      </p>
      <div className="checkout-panel" style={{ marginBottom: "1.5rem" }}>
        <h3>Novo tipo</h3>
        <CategoryForm />
      </div>
      <div className="admin-category-list">
        {categories.map((c) => (
          <div key={c.id} className="checkout-panel" style={{ marginBottom: "1rem" }}>
            <div className="admin-cat-meta">
              <span>
                {c._count.products} produto(s)
                {c.comingSoon ? " · Em breve no estoque" : " · Ativo"}
              </span>
              {c._count.products === 0 && (
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="link-danger">
                    Excluir
                  </button>
                </form>
              )}
            </div>
            <CategoryForm
              category={{
                id: c.id,
                name: c.name,
                slug: c.slug,
                order: c.order,
                comingSoon: c.comingSoon,
                description: c.description,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
