"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { createPixPayment, paymentsEnabled } from "@/lib/payments";
import { pixPrice } from "@/lib/money";

export type CheckoutState = {
  error?: string;
  orderId?: string;
};

type CartLine = {
  id: string;
  name: string;
  price: number;
  image?: string;
  sku?: string;
  qty: number;
};

export async function createOrderFromCart(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const user = await requireSession("/pedido");
  const paymentMethod = String(formData.get("paymentMethod") || "WHATSAPP");
  const name = String(formData.get("name") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const document = String(formData.get("document") || "").trim();
  const note = String(formData.get("note") || "").trim();
  const cartRaw = String(formData.get("cartJson") || "[]");

  let lines: CartLine[] = [];
  try {
    lines = JSON.parse(cartRaw);
  } catch {
    return { error: "Carrinho inválido." };
  }

  if (!lines.length) return { error: "Seu pedido está vazio." };
  if (!name) return { error: "Informe seu nome." };

  const productIds = lines.map((l) => Number(l.id)).filter((n) => Number.isFinite(n));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, available: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const items: {
    productId: number;
    name: string;
    sku: string;
    image: string;
    unitPrice: Prisma.Decimal;
    qty: number;
    lineTotal: Prisma.Decimal;
  }[] = [];

  let subtotal = 0;
  for (const line of lines) {
    const pid = Number(line.id);
    const product = byId.get(pid);
    if (!product) {
      return { error: `Produto indisponível: ${line.name}` };
    }
    if (product.stock < line.qty) {
      return { error: `Estoque insuficiente para ${product.name} (disp.: ${product.stock}).` };
    }
    const unit = Number(product.price);
    const qty = Math.max(1, Math.min(99, Math.floor(line.qty)));
    const lineTotal = unit * qty;
    subtotal += lineTotal;
    items.push({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      image: product.image,
      unitPrice: new Prisma.Decimal(unit),
      qty,
      lineTotal: new Prisma.Decimal(lineTotal),
    });
  }

  const usePix = paymentMethod === "PIX" && paymentsEnabled();
  const total = usePix ? pixPrice(subtotal) : subtotal;

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: usePix ? "PIX" : "WHATSAPP",
      subtotal: new Prisma.Decimal(subtotal),
      total: new Prisma.Decimal(total),
      customerName: name,
      customerPhone: phone,
      customerCity: city,
      note,
      whatsappSent: !usePix,
      items: { create: items },
    },
  });

  // Update profile contact lightly
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name || undefined,
      phone: phone || undefined,
      city: city || undefined,
    },
  });

  if (usePix) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      const pix = await createPixPayment({
        orderId: order.id,
        customerName: name,
        customerEmail: dbUser?.email || `${user.id}@cliente.local`,
        customerPhone: phone,
        customerDocument: document,
        value: total,
        description: `Pedido ${order.id.slice(0, 8)} — Paulo Suculentas`,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          sku: item.sku,
          unitPrice: Number(item.unitPrice),
          qty: item.qty,
        })),
      });
      await prisma.order.update({
        where: { id: order.id },
        data: {
          gatewayPaymentId: pix.paymentId,
          gatewayCheckoutUrl: pix.checkoutUrl,
          pixQrCode: pix.pixQrCode,
          pixCopyPaste: pix.pixCopyPaste,
        },
      });
    } catch (error) {
      console.error("Pagar.me error:", error);
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: "WHATSAPP",
          note: `${note}\n[Pix falhou: ${error instanceof Error ? error.message : "erro"}]`.trim(),
        },
      });
    }
  }

  redirect(`/conta/pedidos/${order.id}`);
}

/** Decrements stock once when payment is confirmed. */
export async function applyPaidOrderStock(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.stockReserved) return;

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (!item.productId) continue;
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.qty },
        },
      });
      const updated = await tx.product.findUnique({ where: { id: item.productId } });
      if (updated && updated.stock <= 0) {
        await tx.product.update({
          where: { id: item.productId },
          data: { available: false, stock: 0 },
        });
      }
    }
    await tx.order.update({
      where: { id: orderId },
      data: {
        stockReserved: true,
        status: "PAID",
        paymentStatus: "PAID",
      },
    });
  });
}
