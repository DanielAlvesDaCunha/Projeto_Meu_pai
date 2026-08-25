import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function ContaPedidosPage() {
  const user = await requireSession("/conta/pedidos");
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="container section">
      <nav className="breadcrumb-nav">
        <Link href="/conta">Conta</Link>
        <span>/</span>
        <span>Pedidos</span>
      </nav>
      <div className="section-title">
        <h1>Meus pedidos</h1>
      </div>
      {!orders.length ? (
        <p className="muted text-center">Nenhum pedido ainda.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data</th>
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
                  <td>{money(Number(o.total))}</td>
                  <td>
                    {o.paymentMethod} / {o.paymentStatus}
                  </td>
                  <td>{o.status}</td>
                  <td>
                    <Link href={`/conta/pedidos/${o.id}`}>Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
