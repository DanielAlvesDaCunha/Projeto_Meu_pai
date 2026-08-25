import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/admin";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: true },
  });
  if (!order) notFound();

  return (
    <section className="section admin-page">
      <nav className="breadcrumb-nav">
        <Link href="/admin/pedidos">Pedidos</Link>
        <span>/</span>
        <span>{order.id.slice(0, 8)}</span>
      </nav>
      <div className="checkout-grid">
        <div className="checkout-panel">
          <h2 style={{ fontSize: "1.3rem" }}>Pedido</h2>
          <p>
            <strong>Cliente:</strong> {order.customerName || order.user.name}
          </p>
          <p>
            <strong>E-mail:</strong> {order.user.email}
          </p>
          <p>
            <strong>Telefone:</strong> {order.customerPhone || order.user.phone || "—"}
          </p>
          <p>
            <strong>Cidade:</strong> {order.customerCity || order.user.city || "—"}
          </p>
          <p>
            <strong>Obs:</strong> {order.note || "—"}
          </p>
          <p>
            <strong>Pagamento:</strong> {order.paymentMethod} · {order.paymentStatus}
          </p>
          {order.items.map((item) => (
            <div className="checkout-line" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <div className="muted">
                  {item.qty} × {money(Number(item.unitPrice))}
                </div>
              </div>
              <strong>{money(Number(item.lineTotal))}</strong>
            </div>
          ))}
          <div className="checkout-totals">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Total</span>
              <strong>{money(Number(order.total))}</strong>
            </div>
          </div>
        </div>
        <div className="checkout-panel">
          <h2>Atualizar status</h2>
          <form action={updateOrderStatus} className="admin-form">
            <input type="hidden" name="id" value={order.id} />
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={order.status}>
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="SHIPPED">Enviado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            <button type="submit" className="btn-buy">
              Salvar status
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
