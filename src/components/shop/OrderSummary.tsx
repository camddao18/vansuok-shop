import { formatVND, FREE_SHIPPING_OVER } from "@/lib/money";

export function OrderSummary({ subtotal, shipping, total }: { subtotal: number; shipping: number; total: number }) {
  const row = { display: "flex", justifyContent: "space-between", gap: 12 } as const;
  return (
    <div style={{ background: "var(--surface)", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={row}><span>Subtotal</span><span>{formatVND(subtotal)}</span></div>
      <div style={row}>
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : formatVND(shipping)}</span>
      </div>
      {shipping > 0 && (
        <span style={{ fontSize: 14, color: "var(--muted)" }}>Free shipping over {formatVND(FREE_SHIPPING_OVER)}.</span>
      )}
      <div style={{ ...row, fontSize: 22, fontWeight: 800, paddingTop: 14, borderTop: "1.5px solid var(--text)" }}>
        <span>Total</span><span>{formatVND(total)}</span>
      </div>
    </div>
  );
}
