import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAdminSession();

  const [productCount, lowStock, pendingOrders, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
      where: { available: true, stock: { lte: 3 } },
      orderBy: { stock: "asc" },
      take: 8,
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: true },
    }),
  ]);

  return (
    <section className="container section admin-page">
      <AdminNav />
      <div className="section-title">
        <h1>Painel admin</h1>
      </div>
      <div className="admin-stats">
        <div className="admin-stat">
          <strong>{productCount}</strong>
          <span>Produtos</span>
        </div>
        <div className="admin-stat">
          <strong>{lowStock.length}</strong>
          <span>Estoque baixo</span>
        </div>
        <div className="admin-stat">
          <strong>{pendingOrders}</strong>
          <span>Pedidos pendentes</span>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="checkout-panel">
          <h2>Estoque baixo</h2>
          {!lowStock.length ? (
            <p className="muted">Nenhum alerta no momento.</p>
          ) : (
            <ul className="admin-list">
              {lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/produtos/${p.id}`}>
                    {p.name} — {p.stock} un.
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link className="btn-buy" href="/admin/produtos/novo" style={{ marginTop: 12 }}>
            Novo produto
          </Link>
        </div>
        <div className="checkout-panel">
          <h2>Pedidos recentes</h2>
          {!recentOrders.length ? (
            <p className="muted">Ainda não há pedidos.</p>
          ) : (
            <ul className="admin-list">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/pedidos/${o.id}`}>
                    {o.customerName || o.user.name} · {money(Number(o.total))} · {o.status}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link className="section-more" href="/admin/pedidos">
            Ver todos
          </Link>
        </div>
      </div>
    </section>
  );
}
