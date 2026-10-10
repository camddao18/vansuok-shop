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
    if (hasSizes && !size) return setError("Pick a size first.");
    if (colors?.length && !color) return setError("Pick a color first.");
    setError("");
    add({ productId, size, color, qty });
    setAdded(true);
  }

  const pick = (selected: boolean) => ({
    minWidth: 56, minHeight: 48, padding: "0 16px", borderRadius: 999, fontFamily: "inherit", fontSize: 15, cursor: "pointer",
    border: "1.5px solid var(--text)", fontWeight: selected ? 700 : 500,
    background: selected ? "var(--btn)" : "transparent", color: selected ? "var(--on-btn)" : "var(--text)",
  }) as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {hasSizes && (
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend className="mono" style={{ fontSize: 13, letterSpacing: "0.08em", marginBottom: 10 }}>SIZE</legend>
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
          <legend className="mono" style={{ fontSize: 13, letterSpacing: "0.08em", marginBottom: 10 }}>COLOR</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {colors.map((c) => (
              <button
                key={c.id} type="button" aria-pressed={color === c.id} aria-label={c.name} title={c.name}
                onClick={() => { setColor(c.id); setAdded(false); }}
                style={{
                  width: 48, height: 48, borderRadius: 999, background: c.hex, cursor: "pointer",
                  border: "1.5px solid var(--text)", outline: color === c.id ? "3px solid var(--text)" : "none", outlineOffset: 3,
                }}
              />
            ))}
          </div>
        </fieldset>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--text)", borderRadius: 999 }}>
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 48, height: 52, background: "none", border: "none", fontSize: 22, cursor: "pointer", fontFamily: "inherit" }}>−</button>
          <span aria-live="polite" style={{ minWidth: 28, textAlign: "center", fontWeight: 700 }}>{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))} style={{ width: 48, height: 52, background: "none", border: "none", fontSize: 22, cursor: "pointer", fontFamily: "inherit" }}>+</button>
        </div>
        <button type="button" className="vs-btn" onClick={onAdd}>Add to cart</button>
      </div>

      <p role="status" style={{ margin: 0, minHeight: 24, fontSize: 15 }}>
        {error && <span style={{ color: "#B3261E", fontWeight: 700 }}>{error}</span>}
        {added && (
          <span>
            Added to cart. <Link href="/cart" style={{ fontWeight: 700 }}>View cart →</Link>
          </span>
        )}
      </p>
    </div>
  );
}
