import type { Metadata } from "next";
import Link from "next/link";
import { formatVND } from "@/lib/money";
import { listOrders } from "@/lib/orders";
import { listAllProducts } from "@/lib/products";
import { statusLabel } from "@/lib/order-status";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bảng điều khiển" };

const card = { background: "var(--surface)", borderRadius: 28, padding: 24, display: "flex", flexDirection: "column", gap: 6, textDecoration: "none" } as const;

export default async function Dashboard() {
  const [orders, products] = await Promise.all([listOrders(500), listAllProducts()]);
  const toShip = orders.filter((o) => o.status === "paid" || (o.status === "pending" && o.paymentMethod === "cod")).length;
  const awaitingPayment = orders.filter((o) => o.status === "pending" && o.paymentMethod === "payos").length;
  const revenue = orders.filter((o) => o.status !== "pending" && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "CẦN GIAO", value: toShip, href: "/admin/orders", hint: "Đã thanh toán hoặc COD chờ xác nhận" },
    { label: "CHỜ THANH TOÁN", value: awaitingPayment, href: "/admin/orders", hint: "Đơn chuyển khoản đang chờ" },
    { label: "DOANH THU", value: formatVND(revenue), href: "/admin/orders", hint: "Đã thanh toán, đang giao và hoàn tất" },
    { label: "SẢN PHẨM", value: `${products.filter((p) => p.active).length} / ${products.length}`, href: "/admin/products", hint: "Hiển thị / tổng" },
  ];

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 className="ad-title">Bảng điều khiển</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} style={card}>
            <span className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--muted)" }}>{s.label}</span>
            <strong style={{ fontSize: 32, letterSpacing: "-0.03em" }}>{s.value}</strong>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{s.hint}</span>
          </Link>
        ))}
      </div>

      <div style={{ ...card, gap: 12 }}>
        <span className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--muted)" }}>ĐƠN HÀNG MỚI NHẤT</span>
        {orders.slice(0, 5).map((o) => (
          <Link key={o.code} href={`/admin/orders/${o.code}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, textDecoration: "none" }}>
            <span>#{String(o.code).slice(-8)} · {o.customer.name} · <em>{statusLabel(o)}</em></span>
            <strong>{formatVND(o.total)}</strong>
          </Link>
        ))}
        {orders.length === 0 && <span style={{ color: "var(--muted)" }}>Chưa có đơn hàng nào.</span>}
      </div>
    </section>
  );
}
