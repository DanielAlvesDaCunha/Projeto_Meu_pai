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
        <h2>Categorias</h2>
      </div>
      <div className="checkout-panel" style={{ marginBottom: "1.5rem" }}>
        <h3>Nova categoria</h3>
        <CategoryForm />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Ordem</th>
              <th>Produtos</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td colSpan={5}>
                  <CategoryForm
                    category={{ id: c.id, name: c.name, slug: c.slug, order: c.order }}
                  />
                  <div className="muted" style={{ fontSize: "0.8rem", marginTop: 4 }}>
                    {c._count.products} produto(s)
                    {c._count.products === 0 && (
                      <form action={deleteCategory} style={{ display: "inline", marginLeft: 12 }}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="link-danger">
                          Excluir
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
