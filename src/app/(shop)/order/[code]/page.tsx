import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { formatVND } from "@/lib/money";
import { getOrder } from "@/lib/orders";
import { PAYMENT_LABEL, statusLabel } from "@/lib/order-status";
import { OrderWatcher } from "@/components/shop/OrderWatcher";
import { OrderSummary } from "@/components/shop/OrderSummary";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Đơn hàng — Duck Delivery", robots: { index: false } };

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

  const isCod = order.paymentMethod === "cod";
  const unpaidTransfer = order.status === "pending" && !isCod;
  const headline =
    order.status === "paid" ? "Đã nhận thanh toán." :
    order.status === "cancelled" ? "Đơn hàng đã hủy." :
    order.status === "shipped" ? "Đang trên đường giao." :
    order.status === "completed" ? "Đã giao hàng." :
    isCod ? "Đã nhận đơn hàng." : cancelled ? "Thanh toán chưa hoàn tất." : "Đang chờ bạn chuyển khoản…";
  const detail =
    order.status === "paid" ? "Cảm ơn bạn! Chúng tôi đang chuẩn bị đơn hàng." :
    order.status === "cancelled" ? "Đơn hàng này đã bị hủy. Bạn có thể đặt đơn mới bất cứ lúc nào." :
    order.status === "shipped" ? "Đơn hàng đã được bàn giao cho đơn vị vận chuyển." :
    order.status === "completed" ? "Cảm ơn bạn đã mua sắm cùng chúng tôi!" :
    isCod ? "Cảm ơn bạn! Chúng tôi sẽ liên hệ xác nhận đơn và giao hàng. Bạn thanh toán tiền mặt khi nhận hàng." :
    "Trang này sẽ tự cập nhật ngay khi khoản chuyển khoản của bạn được xác nhận. Bạn không cần tải lại trang.";

  const c = order.customer;

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 32 }}>
      <OrderWatcher waiting={unpaidTransfer && !cancelled} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span className="mono" style={{ alignSelf: "flex-start", fontSize: 13, padding: "6px 12px", borderRadius: 999, background: order.status === "paid" || order.status === "shipped" || order.status === "completed" ? "var(--pop)" : "var(--surface)", border: "1.5px solid var(--text)" }}>
          ĐƠN HÀNG #{String(order.code).slice(-8)} · {statusLabel(order).toUpperCase()}
        </span>
        <h1 style={{ margin: 0, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>{headline}</h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: "var(--muted)", maxWidth: 560 }}>{detail}</p>
        {unpaidTransfer && order.checkoutUrl && (
          <a href={order.checkoutUrl} className="vs-btn" style={{ alignSelf: "flex-start" }}>
            {cancelled ? "Thử thanh toán lại" : "Mở trang thanh toán"}
          </a>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 32, alignItems: "start" }}>
        <div style={{ background: "var(--surface)", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
          <span className="mono" style={{ fontSize: 13, letterSpacing: "0.08em" }}>GIAO ĐẾN</span>
          <div style={{ lineHeight: 1.5 }}>
            <strong>{c.name}</strong><br />
            {c.phone}{c.email && <> · {c.email}</>}<br />
            {[c.address, c.ward, c.district, c.province].filter(Boolean).join(", ")}
            {c.note && <><br /><span style={{ color: "var(--muted)" }}>Ghi chú: {c.note}</span></>}
          </div>
          <span className="mono" style={{ fontSize: 13, letterSpacing: "0.08em" }}>THANH TOÁN</span>
          <span>{PAYMENT_LABEL[order.paymentMethod]}</span>
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
          <Link href="/shop" className="vs-btn vs-btn-ghost">Tiếp tục mua sắm</Link>
        </div>
      </div>
    </section>
  );
}
