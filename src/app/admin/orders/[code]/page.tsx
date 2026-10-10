import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatVND } from "@/lib/money";
import { getOrder } from "@/lib/orders";
import { NEXT_STATUS } from "@/lib/order-status";
import { changeStatus } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order" };

const card = { background: "var(--surface)", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 10 } as const;
const label = { fontSize: 12, letterSpacing: "0.08em", color: "var(--muted)" } as const;

export default async function AdminOrder({ params }: { params: Promise<{ code: string }> }) {
  const code = Number((await params).code);
  const order = Number.isSafeInteger(code) ? await getOrder(code) : null;
  if (!order) notFound();
  const c = order.customer;
  const address = [c.address, c.ward, c.district, c.province].filter(Boolean).join(", ");

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
      <Link href="/admin/orders" style={{ fontSize: 14 }}>← All orders</Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(36px, 4.4vw, 60px)", letterSpacing: "-0.04em", fontWeight: 800 }}>
          Order #{String(order.code).slice(-8)} <span style={{ fontSize: "0.5em", fontWeight: 700 }}>· {order.status}</span>
        </h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(NEXT_STATUS[order.status] ?? []).map((s) => (
            <form key={s.to} action={changeStatus}>
              <input type="hidden" name="code" value={order.code} />
              <input type="hidden" name="to" value={s.to} />
              <button type="submit" className="vs-btn" style={{ minHeight: 48 }}>{s.label}</button>
            </form>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 16, alignItems: "start" }}>
        <div style={card}>
          <span className="mono" style={label}>CUSTOMER</span>
          <strong style={{ fontSize: 20 }}>{c.name}</strong>
          <a href={`tel:${c.phone}`}>{c.phone}</a>
          {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
          <span>{address}</span>
          {c.note && <span style={{ color: "var(--muted)" }}>Note: {c.note}</span>}
        </div>

        <div style={card}>
          <span className="mono" style={label}>ITEMS</span>
          {order.items.map((i, k) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span>{i.name}{i.size && ` (${i.size})`}{i.color && ` · ${i.color}`} × {i.qty}</span>
              <span>{formatVND(i.unitPrice * i.qty)}</span>
            </div>
          ))}
          <hr style={{ border: 0, borderTop: "1px solid #E9E7DF", width: "100%" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{formatVND(order.subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Shipping</span><span>{formatVND(order.shippingFee)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 20 }}><span>Total</span><span>{formatVND(order.total)}</span></div>
        </div>

        <div style={card}>
          <span className="mono" style={label}>PAYMENT</span>
          <span>VietQR via payOS</span>
          <span className="mono" style={{ fontSize: 13, wordBreak: "break-all" }}>Code {order.code}</span>
          {order.paymentLinkId && <span className="mono" style={{ fontSize: 13, wordBreak: "break-all" }}>Link {order.paymentLinkId}</span>}
          <span style={{ color: "var(--muted)" }}>Placed {new Date(order.createdAt).toLocaleString("vi-VN")}</span>
        </div>
      </div>
    </section>
  );
}
