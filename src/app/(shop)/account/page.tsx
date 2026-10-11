import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionCustomer } from "@/lib/customer-session";
import { formatVND } from "@/lib/money";
import { listOrdersForCustomer } from "@/lib/orders";
import { statusLabel } from "@/lib/order-status";
import { PageTitle } from "@/components/shop/Listing";
import { logoutCustomer } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tài khoản — Duck Delivery", robots: { index: false } };

export default async function AccountPage() {
  const me = await getSessionCustomer();
  if (!me) redirect("/login");
  const orders = await listOrdersForCustomer(me.id);

  return (
    <>
      <PageTitle eyebrow="Tài khoản" title={`Xin chào, ${me.name}`} blurb={`${me.email} · ${me.phone}`} />
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em", fontWeight: 800 }}>Đơn hàng của bạn ({orders.length})</h2>
          <form action={logoutCustomer}><button type="submit" className="vs-btn vs-btn-ghost" style={{ minHeight: 44 }}>Đăng xuất</button></form>
        </div>

        {orders.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
            <p style={{ margin: 0, fontSize: 18, color: "var(--muted)" }}>Bạn chưa có đơn hàng nào.</p>
            <Link href="/shop" className="vs-btn">Xem cửa hàng</Link>
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {orders.map((o) => (
              <li key={o.code}>
                <Link
                  href={`/order/${o.code}?t=${o.accessToken}`}
                  style={{ background: "var(--surface)", borderRadius: 28, padding: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, textDecoration: "none" }}
                >
                  <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span className="mono" style={{ fontSize: 13 }}>ĐƠN #{String(o.code).slice(-8)} · {statusLabel(o).toUpperCase()}</span>
                    <span style={{ fontSize: 16 }}>{o.items.map((i) => `${i.name}${i.size ? ` (${i.size})` : ""} × ${i.qty}`).join(", ")}</span>
                    <span style={{ fontSize: 14, color: "var(--muted)" }}>{new Date(o.createdAt).toLocaleString("vi-VN")}</span>
                  </span>
                  <strong style={{ fontSize: 20 }}>{formatVND(o.total)}</strong>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
