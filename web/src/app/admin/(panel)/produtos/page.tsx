import Link from "next/link";
import { StockQuickEdit } from "@/components/StockQuickEdit";
import { deleteProduct, toggleProductAvailable } from "@/lib/actions/admin";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdminSession();
  const products = await prisma.product.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { category: true },
  });

  return (
    <section className="section admin-page">
      <div className="category-head">
        <h2>Produtos</h2>
        <Link className="btn-buy" href="/admin/produtos/novo" style={{ maxWidth: 180 }}>
          + Novo anúncio
        </Link>
      </div>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Edite fotos, preços e estoque. Clique no nome para editar o anúncio completo.
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" className="admin-thumb-sm" />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <Link href={`/admin/produtos/${p.id}`}>{p.name}</Link>
                  <div className="muted" style={{ fontSize: "0.75rem" }}>
                    {p.sku}
                  </div>
                </td>
                <td>{p.category.name}</td>
                <td>{money(Number(p.price))}</td>
                <td className={p.stock <= p.lowStockThreshold ? "stock-low" : undefined}>
                  <StockQuickEdit productId={p.id} stock={p.stock} />
                </td>
                <td>
                  {p.available ? "Ativo" : "Inativo"}
                  <form action={toggleProductAvailable} style={{ marginTop: 4 }}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="link-muted">
                      {p.available ? "Desativar" : "Ativar"}
                    </button>
                  </form>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/produtos/${p.id}`}>Editar</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="link-danger">
                        Excluir
                      </button>
                    </form>
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
