import type { Metadata } from "next";
import Link from "next/link";
import { formatVND } from "@/lib/money";
import { listOrders } from "@/lib/orders";
import { NEXT_STATUS } from "@/lib/order-status";
import { changeStatus } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders" };

const th = { textAlign: "left", padding: "12px 14px", fontSize: 12, whiteSpace: "nowrap" } as const;
const td = { padding: "12px 14px", verticalAlign: "top", borderTop: "1px solid #E9E7DF", fontSize: 14 } as const;

export default async function AdminOrders() {
  const orders = await listOrders();
  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(36px, 4.4vw, 60px)", letterSpacing: "-0.04em", fontWeight: 800 }}>Orders ({orders.length})</h1>
      <div style={{ overflowX: "auto", background: "var(--surface)", borderRadius: 28 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
          <thead>
            <tr className="mono">
              <th style={th}>ORDER</th><th style={th}>DATE</th><th style={th}>STATUS</th><th style={th}>PAYMENT</th>
              <th style={th}>CUSTOMER</th><th style={th}>ITEMS</th><th style={th}>TOTAL</th><th style={th}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.code}>
                <td style={td} className="mono"><Link href={`/admin/orders/${o.code}`}>#{String(o.code).slice(-8)}</Link></td>
                <td style={td}>{new Date(o.createdAt).toLocaleString("vi-VN")}</td>
                <td style={{ ...td, fontWeight: 700 }}>{o.status}</td>
                <td style={td}>VietQR</td>
                <td style={td}>
                  {o.customer.name}<br />{o.customer.phone}<br />
                  <span style={{ color: "var(--muted)" }}>{[o.customer.address, o.customer.ward, o.customer.district, o.customer.province].filter(Boolean).join(", ")}</span>
                </td>
                <td style={td}>
                  {o.items.map((i, k) => <div key={k}>{i.name} {i.size && `(${i.size})`} × {i.qty}</div>)}
                </td>
                <td style={{ ...td, fontWeight: 700 }}>{formatVND(o.total)}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(NEXT_STATUS[o.status] ?? []).map((s) => (
                      <form key={s.to} action={changeStatus}>
                        <input type="hidden" name="code" value={o.code} />
                        <input type="hidden" name="to" value={s.to} />
                        <button type="submit" className="vs-tab" style={{ minHeight: 36, padding: "0 14px", fontSize: 13 }}>{s.label}</button>
                      </form>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td style={td} colSpan={8}>No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
