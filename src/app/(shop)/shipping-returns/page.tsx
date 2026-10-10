import type { Metadata } from "next";
import { PageTitle } from "@/components/shop/Listing";
import { formatVND, FREE_SHIPPING_OVER, SHIPPING_FEE } from "@/lib/money";

export const metadata: Metadata = { title: "Shipping & returns — Vansuok Studio" };

// TEMP wording. Replace the [bracketed] parts with the real policy.
const blocks = [
  {
    key: "SHIPPING",
    title: "Shipping",
    lines: [
      `Flat shipping fee of ${formatVND(SHIPPING_FEE)}. Free shipping on orders over ${formatVND(FREE_SHIPPING_OVER)}.`,
      "Delivery time: [number of days].",
      "We currently ship within Vietnam only.",
    ],
  },
  {
    key: "PAYMENT",
    title: "Payment",
    lines: [
      "We accept bank transfer via VietQR. Scan the QR code with any banking app.",
      "Your order is confirmed automatically as soon as the transfer arrives.",
    ],
  },
  {
    key: "EXCHANGES",
    title: "Exchanges & returns",
    lines: [
      "Wrong size or a problem with your order? Contact us within [time window] of receiving it.",
      "Conditions: [conditions, e.g. unworn, tags attached].",
      "Return shipping fee: [who pays].",
    ],
  },
];

export default function ShippingReturnsPage() {
  return (
    <>
      <PageTitle eyebrow="Help" title="Shipping & returns" />
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 16 }}>
        {blocks.map((b) => (
          <div key={b.key} style={{ background: "var(--surface)", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{b.key}</span>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>{b.title}</span>
            {b.lines.map((l) => (
              <p key={l} style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "var(--muted)" }}>{l}</p>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}
