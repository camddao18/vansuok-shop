import { SubmitButton } from "@/components/admin/SubmitButton";
import type { Metadata } from "next";
import Link from "next/link";
import { formatVND } from "@/lib/money";
import { listOrders } from "@/lib/orders";
import { nextStatuses, statusLabel } from "@/lib/order-status";
import { changeStatus } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Đơn hàng" };

const th = { textAlign: "left", padding: "12px 14px", fontSize: 12, whiteSpace: "nowrap" } as const;
const td = { padding: "12px 14px", verticalAlign: "top", borderTop: "1px solid #E9E7DF", fontSize: 14 } as const;

export default async function AdminOrders() {
  const orders = await listOrders();
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(26px, 2.6vw, 34px)", letterSpacing: "-0.04em", fontWeight: 800 }}>Đơn hàng ({orders.length})</h1>
      <div style={{ overflowX: "auto", background: "var(--surface)", borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
          <thead>
            <tr className="mono">
              <th style={th}>ĐƠN</th><th style={th}>NGÀY</th><th style={th}>TRẠNG THÁI</th><th style={th}>THANH TOÁN</th>
              <th style={th}>KHÁCH HÀNG</th><th style={th}>SẢN PHẨM</th><th style={th}>TỔNG</th><th style={th}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.code}>
                <td style={td} className="mono"><Link href={`/admin/orders/${o.code}`}>#{String(o.code).slice(-8)}</Link></td>
                <td style={td}>{new Date(o.createdAt).toLocaleString("vi-VN")}</td>
                <td style={{ ...td, fontWeight: 700 }}>{statusLabel(o)}</td>
                <td style={td}>{o.paymentMethod === "cod" ? "COD" : "VietQR"}</td>
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
                    {nextStatuses(o).map((s) => (
                      <form key={s.to} action={changeStatus}>
                        <input type="hidden" name="code" value={o.code} />
                        <input type="hidden" name="to" value={s.to} />
                        <SubmitButton className="vs-tab" style={{ minHeight: 36, padding: "0 14px", fontSize: 13 }} pendingText="Đang lưu…">{s.label}</SubmitButton>
                      </form>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td style={td} colSpan={8}>Chưa có đơn hàng nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
