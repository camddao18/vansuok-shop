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
      <div className="vs-pinfo" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "4px 8px 2px" }}>
        <Link
          href={`/products/${product.slug}`}
          title={product.name}
          className="vs-pname"
          style={{ display: "block", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {product.name}
        </Link>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{sub}</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 800, whiteSpace: "nowrap" }}>{formatVND(product.price)}</span>
          {/* Sản phẩm cần chọn size nên "thêm vào giỏ" đi qua trang sản phẩm. */}
          <Link
            href={`/products/${product.slug}`}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
            title="Thêm vào giỏ"
            className="vs-padd"
            style={{
              width: 44, height: 44, flex: "none", borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)",
              display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ stroke: "var(--on-btn)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 3.5h2.6l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.1a1.6 1.6 0 0 0 1.55-1.2L20 7.5H6" />
              <circle cx="9.5" cy="19.5" r="1.3" />
              <circle cx="17" cy="19.5" r="1.3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
