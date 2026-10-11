import Link from "next/link";
import { getCategory, getCollection } from "@/lib/catalog";
import { formatVND } from "@/lib/money";
import type { Product } from "@/lib/types";
import { TeeArt } from "./TeeArt";
import { ZoomFrame } from "./ZoomFrame";

/** Màu nền lấy từ --pt do lưới `.vs-pgrid` xoay vòng (xem globals.css); ngoài lưới thì dùng màu của sản phẩm. */
export function ProductCard({ product }: { product: Product }) {
  const collection = getCollection(product.collection);
  const category = getCategory(product.category);
  const sub = category?.hasSizes ? "Size S–XL · Unisex" : category?.name;

  return (
    <article
      data-collection={product.collection}
      className="vs-pcard"
      style={{ background: "var(--surface)", borderRadius: 28, padding: 12, display: "flex", flexDirection: "column", gap: 14 }}
    >
      <ZoomFrame
        href={`/products/${product.slug}`}
        label={product.name}
        background={`var(--pt, ${product.tint})`}
        radius={20}
        scale={1.12}
        follow={false}
        badge={
          <span
            className="mono"
            style={{
              position: "absolute", top: 14, left: 14, zIndex: 1, fontSize: 12, background: "#FFFFFF", color: "#111111",
              padding: "6px 12px", borderRadius: 999,
            }}
          >
            {collection?.name}
          </span>
        }
      >
        <TeeArt product={product} />
      </ZoomFrame>
      <div className="vs-pinfo" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "4px 8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
          <Link
            href={`/products/${product.slug}`}
            title={product.name}
            style={{ display: "block", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {product.name}
          </Link>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{sub}</span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 800, whiteSpace: "nowrap", flex: "none" }}>{formatVND(product.price)}</span>
      </div>
      {/* Sản phẩm cần chọn size nên "thêm vào giỏ" đi qua trang sản phẩm. */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`Thêm ${product.name} vào giỏ hàng`}
        className="vs-padd"
        style={{
          minHeight: 44, borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)", fontSize: 14,
          fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, textDecoration: "none",
        }}
      >
        Thêm vào giỏ
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ stroke: "var(--on-btn)" }} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
    </article>
  );
}
