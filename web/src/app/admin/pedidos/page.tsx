import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  return (
    <section className="section admin-page">
      <div className="category-head">
        <h2>Pedidos</h2>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.createdAt.toLocaleString("pt-BR")}</td>
                <td>{o.customerName || o.user.name}</td>
                <td>{money(Number(o.total))}</td>
                <td>
                  {o.paymentMethod} / {o.paymentStatus}
                </td>
                <td>{o.status}</td>
                <td>
                  <Link href={`/admin/pedidos/${o.id}`}>Detalhe</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length && <p className="muted">Nenhum pedido ainda.</p>}
      </div>
    </section>
  );
}
