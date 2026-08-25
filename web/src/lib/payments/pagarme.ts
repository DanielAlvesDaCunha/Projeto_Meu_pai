import { getStoreConfig } from "@/lib/store";
import type { CreatePixInput, CreatePixResult } from "@/lib/payments/types";

const API_BASE = "https://api.pagar.me/core/v5";

function secretKey() {
  return process.env.PAGARME_SECRET_KEY || process.env.PAGARME_API_KEY || "";
}

export function paymentsEnabled() {
  const provider = getStoreConfig().paymentProvider;
  return (provider === "pagarme" || provider === "pagar.me") && Boolean(secretKey());
}

async function pagarmeFetch(path: string, init?: RequestInit) {
  const key = secretKey();
  if (!key) throw new Error("PAGARME_SECRET_KEY não configurada");

  const auth = Buffer.from(`${key}:`).toString("base64");
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
      ...(init?.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.message ||
      data?.errors?.[0]?.message ||
      data?.errors?.[0]?.description ||
      "Erro Pagar.me";
    throw new Error(msg);
  }
  return data;
}

function parsePhone(phone?: string) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length >= 10) {
    return {
      area_code: digits.slice(0, 2),
      number: digits.slice(2),
    };
  }
  return { area_code: "21", number: digits || "970151689" };
}

export async function createPagarmePixPayment(input: CreatePixInput): Promise<CreatePixResult> {
  const phone = parsePhone(input.customerPhone);
  const document = (input.customerDocument || "").replace(/\D/g, "") || "00000000000";

  const items =
    input.items.length > 0
      ? input.items.map((item) => ({
          amount: Math.round(item.unitPrice * 100),
          description: item.name.slice(0, 256),
          quantity: item.qty,
          code: item.sku || String(item.productId),
        }))
      : [
          {
            amount: Math.round(input.value * 100),
            description: input.description.slice(0, 256),
            quantity: 1,
            code: input.orderId.slice(0, 52),
          },
        ];

  const order = await pagarmeFetch("/orders", {
    method: "POST",
    body: JSON.stringify({
      code: input.orderId.slice(0, 52),
      customer: {
        name: input.customerName,
        email: input.customerEmail,
        type: "individual",
        document,
        phones: {
          mobile_phone: {
            country_code: "55",
            area_code: phone.area_code,
            number: phone.number,
          },
        },
      },
      items,
      payments: [
        {
          payment_method: "pix",
          pix: { expires_in: 86400 },
        },
      ],
      closed: true,
    }),
  });

  const charge = order.charges?.[0];
  const tx = charge?.last_transaction || {};

  return {
    paymentId: String(order.id || charge?.id || ""),
    checkoutUrl: tx.qr_code_url || undefined,
    pixQrCode: tx.qr_code_url || undefined,
    pixCopyPaste: tx.qr_code || undefined,
  };
}

export function verifyPagarmeWebhookToken(token: string | null) {
  const expected = process.env.PAGARME_WEBHOOK_SECRET || "";
  if (!expected) return true;
  return token === expected;
}
