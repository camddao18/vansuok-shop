import type { Metadata } from "next";
import Link from "next/link";
import { formatVND } from "@/lib/money";
import { listOrders } from "@/lib/orders";
import { listAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

const card = { background: "var(--surface)", borderRadius: 28, padding: 24, display: "flex", flexDirection: "column", gap: 6, textDecoration: "none" } as const;

export default async function Dashboard() {
  const [orders, products] = await Promise.all([listOrders(500), listAllProducts()]);
  const toShip = orders.filter((o) => o.status === "paid").length;
  const awaitingPayment = orders.filter((o) => o.status === "pending").length;
  const revenue = orders.filter((o) => o.status !== "pending" && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "TO SHIP", value: toShip, href: "/admin/orders", hint: "Paid, not shipped yet" },
    { label: "AWAITING PAYMENT", value: awaitingPayment, href: "/admin/orders", hint: "Pending orders" },
    { label: "REVENUE", value: formatVND(revenue), href: "/admin/orders", hint: "Paid, shipped and completed" },
    { label: "PRODUCTS", value: `${products.filter((p) => p.active).length} / ${products.length}`, href: "/admin/products", hint: "Visible / total" },
  ];

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 className="ad-title">Dashboard</h1>
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
        <span className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--muted)" }}>LATEST ORDERS</span>
        {orders.slice(0, 5).map((o) => (
          <Link key={o.code} href={`/admin/orders/${o.code}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, textDecoration: "none" }}>
            <span>#{String(o.code).slice(-8)} · {o.customer.name} · <em>{o.status}</em></span>
            <strong>{formatVND(o.total)}</strong>
          </Link>
        ))}
        {orders.length === 0 && <span style={{ color: "var(--muted)" }}>No orders yet.</span>}
      </div>
    </section>
  );
}
