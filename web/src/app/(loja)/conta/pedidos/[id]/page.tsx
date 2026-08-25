import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { money } from "@/lib/money";
import { getStoreConfig, whatsappGeneralUrl } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ContaPedidoDetailPage({ params }: Props) {
  const user = await requireSession();
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true },
  });
  if (!order) notFound();

  const store = getStoreConfig();
  const wa = whatsappGeneralUrl(store);
  const lines = order.items
    .map((i) => `• ${i.qty}x ${i.name} — ${money(Number(i.lineTotal))}`)
    .join("%0A");
  const waOrder = `${wa}&text=${encodeURIComponent(
    `Olá! Pedido ${order.id.slice(0, 8)}%0A${decodeURIComponent(lines)}%0ATotal: ${money(Number(order.total))}%0ANome: ${order.customerName}`
  )}`;

  return (
    <section className="container section">
      <nav className="breadcrumb-nav">
        <Link href="/conta">Conta</Link>
        <span>/</span>
        <Link href="/conta/pedidos">Pedidos</Link>
        <span>/</span>
        <span>{order.id.slice(0, 8)}</span>
      </nav>

      <div className="checkout-grid">
        <div className="checkout-panel">
          <h1 style={{ fontSize: "1.3rem" }}>Pedido {order.id.slice(0, 8)}</h1>
          <p className="muted">
            {order.createdAt.toLocaleString("pt-BR")} · {order.status} · {order.paymentStatus}
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
          <h2>Pagamento</h2>
          <p>
            Método: <strong>{order.paymentMethod}</strong>
          </p>
          {order.paymentStatus === "PENDING" && order.paymentMethod === "PIX" && (
            <>
              {order.pixQrCode && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={order.pixQrCode} alt="QR Code Pix" className="pix-qr" />
              )}
              {order.pixCopyPaste && (
                <div className="form-field">
                  <label>Pix copia e cola</label>
                  <textarea readOnly rows={4} value={order.pixCopyPaste} />
                </div>
              )}
              {order.gatewayCheckoutUrl && (
                <a
                  className="btn-buy"
                  href={order.gatewayCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir pagamento Pix
                </a>
              )}
              <p className="muted" style={{ marginTop: 12 }}>
                Após pagar, o status atualiza automaticamente (webhook).
              </p>
            </>
          )}
          {order.paymentStatus === "PAID" && (
            <p className="form-ok">Pagamento confirmado. Obrigado!</p>
          )}
          {(order.paymentMethod === "WHATSAPP" || order.paymentStatus === "PENDING") && (
            <a className="btn-buy" href={waOrder} target="_blank" rel="noopener noreferrer" style={{ marginTop: 12 }}>
              Falar no WhatsApp sobre este pedido
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
