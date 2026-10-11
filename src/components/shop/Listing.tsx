import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import type { CategoryId, CollectionId, Product } from "@/lib/types";
import { FilterDropdown } from "./FilterDropdown";
import { ProductGrid } from "./ProductGrid";

export interface ListingFilters {
  category?: CategoryId;
  collection?: CollectionId;
  q?: string;
}

/** Build a listing URL from filters, dropping empties. */
export function listingHref(base: string, f: ListingFilters) {
  const p = new URLSearchParams();
  if (f.category) p.set("category", f.category);
  if (f.collection) p.set("collection", f.collection);
  if (f.q) p.set("q", f.q);
  const s = p.toString();
  return s ? `${base}?${s}` : base;
}

/**
 * Product grid with category (and optionally collection) filters.
 * `base` is the page path; filters live in the query string.
 */
export function Listing({
  base, products, filters, showCollectionTabs,
}: {
  base: string;
  products: Product[];
  filters: ListingFilters;
  showCollectionTabs?: boolean;
}) {
  const catTabs = [
    { name: "Tất cả", href: listingHref(base, { ...filters, category: undefined }), active: !filters.category },
    ...CATEGORIES.map((c) => ({
      name: c.label + (c.available ? "" : " · sắp ra mắt"),
      href: listingHref(base, { ...filters, category: c.id }),
      active: filters.category === c.id,
    })),
  ];
  const colTabs = [
    { name: "Mọi nghề", href: listingHref(base, { ...filters, collection: undefined }), active: !filters.collection },
    ...COLLECTIONS.map((c) => ({
      name: c.name,
      href: listingHref(base, { ...filters, collection: c.id }),
      active: filters.collection === c.id,
    })),
  ];

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <FilterDropdown label="Loại" items={catTabs} />
        {showCollectionTabs && <FilterDropdown label="Bộ sưu tập" items={colTabs} />}
      </div>

      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <p style={{ margin: 0, padding: "48px 0", fontSize: 18, color: "var(--muted)" }}>
          Chưa có gì ở đây — hàng mới sắp về.
        </p>
      )}
    </section>
  );
}

export function PageTitle({ eyebrow, title, blurb }: { eyebrow?: string; title: React.ReactNode; blurb?: string }) {
  return (
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {eyebrow && <span className="mono" style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>{eyebrow}</span>}
        <h1 style={{ margin: 0, fontSize: "clamp(44px, 4vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>{title}</h1>
        {blurb && <p style={{ margin: 0, maxWidth: 560, fontSize: 17, lineHeight: 1.5, color: "var(--muted)" }}>{blurb}</p>}
      </div>
    </div>
  );
}
