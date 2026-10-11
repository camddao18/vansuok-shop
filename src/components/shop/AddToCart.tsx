"use client";

import { useState } from "react";
import Link from "next/link";
import { SIZES, type ColorOption, type Size } from "@/lib/types";
import { useCart } from "./CartProvider";

export function AddToCart({
  productId, hasSizes, colors,
}: {
  productId: string;
  hasSizes: boolean;
  colors?: ColorOption[];
}) {
  const { add } = useCart();
  const [size, setSize] = useState<Size | undefined>();
  const [color, setColor] = useState<string | undefined>(colors?.length === 1 ? colors[0].id : undefined);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  function onAdd() {
    if (hasSizes && !size) return setError("Vui lòng chọn size trước.");
    if (colors?.length && !color) return setError("Vui lòng chọn màu trước.");
    setError("");
    add({ productId, size, color, qty });
    setAdded(true);
  }

  const pick = (selected: boolean) => ({
    minWidth: 48, minHeight: 40, padding: "0 14px", borderRadius: 999, fontFamily: "inherit", fontSize: 13, cursor: "pointer",
    border: "1.5px solid var(--text)", fontWeight: selected ? 700 : 500,
    background: selected ? "var(--btn)" : "transparent", color: selected ? "var(--on-btn)" : "var(--text)",
  }) as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {hasSizes && (
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", marginBottom: 8 }}>SIZE</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SIZES.map((s) => (
              <button key={s} type="button" aria-pressed={size === s} style={pick(size === s)} onClick={() => { setSize(s); setAdded(false); }}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {!!colors?.length && (
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", marginBottom: 8 }}>MÀU SẮC</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {colors.map((c) => (
              <button
                key={c.id} type="button" aria-pressed={color === c.id} aria-label={c.name} title={c.name}
                onClick={() => { setColor(c.id); setAdded(false); }}
                style={{
                  width: 40, height: 40, borderRadius: 999, background: c.hex, cursor: "pointer",
                  border: "1.5px solid var(--text)", outline: color === c.id ? "3px solid var(--text)" : "none", outlineOffset: 3,
                }}
              />
            ))}
          </div>
        </fieldset>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--text)", borderRadius: 999 }}>
          <button type="button" aria-label="Giảm số lượng" onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 40, height: 44, background: "none", border: "none", fontSize: 18, cursor: "pointer", fontFamily: "inherit" }}>−</button>
          <span aria-live="polite" style={{ minWidth: 24, textAlign: "center", fontWeight: 700, fontSize: 14 }}>{qty}</span>
          <button type="button" aria-label="Tăng số lượng" onClick={() => setQty((q) => Math.min(20, q + 1))} style={{ width: 40, height: 44, background: "none", border: "none", fontSize: 18, cursor: "pointer", fontFamily: "inherit" }}>+</button>
        </div>
        <button type="button" className="vs-btn" style={{ minHeight: 44, padding: "0 22px", fontSize: 14 }} onClick={onAdd}>Thêm vào giỏ</button>
      </div>

      <p role="status" style={{ margin: 0, minHeight: 22, fontSize: 13 }}>
        {error && <span style={{ color: "#B3261E", fontWeight: 700 }}>{error}</span>}
        {added && (
          <span>
            Đã thêm vào giỏ. <Link href="/cart" style={{ fontWeight: 700 }}>Xem giỏ hàng →</Link>
          </span>
        )}
      </p>
    </div>
  );
}
