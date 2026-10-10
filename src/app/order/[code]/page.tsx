import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { formatVND } from "@/lib/money";
import { getOrder } from "@/lib/orders";
import { OrderWatcher } from "@/components/OrderWatcher";
import { OrderSummary } from "@/components/OrderSummary";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order — Vansuok Studio", robots: { index: false } };

const safeEq = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export default async function OrderPage({
  params, searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ t?: string; cancelled?: string }>;
}) {
  const { code } = await params;
  const { t, cancelled } = await searchParams;
  if (!/^\d{1,16}$/.test(code) || !t) notFound();

  const order = await getOrder(Number(code));
  if (!order || !safeEq(order.accessToken, t)) notFound();

  const unpaidTransfer = order.status === "pending";
  const headline =
    order.status === "paid" ? "Payment received." :
    order.status === "cancelled" ? "Order cancelled." :
    order.status === "shipped" ? "On its way." :
    order.status === "completed" ? "Delivered." :
    cancelled ? "Payment not completed." : "Waiting for your transfer…";
  const detail =
    order.status === "paid" ? "Thank you! We're getting your order ready." :
    order.status === "cancelled" ? "This order was cancelled. You can place a new one anytime." :
    order.status === "shipped" ? "Your order has been handed to the courier." :
    order.status === "completed" ? "Thanks for shopping with us!" :
    "This page updates by itself as soon as your bank transfer is confirmed. You don't need to refresh.";

  const c = order.customer;

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 32 }}>
      <OrderWatcher waiting={unpaidTransfer && !cancelled} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span className="mono" style={{ alignSelf: "flex-start", fontSize: 13, padding: "6px 12px", borderRadius: 999, background: order.status === "paid" || order.status === "shipped" || order.status === "completed" ? "var(--pop)" : "var(--surface)", border: "1.5px solid var(--text)" }}>
          ORDER #{String(order.code).slice(-8)} · {order.status.toUpperCase()}
        </span>
        <h1 style={{ margin: 0, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>{headline}</h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: "var(--muted)", maxWidth: 560 }}>{detail}</p>
        {unpaidTransfer && order.checkoutUrl && (
          <a href={order.checkoutUrl} className="vs-btn" style={{ alignSelf: "flex-start" }}>
            {cancelled ? "Try paying again" : "Open payment page"}
          </a>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 32, alignItems: "start" }}>
        <div style={{ background: "var(--surface)", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
          <span className="mono" style={{ fontSize: 13, letterSpacing: "0.08em" }}>DELIVER TO</span>
          <div style={{ lineHeight: 1.5 }}>
            <strong>{c.name}</strong><br />
            {c.phone}{c.email && <> · {c.email}</>}<br />
            {[c.address, c.ward, c.district, c.province].filter(Boolean).join(", ")}
            {c.note && <><br /><span style={{ color: "var(--muted)" }}>Note: {c.note}</span></>}
          </div>
          <span className="mono" style={{ fontSize: 13, letterSpacing: "0.08em" }}>PAYMENT</span>
          <span>Bank transfer (VietQR)</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, background: "var(--surface)", borderRadius: 28 }}>
            {order.items.map((i, idx) => (
              <li key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "16px 24px", borderBottom: "1px solid #E9E7DF" }}>
                <span>
                  {i.name} × {i.qty}
                  <br />
                  <span style={{ fontSize: 14, color: "var(--muted)" }}>{[i.size && `Size ${i.size}`, i.color].filter(Boolean).join(" · ")}</span>
                </span>
                <span style={{ fontWeight: 700 }}>{formatVND(i.unitPrice * i.qty)}</span>
              </li>
            ))}
          </ul>
          <OrderSummary subtotal={order.subtotal} shipping={order.shippingFee} total={order.total} />
          <Link href="/shop" className="vs-btn vs-btn-ghost">Keep shopping</Link>
        </div>
      </div>
    </section>
  );
}
