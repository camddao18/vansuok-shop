import Link from "next/link";
import type { Collection } from "@/lib/types";

interface Theme {
  bg: string;
  fg: string;
  link: string; // "View collection" color
  chipBorder: string;
  blurbOpacity: number;
  motif: React.ReactNode;
}

/** Per-trade look. A new collection without an entry falls back to the black card, no motif. */
const THEMES: Record<string, Theme> = {
  trading: {
    bg: "var(--solid)", fg: "var(--on-solid)", link: "var(--pop)", chipBorder: "var(--on-solid)", blurbOpacity: 0.82,
    motif: (
      <svg viewBox="0 0 240 120" style={{ width: "100%" }} aria-hidden="true">
        <polyline points="0,100 30,86 55,92 85,60 110,70 140,38 170,48 200,18 240,8" fill="none" style={{ stroke: "var(--pop)" }} strokeWidth="4" strokeLinejoin="round" />
        <circle cx="240" cy="8" r="6" style={{ fill: "var(--pop)" }} />
      </svg>
    ),
  },
  navy: {
    bg: "var(--deep)", fg: "#FFFFFF", link: "#FFFFFF", chipBorder: "#FFFFFF", blurbOpacity: 0.85,
    motif: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }} aria-hidden="true">
        <div style={{ height: 14, borderRadius: 999, background: "#FFFFFF" }} />
        <div style={{ height: 14, borderRadius: 999, background: "#FFFFFF", width: "82%" }} />
        <div style={{ height: 14, borderRadius: 999, background: "#FFFFFF", width: "64%" }} />
        <div style={{ height: 14, borderRadius: 999, background: "var(--second)", width: "46%" }} />
      </div>
    ),
  },
  nails: {
    bg: "var(--accent)", fg: "var(--on-accent)", link: "var(--on-accent)", chipBorder: "var(--on-accent)", blurbOpacity: 1,
    motif: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 10 }} aria-hidden="true">
        <span style={{ aspectRatio: "1", borderRadius: 999, background: "var(--on-accent)" }} />
        <span style={{ aspectRatio: "1", borderRadius: 999, background: "#F7F6F1" }} />
        <span style={{ aspectRatio: "1", borderRadius: 999, background: "var(--second)" }} />
        <span style={{ aspectRatio: "1", borderRadius: 999, background: "var(--deep)" }} />
        <span style={{ aspectRatio: "1", borderRadius: 999, border: "2px solid var(--on-accent)" }} />
      </div>
    ),
  },
};

const FALLBACK: Theme = {
  bg: "var(--solid)", fg: "var(--on-solid)", link: "var(--accent)", chipBorder: "var(--on-solid)", blurbOpacity: 0.82, motif: <div />,
};

export function CollectionCard({ collection }: { collection: Collection }) {
  const t = THEMES[collection.id] ?? FALLBACK;
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="vs-card"
      style={{
        minHeight: 440, borderRadius: 32, background: t.bg, color: t.fg, padding: 28, display: "flex",
        flexDirection: "column", justifyContent: "space-between", textDecoration: "none", position: "relative", overflow: "hidden",
      }}
    >
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
        <span>{collection.number} /</span>
        <span style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${t.chipBorder}` }}>{collection.designs} designs</span>
      </div>
      {t.motif}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>{collection.name}</span>
        <span style={{ fontSize: 16, lineHeight: 1.45, opacity: t.blurbOpacity }}>{collection.blurb}</span>
        <span style={{ marginTop: 8, fontWeight: 700, color: t.link }}>View collection →</span>
      </div>
    </Link>
  );
}
