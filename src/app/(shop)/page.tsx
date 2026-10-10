import Link from "next/link";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { PROMISES } from "@/data/site";
import { getProducts } from "@/lib/products";
import { CollectionCard } from "@/components/shop/CollectionCard";
import { FreshTees } from "@/components/shop/FreshTees";
import { SuggestForm } from "@/components/shop/SuggestForm";
import { TEE_PATH } from "@/components/shop/TeeArt";

const wrap = { maxWidth: 1360, margin: "0 auto" } as const;
const chip = { alignSelf: "flex-start", fontSize: 12, padding: "5px 10px", borderRadius: 999 } as const;


const marquee = (k: string) => [
  <span key={`${k}a`}>TRADING TEES</span>, <span key={`${k}b`} style={{ color: "var(--accent)" }}>✦</span>,
  <span key={`${k}c`}>NAVY TEES</span>, <span key={`${k}d`} style={{ color: "var(--pop)" }}>✦</span>,
  <span key={`${k}e`}>NAILS TEES</span>, <span key={`${k}f`} style={{ color: "var(--second)" }}>✦</span>,
  <span key={`${k}g`} style={{ fontWeight: 400, fontStyle: "italic" }}>stickers &amp; keychains soon</span>,
  <span key={`${k}h`} style={{ color: "var(--accent)" }}>✦</span>,
];

export default async function Home() {
  const tees = await getProducts({ category: "tshirt" });

  return (
    <>
      {/* HERO */}
      <section id="top" style={{ ...wrap, padding: "32px 24px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(520px, 100%), 1fr))", gap: 40, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span className="mono" style={{ alignSelf: "flex-start", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 14px", border: "1.5px solid var(--text)", borderRadius: 999 }}>
            Profession tees · Stickers &amp; keychains soon
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(56px, 8.4vw, 124px)", lineHeight: 0.92, letterSpacing: "-0.045em", fontWeight: 800, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18 }}>
              T-shirts
              <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "1.5em", height: "0.82em", borderRadius: 999, background: "var(--second)" }}>
                <svg viewBox="0 0 200 220" style={{ height: "70%" }} aria-hidden="true"><path d={TEE_PATH} style={{ fill: "var(--on-second)" }} /></svg>
              </span>
            </span>
            <span>for every</span>
            <span style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 18 }}>
              trade<span style={{ color: "var(--accent)" }}>.</span>
              <span style={{ fontSize: "0.22em", fontWeight: 500, letterSpacing: 0, lineHeight: 1.3, maxWidth: 280, color: "var(--muted)" }}>
                Profession-themed tees for traders, sailors, nail artists &amp; more. Stickers and keychains are next.
              </span>
            </span>
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
            <Link href="/#collections" style={{ display: "inline-flex", alignItems: "center", gap: 12, minHeight: 56, padding: "0 10px 0 26px", borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)", textDecoration: "none", fontWeight: 700, fontSize: 17 }}>
              Shop tees by trade
              <span style={{ width: 40, height: 40, borderRadius: 999, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ stroke: "var(--on-accent)" }} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M9 7h8v8" /></svg>
              </span>
            </Link>
            <Link href="/#shop" style={{ fontWeight: 700, fontSize: 16, padding: "14px 6px", textUnderlineOffset: 6 }}>See new drops</Link>
          </div>
        </div>

        {/* hero bento */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gridAutoRows: 220, gap: 14 }}>
          <div style={{ gridRow: "span 2", borderRadius: 32, background: "var(--solid)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="mono" style={{ position: "absolute", top: 20, left: 20, fontSize: 12, color: "#111111", background: "var(--pop)", padding: "6px 12px", borderRadius: 999 }}>01 / TRADING</span>
            <svg viewBox="0 0 200 220" style={{ width: "78%" }} role="img" aria-label="Dark tee printed with chart candles">
              <path d={TEE_PATH} style={{ fill: "var(--tee-on-solid)" }} />
              <line x1="82" y1="88" x2="82" y2="126" stroke="#FF5B5B" strokeWidth="2" /><rect x="77" y="96" width="10" height="22" fill="#FF5B5B" />
              <line x1="100" y1="78" x2="100" y2="120" style={{ stroke: "var(--pop)" }} strokeWidth="2" /><rect x="95" y="84" width="10" height="28" style={{ fill: "var(--pop)" }} />
              <line x1="118" y1="66" x2="118" y2="106" style={{ stroke: "var(--pop)" }} strokeWidth="2" /><rect x="113" y="72" width="10" height="26" style={{ fill: "var(--pop)" }} />
              <text x="100" y="150" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" style={{ fill: "var(--pop)" }}>HODL THE LINE</text>
            </svg>
            <span style={{ position: "absolute", bottom: 20, left: 20, right: 20, display: "flex", justifyContent: "space-between", color: "var(--on-solid)", fontSize: 14 }}>
              <span>Trading Tee</span><span>{tees[0] ? `from ${new Intl.NumberFormat("vi-VN").format(Math.min(...tees.map((t) => t.price)))}₫` : ""}</span>
            </span>
          </div>
          <div style={{ borderRadius: 32, background: "var(--second)", color: "var(--on-second)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
            <span className="mono" style={{ fontSize: 12, letterSpacing: "0.08em" }}>02 / NAVY</span>
            <span style={{ fontSize: 30, lineHeight: 1, fontWeight: 800, letterSpacing: "-0.03em" }}>Sailor stripes,<br />zero cringe.</span>
            <svg viewBox="0 0 120 40" style={{ position: "absolute", right: -10, top: 18, width: 120 }} aria-hidden="true"><path d="M0 10 Q15 0 30 10 T60 10 T90 10 T120 10 M0 24 Q15 14 30 24 T60 24 T90 24 T120 24" style={{ stroke: "var(--on-second)" }} strokeWidth="3" fill="none" opacity="0.5" /></svg>
          </div>
          <div style={{ borderRadius: 32, background: "var(--accent)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="vs-spin" style={{ width: 168, height: 168 }}>
              <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }} role="img" aria-label="Badge: tees, stickers, keychains and more merch">
                <defs><path id="vs-circle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" /></defs>
                <text fontFamily="JetBrains Mono, monospace" fontSize="15" fontWeight="700" letterSpacing="3" style={{ fill: "var(--on-accent)" }}><textPath href="#vs-circle">TEES ✦ STICKERS ✦ KEYCHAINS ✦ MORE MERCH ✦</textPath></text>
                <circle cx="100" cy="100" r="34" style={{ fill: "var(--on-accent)" }} />
                <path d="M100 82 L104 96 L118 100 L104 104 L100 118 L96 104 L82 100 L96 96 Z" style={{ fill: "var(--accent)" }} />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: "var(--solid)", color: "var(--on-solid)", overflow: "hidden", padding: "18px 0", transform: "rotate(-1.2deg)", margin: "24px -20px 0" }}>
        <div className="vs-track" style={{ display: "flex", gap: 40, width: "max-content", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", whiteSpace: "nowrap", alignItems: "center" }}>
          {marquee("a")}
          {marquee("b")}
        </div>
      </div>

      {/* COLLECTIONS */}
      <section id="collections" style={{ ...wrap, padding: "120px 24px 40px", display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <h2 style={{ margin: 0, fontSize: "clamp(40px, 5.4vw, 76px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>
            One trade,<br /><span style={{ fontWeight: 400, fontStyle: "italic" }}>one collection.</span>
          </h2>
          <p style={{ margin: 0, maxWidth: 400, fontSize: 17, lineHeight: 1.5, color: "var(--muted)" }}>
            Each collection is built around one profession — its tools, its lingo, its insider jokes. It starts with a T-shirt, then grows into stickers, keychains and more.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 16 }}>
          {COLLECTIONS.map((c) => <CollectionCard key={c.id} collection={c} />)}
          <Link href="/#suggest" className="vs-card" style={{ minHeight: 440, borderRadius: 32, border: "2px dashed var(--text)", color: "var(--text)", padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", textDecoration: "none" }}>
            <span className="mono" style={{ fontSize: 13 }}>{String(COLLECTIONS.length + 1).padStart(2, "0")} / coming soon</span>
            <span style={{ width: 72, height: 72, borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 400 }}>+</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>Next trade?</span>
              <span style={{ fontSize: 16, lineHeight: 1.45, color: "var(--muted)" }}>Doctors, baristas, devs… You suggest it, we design it.</span>
            </div>
          </Link>
        </div>
      </section>

      <FreshTees products={tees} collections={COLLECTIONS} />

      {/* MERCH RANGE */}
      <section id="merch" style={{ ...wrap, padding: "0 24px 80px", display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <h2 style={{ margin: 0, fontSize: "clamp(36px, 4.4vw, 60px)", lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 800 }}>More than a tee<span style={{ color: "var(--accent)" }}>.</span></h2>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 17, lineHeight: 1.5, color: "var(--muted)" }}>The same trade designs, on the things you carry every day.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
          {CATEGORIES.map((c) =>
            c.available ? (
              <Link key={c.id} href="/shop" className="vs-card" style={{ minHeight: 260, borderRadius: 28, background: "var(--solid)", color: "var(--on-solid)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", textDecoration: "none" }}>
                <span className="mono" style={{ ...chip, background: "var(--pop)", color: "#111111" }}>AVAILABLE NOW</span>
                <svg viewBox="0 0 200 220" style={{ width: 84 }} aria-hidden="true"><path d={TEE_PATH} fill="none" style={{ stroke: "var(--on-solid)" }} strokeWidth="10" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>{c.label}</span>
              </Link>
            ) : (
              <div key={c.id} style={{ minHeight: 260, borderRadius: 28, background: "var(--surface)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span className="mono" style={{ ...chip, border: "1px solid var(--text)" }}>COMING SOON</span>
                {c.id === "sticker" ? (
                  <svg viewBox="0 0 100 100" style={{ width: 84 }} aria-hidden="true"><path d="M14 14 H86 V62 L62 86 H14 Z" fill="none" style={{ stroke: "var(--text)" }} strokeWidth="6" strokeLinejoin="round" /><path d="M86 62 H62 V86" fill="none" style={{ stroke: "var(--text)" }} strokeWidth="6" strokeLinejoin="round" /></svg>
                ) : (
                  <svg viewBox="0 0 100 100" style={{ width: 84 }} aria-hidden="true"><circle cx="30" cy="30" r="16" fill="none" style={{ stroke: "var(--text)" }} strokeWidth="6" /><rect x="40" y="40" width="44" height="44" rx="12" fill="none" style={{ stroke: "var(--text)" }} strokeWidth="6" /></svg>
                )}
                <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>{c.label}</span>
              </div>
            ),
          )}
          <div style={{ minHeight: 260, borderRadius: 28, border: "2px dashed var(--text)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="mono" style={{ alignSelf: "flex-start", fontSize: 12 }}>LATER</span>
            <span style={{ width: 64, height: 64, borderRadius: 999, background: "var(--accent)", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>+</span>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>&amp; more merch</span>
          </div>
        </div>
      </section>

      {/* PROMISE STRIP */}
      <section id="about" style={{ ...wrap, padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 16 }}>
          {PROMISES.map((p) => (
            <div key={p.key} style={{ background: "var(--surface)", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{p.key}</span>
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>{p.title}</span>
              <span style={{ fontSize: 15, lineHeight: 1.5, color: "var(--muted)" }}>{p.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SUGGEST A TRADE */}
      <section id="suggest" style={{ ...wrap, padding: "0 24px 80px" }}>
        <div style={{ background: "var(--second)", color: "var(--on-second)", borderRadius: 40, padding: "clamp(32px, 5vw, 72px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 40, alignItems: "end", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <span className="mono" style={{ alignSelf: "flex-start", fontSize: 13, padding: "6px 12px", borderRadius: 999, background: "var(--on-second)", color: "var(--second)" }}>NEXT COLLECTION</span>
            <h2 style={{ margin: 0, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>Your trade<br />doesn’t have a tee yet?</h2>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, maxWidth: 440, opacity: 0.9 }}>Tell us what you do and your favorite insider joke. The next collection could be yours.</p>
          </div>
          <SuggestForm />
        </div>
      </section>
    </>
  );
}
