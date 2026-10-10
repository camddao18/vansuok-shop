import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { verifyWebhook, type PayosWebhookBody } from "@/lib/payos";

export const runtime = "nodejs";

/**
 * payOS calls this when a transfer lands. This is the ONLY place an order becomes
 * "paid": the redirect back to /order/... is never trusted.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as PayosWebhookBody | null;
  if (!body || !verifyWebhook(body)) {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  const { orderCode, amount, code } = body.data;
  if (body.success && code === "00") {
    const order = await getOrder(Number(orderCode));
    // Unknown order: payOS sends a sample payload when you register the URL. Acknowledge it.
    if (order && order.paymentMethod === "payos" && order.status === "pending") {
      if (Number(amount) !== order.total) {
        console.error(`payOS amount mismatch for ${order.code}: got ${amount}, expected ${order.total}`);
      } else {
        await updateOrder(order.code, { status: "paid" });
      }
    }
  }
  return NextResponse.json({ ok: true });
}
