"use client";

import { useState } from "react";
import Link from "next/link";
import { formatVND } from "@/lib/money";
import { AddressFields } from "@/components/shop/AddressFields";
import { OrderSummary } from "@/components/shop/OrderSummary";
import { useCartDetail } from "@/components/shop/useCartDetail";

const FIELDS = [
  { name: "name", label: "Full name", autoComplete: "name", span: 2 },
  { name: "phone", label: "Phone", autoComplete: "tel", type: "tel", span: 1 },
  { name: "email", label: "Email (optional, for order updates)", autoComplete: "email", type: "email", span: 1, optional: true },
] as const;

export default function CheckoutPage() {
  const { details, lines, ready, subtotal, shipping, total } = useCartDetail();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines, customer: data }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.redirect) throw new Error(json.error ?? "Something went wrong. Please try again.");
      // Cart is cleared on the confirmation page, once we know the order exists.
      window.location.assign(json.redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (ready && details.length === 0) {
    return (
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>Checkout</h1>
        <p style={{ margin: 0, fontSize: 18, color: "var(--muted)" }}>Your cart is empty.</p>
        <Link href="/shop" className="vs-btn">Browse the shop</Link>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 32 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>Checkout</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 32, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <fieldset style={{ border: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
            <legend className="mono" style={{ fontSize: 13, letterSpacing: "0.08em", marginBottom: 14 }}>SHIPPING</legend>
            {FIELDS.map((f) => (
              <label key={f.name} className="vs-label" style={{ gridColumn: `span ${f.span}` }}>
                {f.label}
                <input
                  className="vs-input" name={f.name} type={"type" in f ? f.type : "text"} autoComplete={f.autoComplete}
                  required={!("optional" in f)} maxLength={200}
                />
              </label>
            ))}
            <AddressFields />
            <label className="vs-label" style={{ gridColumn: "span 2" }}>
              Street address (house number, street)
              <input className="vs-input" name="address" autoComplete="street-address" required maxLength={200} />
            </label>
            <label className="vs-label" style={{ gridColumn: "span 2" }}>
              Note for the courier (optional)
              <textarea className="vs-input" name="note" maxLength={300} />
            </label>
          </fieldset>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="mono" style={{ fontSize: 13, letterSpacing: "0.08em" }}>PAYMENT</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 18, borderRadius: 20, background: "var(--surface)", border: "2px solid var(--text)" }}>
              <strong style={{ fontSize: 17 }}>Bank transfer (VietQR)</strong>
              <span style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.45 }}>
                Scan a QR with any banking app. Your order is confirmed automatically once the transfer arrives.
              </span>
            </div>
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
            {busy ? "Please wait…" : `Pay ${formatVND(total)}`}
          </button>
          <Link href="/cart" className="vs-btn vs-btn-ghost">Back to cart</Link>
        </div>
      </form>
    </section>
  );
}
