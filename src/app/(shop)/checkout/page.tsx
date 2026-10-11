"use client";

import { useState } from "react";
import Link from "next/link";
import { formatVND } from "@/lib/money";
import { Req } from "@/components/shop/Req";
import { AddressFields } from "@/components/shop/AddressFields";
import { OrderSummary } from "@/components/shop/OrderSummary";
import { useAccount } from "@/components/shop/AccountProvider";
import { useCartDetail } from "@/components/shop/useCartDetail";

const FIELDS = [
  { name: "name", label: "Họ và tên", autoComplete: "name", span: 2 },
  { name: "phone", label: "Số điện thoại", autoComplete: "tel", type: "tel", span: 1 },
  { name: "email", label: "Email (không bắt buộc, để nhận cập nhật đơn hàng)", autoComplete: "email", type: "email", span: 1, optional: true },
] as const;

export default function CheckoutPage() {
  const { details, lines, ready, subtotal, shipping, total } = useCartDetail();
  const account = useAccount();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [method, setMethod] = useState<"payos" | "cod">("payos");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines, customer: data, paymentMethod: method }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.redirect) throw new Error(json.error ?? "Đã có lỗi xảy ra. Vui lòng thử lại.");
      // Giỏ hàng được xóa ở trang xác nhận, khi đã chắc chắn đơn hàng tồn tại.
      window.location.assign(json.redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      setBusy(false);
    }
  }

  if (ready && details.length === 0) {
    return (
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>Thanh toán</h1>
        <p style={{ margin: 0, fontSize: 18, color: "var(--muted)" }}>Giỏ hàng của bạn đang trống.</p>
        <Link href="/shop" className="vs-btn">Xem cửa hàng</Link>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 32 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>Thanh toán</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 32, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <fieldset style={{ border: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
            <legend className="mono" style={{ fontSize: 13, letterSpacing: "0.08em", marginBottom: 14 }}>GIAO HÀNG</legend>
            <p style={{ gridColumn: "span 2", margin: 0, fontSize: 14, color: "var(--muted)" }}><Req />Thông tin bắt buộc</p>
            {FIELDS.map((f) => (
              <label key={f.name} className="vs-label" style={{ gridColumn: `span ${f.span}` }}>
                <span>{f.label}{!("optional" in f) && <Req />}</span>
                <input
                  className="vs-input" name={f.name} type={"type" in f ? f.type : "text"} autoComplete={f.autoComplete}
                  required={!("optional" in f)} maxLength={200}
                  defaultValue={account?.[f.name as "name" | "phone" | "email"] ?? ""}
                />
              </label>
            ))}
            <AddressFields />
            <label className="vs-label" style={{ gridColumn: "span 2" }}>
              <span>Địa chỉ (số nhà, tên đường)<Req /></span>
              <input className="vs-input" name="address" autoComplete="street-address" required maxLength={200} />
            </label>
            <label className="vs-label" style={{ gridColumn: "span 2" }}>
              Ghi chú cho shipper (không bắt buộc)
              <textarea className="vs-input" name="note" maxLength={300} />
            </label>
          </fieldset>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="mono" style={{ fontSize: 13, letterSpacing: "0.08em" }}>THANH TOÁN</span>
            {([
              { id: "payos", title: "Chuyển khoản ngân hàng (VietQR)", note: "Quét mã QR bằng bất kỳ ứng dụng ngân hàng nào. Đơn hàng sẽ được xác nhận tự động khi nhận được tiền chuyển khoản." },
              { id: "cod", title: "Thanh toán khi nhận hàng (COD)", note: "Trả tiền mặt cho shipper khi nhận hàng. Chúng tôi sẽ liên hệ xác nhận đơn trước khi giao." },
            ] as const).map((m) => (
              <label key={m.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 18, borderRadius: 20, background: "var(--surface)", border: method === m.id ? "2px solid var(--text)" : "2px solid transparent", cursor: "pointer" }}>
                <input type="radio" name="paymentMethod" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} style={{ marginTop: 4 }} />
                <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <strong style={{ fontSize: 17 }}>{m.title}</strong>
                  <span style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.45 }}>{m.note}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, background: "var(--surface)", borderRadius: 28 }}>
            {details.map(({ line, product, colorName }) => (
              <li key={`${line.productId}-${line.size}-${line.color}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "16px 24px", borderBottom: "1px solid #E9E7DF" }}>
                <span>
                  {product.name} × {line.qty}
                  <br />
                  <span style={{ fontSize: 14, color: "var(--muted)" }}>{[line.size && `Size ${line.size}`, colorName].filter(Boolean).join(" · ")}</span>
                </span>
                <span style={{ fontWeight: 700 }}>{formatVND(product.price * line.qty)}</span>
              </li>
            ))}
          </ul>
          <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
          <p role="alert" style={{ margin: 0, minHeight: 22, color: "#B3261E", fontWeight: 700 }}>{error}</p>
          <button type="submit" className="vs-btn" disabled={busy || !ready}>
            {busy ? "Vui lòng chờ…" : method === "cod" ? `Đặt hàng · ${formatVND(total)}` : `Thanh toán ${formatVND(total)}`}
          </button>
          <Link href="/cart" className="vs-btn vs-btn-ghost">Quay lại giỏ hàng</Link>
        </div>
      </form>
    </section>
  );
}
