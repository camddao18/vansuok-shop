import Link from "next/link";
import { COLLECTIONS } from "@/data/catalog";
import { SOCIALS, STUDIO } from "@/data/site";

const head = { fontSize: 13, opacity: 0.65 } as const;
const col = { display: "flex", flexDirection: "column", gap: 10 } as const;
const link = { textDecoration: "none" } as const;

export function Footer() {
  return (
    <footer style={{ background: "var(--solid)", color: "var(--on-solid)", borderRadius: "40px 40px 0 0", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 32 }}>
          <div style={col}>
            <span className="mono" style={head}>COLLECTIONS</span>
            {COLLECTIONS.map((c) => (
              <Link key={c.id} href={`/collections/${c.id}`} style={link}>{c.name}</Link>
            ))}
          </div>
          <div style={col}>
            <span className="mono" style={head}>HELP</span>
            {/* TODO(owner): dedicated pages for size guide / shipping & returns */}
            <Link href="/#about" style={link}>Size guide</Link>
            <Link href="/#about" style={link}>Shipping &amp; returns</Link>
            <Link href="/#about" style={link}>Contact</Link>
          </div>
          <div style={col}>
            <span className="mono" style={head}>FOLLOW</span>
            {SOCIALS.map((s) => (
              <span key={s.name}>{s.name} {s.handle}</span>
            ))}
          </div>
          <div style={col}>
            <span className="mono" style={head}>STUDIO</span>
            <span>{STUDIO.address}</span>
            <span>{STUDIO.contact}</span>
          </div>
        </div>
        <div style={{ fontSize: "clamp(64px, 17vw, 260px)", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.8, display: "flex", alignItems: "baseline", gap: "0.04em" }}>
          VANSUOK<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, fontSize: 14, opacity: 0.65 }}>
          <span>© Vansuok Studio</span>
          <span>T-shirts &amp; merch for every trade.</span>
        </div>
      </div>
    </footer>
  );
}
