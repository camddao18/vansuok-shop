"use client";

import { useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";
import { TeeArt } from "./TeeArt";
import { ZoomFrame } from "./ZoomFrame";

/** Ảnh lớn có zoom + dải ảnh nhỏ để chuyển ảnh khi sản phẩm có nhiều ảnh. */
export function ProductGallery({ product, badge }: { product: Product; badge: ReactNode }) {
  const images = product.images?.length ? product.images : [product.image ?? ""];
  const [i, setI] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <ZoomFrame background={product.tint} badge={badge}>
        <TeeArt product={{ ...product, image: images[i] || undefined }} width="80%" />
      </ZoomFrame>
      {images.length > 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {images.map((url, n) => (
            <button
              key={url} type="button" aria-label={`Xem ảnh ${n + 1}`} aria-current={n === i} onClick={() => setI(n)}
              style={{ width: 72, height: 72, padding: 4, borderRadius: 16, background: product.tint, cursor: "pointer", border: n === i ? "2px solid var(--text)" : "2px solid transparent" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
