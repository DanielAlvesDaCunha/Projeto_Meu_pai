import { createPagarmePixPayment, paymentsEnabled, verifyPagarmeWebhookToken } from "@/lib/payments/pagarme";
import type { CreatePixInput, CreatePixResult } from "@/lib/payments/types";

export type { CreatePixInput, CreatePixResult, PixLineItem } from "@/lib/payments/types";

export { paymentsEnabled };

export async function createPixPayment(input: CreatePixInput): Promise<CreatePixResult> {
  return createPagarmePixPayment(input);
}

export function verifyWebhookToken(token: string | null) {
  return verifyPagarmeWebhookToken(token);
}
