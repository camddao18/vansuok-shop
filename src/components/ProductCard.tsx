import Link from "next/link";
import { getCategory, getCollection } from "@/lib/catalog";
import { formatVND } from "@/lib/money";
import type { Product } from "@/lib/types";
import { TeeArt } from "./TeeArt";

export function ProductCard({ product }: { product: Product }) {
  const collection = getCollection(product.collection);
  const category = getCategory(product.category);
  const sub = category?.hasSizes ? "Sizes S–XXL · Unisex" : category?.name;

  return (
    <article
      data-collection={product.collection}
      className="vs-card"
      style={{ background: "var(--surface)", borderRadius: 28, padding: 12, display: "flex", flexDirection: "column", gap: 14 }}
    >
      <Link
        href={`/products/${product.slug}`}
        aria-label={product.name}
        style={{
          borderRadius: 20, background: product.tint, aspectRatio: "1 / 1", display: "flex", alignItems: "center",
          justifyContent: "center", position: "relative", textDecoration: "none",
        }}
      >
        <span
          className="mono"
          style={{
            position: "absolute", top: 14, left: 14, fontSize: 12, background: "#FFFFFF", color: "#111111",
            padding: "6px 12px", borderRadius: 999,
          }}
        >
          {collection?.name}
        </span>
        <TeeArt product={product} />
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "4px 8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Link href={`/products/${product.slug}`} style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", textDecoration: "none" }}>
            {product.name}
          </Link>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>{sub}</span>
        </div>
        <span style={{ fontSize: 19, fontWeight: 800 }}>{formatVND(product.price)}</span>
      </div>
      {/* Products have a size to choose, so "add" goes through the product page. */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`Add ${product.name} to cart`}
        style={{
          minHeight: 48, borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)", fontSize: 15,
          fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, textDecoration: "none",
        }}
      >
        Add to cart
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ stroke: "var(--on-btn)" }} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
    </article>
  );
}
