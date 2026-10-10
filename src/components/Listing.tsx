import Link from "next/link";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import type { CategoryId, CollectionId, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

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

function Tabs({ label, items }: { label: string; items: { name: string; href: string; active: boolean }[] }) {
  return (
    <div role="group" aria-label={label} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((i) => (
        <Link key={i.name} href={i.href} className="vs-tab" aria-current={i.active ? "true" : undefined}>
          {i.name}
        </Link>
      ))}
    </div>
  );
}

/**
 * Product grid with category (and optionally collection) filters.
 * `base` is the page path; filters live in the query string.
 */
export function Listing({
  base, products, filters, showCollectionTabs, showSearch,
}: {
  base: string;
  products: Product[];
  filters: ListingFilters;
  showCollectionTabs?: boolean;
  showSearch?: boolean;
}) {
  const catTabs = [
    { name: "All", href: listingHref(base, { ...filters, category: undefined }), active: !filters.category },
    ...CATEGORIES.map((c) => ({
      name: c.label + (c.available ? "" : " · soon"),
      href: listingHref(base, { ...filters, category: c.id }),
      active: filters.category === c.id,
    })),
  ];
  const colTabs = [
    { name: "All trades", href: listingHref(base, { ...filters, collection: undefined }), active: !filters.collection },
    ...COLLECTIONS.map((c) => ({
      name: c.name,
      href: listingHref(base, { ...filters, collection: c.id }),
      active: filters.collection === c.id,
    })),
  ];

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Tabs label="Filter by product type" items={catTabs} />
        {showCollectionTabs && <Tabs label="Filter by collection" items={colTabs} />}
        {showSearch && (
          <form id="search" action={base} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {filters.category && <input type="hidden" name="category" value={filters.category} />}
            {filters.collection && <input type="hidden" name="collection" value={filters.collection} />}
            <input className="vs-input" style={{ maxWidth: 360, borderRadius: 999 }} type="search" name="q" defaultValue={filters.q} placeholder="Search products…" aria-label="Search products" />
            <button className="vs-btn" style={{ minHeight: 52 }} type="submit">Search</button>
          </form>
        )}
      </div>

      {products.length ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 16 }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p style={{ margin: 0, padding: "48px 0", fontSize: 18, color: "var(--muted)" }}>
          Nothing here yet — new drops are on the way.
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
        <h1 style={{ margin: 0, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>{title}</h1>
      </div>
      {blurb && <p style={{ margin: 0, maxWidth: 400, fontSize: 17, lineHeight: 1.5, color: "var(--muted)" }}>{blurb}</p>}
    </div>
  );
}
