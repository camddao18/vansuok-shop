"use client";

import { useState } from "react";
import Link from "next/link";
import type { Collection, Product } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";

export function FreshTees({ products, collections }: { products: Product[]; collections: Collection[] }) {
  const [filter, setFilter] = useState<string>("all");
  const tabs = [{ id: "all", name: "Tất cả" }, ...collections.map((c) => ({ id: c.id, name: c.name }))];

  return (
    <section id="shop" style={{ maxWidth: 1360, margin: "0 auto", padding: "80px 24px", display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
        <h2 style={{ margin: 0, fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 800 }}>Áo mới về</h2>
        <div role="group" aria-label="Lọc theo bộ sưu tập" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((t) => (
            <button key={t.id} className="vs-tab" aria-pressed={filter === t.id} onClick={() => setFilter(t.id)}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <ProductGrid products={products.filter((p) => filter === "all" || p.collection === filter)} />

      <Link
        href="/shop"
        style={{
          alignSelf: "center", display: "inline-flex", alignItems: "center", minHeight: 52, padding: "0 28px",
          borderRadius: 999, border: "1.5px solid var(--text)", textDecoration: "none", fontWeight: 700,
        }}
      >
        Xem tất cả áo thun
      </Link>
    </section>
  );
}
