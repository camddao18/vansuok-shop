import Link from "next/link";
import type { Collection } from "@/lib/types";

interface Theme {
  bg: string;
  fg: string;
  link: string; // màu chữ "Xem bộ sưu tập"
  chipBorder: string;
  blurbOpacity: number;
  motif: React.ReactNode;
}

const Motif = ({ name }: { name: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={`/icons/${name}.svg`} alt="" width={120} height={120} style={{ width: 120, height: 120 }} aria-hidden="true" />
);

/** Per-trade look. A new collection without an entry falls back to the black card, no motif. */
const THEMES: Record<string, Theme> = {
  trading: {
    bg: "var(--solid)", fg: "var(--on-solid)", link: "var(--pop)", chipBorder: "var(--on-solid)", blurbOpacity: 0.82,
    motif: <Motif name="trading" />,
  },
  navy: {
    bg: "var(--deep)", fg: "#FFFFFF", link: "#FFFFFF", chipBorder: "#FFFFFF", blurbOpacity: 0.85,
    motif: <Motif name="navy" />,
  },
  nails: {
    bg: "var(--accent)", fg: "var(--on-accent)", link: "var(--on-accent)", chipBorder: "var(--on-accent)", blurbOpacity: 1,
    motif: <Motif name="nails" />,
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
      className="vs-card vs-ccard"
      style={{
        minHeight: 440, borderRadius: 32, background: t.bg, color: t.fg, padding: 28, display: "flex",
        flexDirection: "column", justifyContent: "space-between", textDecoration: "none", position: "relative", overflow: "hidden",
      }}
    >
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
        <span>{collection.number} /</span>
        <span style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${t.chipBorder}` }}>{collection.designs} mẫu</span>
      </div>
      <div className="vs-motif" style={{ display: "flex" }}>{t.motif}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="vs-ctitle" style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>{collection.name}</span>
        <span className="vs-cblurb" style={{ fontSize: 16, lineHeight: 1.45, opacity: t.blurbOpacity }}>{collection.blurb}</span>
        <span className="vs-clink" style={{ marginTop: 8, fontWeight: 700, color: t.link }}>
          <span className="vs-clink-long">Xem bộ sưu tập</span><span className="vs-clink-short">Collection</span> <span className="vs-arrow">→</span>
        </span>
      </div>
    </Link>
  );
}
