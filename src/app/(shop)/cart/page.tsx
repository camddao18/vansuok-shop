"use client";

import Link from "next/link";
import { formatVND } from "@/lib/money";
import { OrderSummary } from "@/components/shop/OrderSummary";
import { TeeArt } from "@/components/shop/TeeArt";
import { useCartDetail } from "@/components/shop/useCartDetail";

const qtyBtn = { width: 40, height: 44, background: "none", border: "none", fontSize: 20, cursor: "pointer", fontFamily: "inherit" } as const;

export default function CartPage() {
  const { details, ready, subtotal, shipping, total, setQty, remove } = useCartDetail();

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 32 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>Your cart</h1>

      {!ready ? null : details.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
          <p style={{ margin: 0, fontSize: 18, color: "var(--muted)" }}>Your cart is empty.</p>
          <Link href="/shop" className="vs-btn">Browse the shop</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 32, alignItems: "start" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {details.map(({ line, product, colorName }) => (
              <li key={`${line.productId}-${line.size}-${line.color}`} style={{ background: "var(--surface)", borderRadius: 28, padding: 12, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
                <Link href={`/products/${product.slug}`} aria-label={product.name} style={{ width: 110, flex: "none", aspectRatio: "1 / 1", borderRadius: 20, background: product.tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TeeArt product={product} width="72%" />
                </Link>
                <div style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <Link href={`/products/${product.slug}`} style={{ fontSize: 19, fontWeight: 700, textDecoration: "none" }}>{product.name}</Link>
                  <span style={{ fontSize: 14, color: "var(--muted)" }}>
                    {[line.size && `Size ${line.size}`, colorName].filter(Boolean).join(" · ") || "—"}
                  </span>
                  <span style={{ fontWeight: 800 }}>{formatVND(product.price * line.qty)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--text)", borderRadius: 999 }}>
                    <button type="button" aria-label={`Decrease quantity of ${product.name}`} style={qtyBtn} onClick={() => setQty(line, line.qty - 1)}>−</button>
                    <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>{line.qty}</span>
                    <button type="button" aria-label={`Increase quantity of ${product.name}`} style={qtyBtn} onClick={() => setQty(line, line.qty + 1)}>+</button>
                  </div>
                  <button type="button" onClick={() => remove(line)} style={{ minHeight: 44, padding: "0 8px", background: "none", border: "none", textDecoration: "underline", cursor: "pointer", fontFamily: "inherit", fontSize: 15 }}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
            <Link href="/checkout" className="vs-btn">Checkout</Link>
            <Link href="/shop" className="vs-btn vs-btn-ghost">Keep shopping</Link>
          </div>
        </div>
      )}
    </section>
  );
}
