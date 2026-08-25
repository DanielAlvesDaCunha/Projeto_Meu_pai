import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyPaidOrderStock } from "@/lib/actions/orders";
import { verifyWebhookToken } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const token =
    req.headers.get("x-pagarme-token") ||
    req.headers.get("x-webhook-token") ||
    new URL(req.url).searchParams.get("token");

  if (!verifyWebhookToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: true });

  const eventType = String(body.type || "");
  const data = body.data || {};
  const gatewayId = String(data.id || "");
  const orderCode = String(data.code || "");

  if (!gatewayId && !orderCode) {
    return NextResponse.json({ ok: true });
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        gatewayId ? { gatewayPaymentId: gatewayId } : undefined,
        orderCode ? { id: orderCode } : undefined,
      ].filter(Boolean) as { gatewayPaymentId?: string; id?: string }[],
    },
  });

  if (!order) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (eventType === "order.paid" || data.status === "paid") {
    await applyPaidOrderStock(order.id);
  }

  if (
    eventType === "order.canceled" ||
    eventType === "order.payment_failed" ||
    data.status === "canceled" ||
    data.status === "failed"
  ) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: eventType === "order.payment_failed" ? "FAILED" : "REFUNDED",
        status: "CANCELLED",
      },
    });
  }

  return NextResponse.json({ ok: true });
}
