import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
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
    <section className="section admin-page">
      <div className="admin-quick-links">
        <Link className="admin-quick-card" href="/admin/produtos/novo">
          <strong>+ Novo anúncio</strong>
          <span>Cadastrar planta com foto e preço</span>
        </Link>
        <Link className="admin-quick-card" href="/admin/produtos">
          <strong>Gerenciar anúncios</strong>
          <span>Editar fotos, estoque e preços</span>
        </Link>
        <Link className="admin-quick-card" href="/admin/pedidos">
          <strong>Pedidos</strong>
          <span>{pendingOrders} pendente(s)</span>
        </Link>
        <Link className="admin-quick-card" href="/admin/categorias">
          <strong>Categorias</strong>
          <span>Suculentas, cactos, kits…</span>
        </Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <strong>{productCount}</strong>
          <span>Anúncios</span>
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
