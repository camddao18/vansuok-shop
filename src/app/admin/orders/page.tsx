import type { Metadata } from "next";
import { formatVND } from "@/lib/money";
import { listOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders — Vansuok admin", robots: { index: false } };

const th = { textAlign: "left", padding: "12px 14px", fontSize: 12, whiteSpace: "nowrap" } as const;
const td = { padding: "12px 14px", verticalAlign: "top", borderTop: "1px solid #E9E7DF", fontSize: 14 } as const;

export default async function AdminOrders() {
  const orders = await listOrders();
  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(36px, 4.4vw, 60px)", letterSpacing: "-0.04em", fontWeight: 800 }}>Orders ({orders.length})</h1>
      <div style={{ overflowX: "auto", background: "var(--surface)", borderRadius: 28 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr className="mono">
              <th style={th}>ORDER</th><th style={th}>DATE</th><th style={th}>STATUS</th><th style={th}>PAYMENT</th>
              <th style={th}>CUSTOMER</th><th style={th}>ITEMS</th><th style={th}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.code}>
                <td style={td} className="mono">#{String(o.code).slice(-8)}</td>
                <td style={td}>{new Date(o.createdAt).toLocaleString("vi-VN")}</td>
                <td style={{ ...td, fontWeight: 700 }}>{o.status}</td>
                <td style={td}>VietQR</td>
                <td style={td}>
                  {o.customer.name}<br />{o.customer.phone}<br />
                  <span style={{ color: "var(--muted)" }}>{o.customer.address}, {o.customer.ward}, {o.customer.district}, {o.customer.province}</span>
                </td>
                <td style={td}>
                  {o.items.map((i, k) => <div key={k}>{i.name} {i.size && `(${i.size})`} × {i.qty}</div>)}
                </td>
                <td style={{ ...td, fontWeight: 700 }}>{formatVND(o.total)}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td style={td} colSpan={7}>No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
