import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Minimal payOS client (no SDK): create payment link + verify webhook signature.
 * Docs: https://payos.vn/docs/
 */

const API = "https://api-merchant.payos.vn";

function cfg() {
  const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY } = process.env;
  if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
    throw new Error("payOS is not configured (PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY).");
  }
  return { clientId: PAYOS_CLIENT_ID, apiKey: PAYOS_API_KEY, checksumKey: PAYOS_CHECKSUM_KEY };
}

const hmac = (data: string, key: string) => createHmac("sha256", key).update(data).digest("hex");

/** key=value pairs sorted by key, joined with & (payOS signing format). */
const canonical = (o: Record<string, unknown>) =>
  Object.keys(o)
    .sort()
    .map((k) => {
      const v = o[k];
      return `${k}=${v === null || v === undefined || v === "null" || v === "undefined" ? "" : v}`;
    })
    .join("&");

export interface PayosLink {
  checkoutUrl: string;
  paymentLinkId: string;
}

export async function createPaymentLink(input: {
  orderCode: number;
  amount: number;
  description: string; // payOS limits this to 25 chars
  items: { name: string; quantity: number; price: number }[];
  returnUrl: string;
  cancelUrl: string;
}): Promise<PayosLink> {
  const { clientId, apiKey, checksumKey } = cfg();
  const description = input.description.slice(0, 25);
  const signature = hmac(
    canonical({
      amount: input.amount,
      cancelUrl: input.cancelUrl,
      description,
      orderCode: input.orderCode,
      returnUrl: input.returnUrl,
    }),
    checksumKey,
  );

  const res = await fetch(`${API}/v2/payment-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-client-id": clientId, "x-api-key": apiKey },
    body: JSON.stringify({ ...input, description, signature }),
  });
  const json = (await res.json().catch(() => null)) as {
    code?: string;
    desc?: string;
    data?: { checkoutUrl: string; paymentLinkId: string };
  } | null;

  if (!res.ok || json?.code !== "00" || !json.data) {
    throw new Error(`payOS create link failed: ${json?.code ?? res.status} ${json?.desc ?? ""}`);
  }
  return { checkoutUrl: json.data.checkoutUrl, paymentLinkId: json.data.paymentLinkId };
}

export interface PayosWebhookBody {
  code: string;
  desc: string;
  success: boolean;
  data: Record<string, unknown> & { orderCode: number; amount: number; code: string };
  signature: string;
}

/** True only if the signature matches the HMAC of `data` under our checksum key. */
export function verifyWebhook(body: PayosWebhookBody): boolean {
  if (!body?.data || typeof body.signature !== "string") return false;
  const expected = Buffer.from(hmac(canonical(body.data), cfg().checksumKey), "hex");
  const given = Buffer.from(body.signature, "hex");
  return expected.length === given.length && timingSafeEqual(expected, given);
}
