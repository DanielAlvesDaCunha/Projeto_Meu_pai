import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [productCount, activeCount, lowStock, pendingOrders, recentOrders, revenuePending] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { available: true } }),
      prisma.product.findMany({
        where: { available: true, stock: { lte: 3 } },
        orderBy: { stock: "asc" },
        take: 6,
        include: { category: true },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: true },
      }),
      prisma.order.aggregate({
        where: { status: "PENDING" },
        _sum: { total: true },
      }),
    ]);

  const pendingTotal = Number(revenuePending._sum.total || 0);

  return (
    <div className="admin-dashboard-home">
      <div className="admin-welcome">
        <h2>Resumo da loja</h2>
        <p className="muted">
          Gerencie anúncios, fotos, estoque e pedidos. Tudo aqui é separado da vitrine que os
          clientes veem.
        </p>
      </div>

      <div className="admin-stats admin-stats-4">
        <div className="admin-stat">
          <strong>{productCount}</strong>
          <span>Total de anúncios</span>
        </div>
        <div className="admin-stat">
          <strong>{activeCount}</strong>
          <span>Ativos na loja</span>
        </div>
        <div className="admin-stat admin-stat-warn">
          <strong>{lowStock.length}</strong>
          <span>Estoque baixo</span>
        </div>
        <div className="admin-stat admin-stat-accent">
          <strong>{pendingOrders}</strong>
          <span>Pedidos pendentes</span>
        </div>
      </div>

      <div className="admin-actions-row">
        <Link className="admin-action-btn" href="/admin/produtos/novo">
          + Cadastrar anúncio
        </Link>
        <Link className="admin-action-btn admin-action-btn-secondary" href="/admin/produtos">
          Ver todos os anúncios
        </Link>
        <Link className="admin-action-btn admin-action-btn-secondary" href="/admin/pedidos">
          Ver pedidos
        </Link>
      </div>

      <div className="admin-grid-2">
        <section className="admin-panel-card">
          <div className="admin-panel-head">
            <h3>Estoque baixo</h3>
            <Link href="/admin/produtos">Ver todos</Link>
          </div>
          {!lowStock.length ? (
            <p className="muted">Nenhum alerta no momento.</p>
          ) : (
            <ul className="admin-list admin-list-rich">
              {lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/produtos/${p.id}`}>
                    <span>{p.name}</span>
                    <em>
                      {p.stock} un. · {p.category.name}
                    </em>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-panel-card">
          <div className="admin-panel-head">
            <h3>Pedidos recentes</h3>
            <Link href="/admin/pedidos">Ver todos</Link>
          </div>
          {pendingOrders > 0 && (
            <p className="admin-pending-note">
              {pendingOrders} pendente(s) · {money(pendingTotal)} aguardando
            </p>
          )}
          {!recentOrders.length ? (
            <p className="muted">Ainda não há pedidos.</p>
          ) : (
            <ul className="admin-list admin-list-rich">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/pedidos/${o.id}`}>
                    <span>{o.customerName || o.user.name}</span>
                    <em>
                      {money(Number(o.total))} · {o.status}
                    </em>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
