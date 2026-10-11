import Link from "next/link";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { PROMISES } from "@/data/site";
import { getProducts } from "@/lib/products";
import { CollectionCard } from "@/components/shop/CollectionCard";
import { HeroTitle } from "@/components/shop/HeroTitle";
import { FlipCard } from "@/components/shop/FlipCard";
import { RollTitle } from "@/components/shop/RollTitle";
import { FreshTees } from "@/components/shop/FreshTees";
import { SuggestForm } from "@/components/shop/SuggestForm";

const wrap = { maxWidth: 1360, margin: "0 auto" } as const;
const chip = { alignSelf: "flex-start", fontSize: 12, padding: "5px 10px", borderRadius: 999 } as const;


const marquee = (k: string) => [
  <span key={`${k}a`}>TRADING T-SHIRT</span>, <span key={`${k}b`} style={{ color: "var(--accent)" }}>✦</span>,
  <span key={`${k}c`}>NAVY T-SHIRT</span>, <span key={`${k}d`} style={{ color: "var(--pop)" }}>✦</span>,
  <span key={`${k}e`}>NAILS ARTIST T-SHIRT</span>, <span key={`${k}f`} style={{ color: "var(--second)" }}>✦</span>,
  <span key={`${k}g`} style={{ fontWeight: 400, fontStyle: "italic" }}>Stickers &amp; Keychains coming soon</span>,
  <span key={`${k}h`} style={{ color: "var(--accent)" }}>✦</span>,
];

export default async function Home() {
  const tees = await getProducts({ category: "tshirt" });

  return (
    <>
      {/* HERO */}
      <section id="top" style={{ ...wrap, padding: "32px 24px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(520px, 100%), 1fr))", gap: 40, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span className="vs-hide-sm" style={{ alignSelf: "flex-start", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 14px", border: "1.5px solid var(--text)", borderRadius: 999 }}>
            Tees for every trade · stickers &amp; keychains soon
          </span>
          <HeroTitle
            lines={["Áo thun", "cho mọi", "nghề"]}
            style={{ margin: 0, fontSize: "clamp(72px, 7vw, 104px)", lineHeight: 0.92, letterSpacing: "-0.045em", fontWeight: 800, display: "flex", flexDirection: "column", gap: 6 }}
            aside={
              <span className="vs-hero-desc" style={{ fontSize: "clamp(13px, 1.1vw, 15px)", fontWeight: 500, letterSpacing: 0, lineHeight: 1.3, maxWidth: 260, color: "var(--muted)" }}>
                Làm nghề thì khổ, nhưng mặc áo nghề thì vui. Sticker và móc khóa sắp ra mắt. Áo thun trước, sticker và móc khóa sắp ra mắt.
              </span>
            }
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
            <Link href="/shop" className="vs-cta" style={{ display: "inline-flex", alignItems: "center", gap: 12, minHeight: 56, padding: "0 10px 0 26px", borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)", textDecoration: "none", fontWeight: 700, fontSize: 17 }}>
              Shop now
              <span className="vs-cta-dot" style={{ width: 40, height: 40, borderRadius: 999, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ stroke: "var(--on-accent)" }} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M9 7h8v8" /></svg>
              </span>
            </Link>
            <Link href="/#shop" className="vs-cta-link" style={{ fontWeight: 700, fontSize: 16, padding: "14px 6px", textUnderlineOffset: 6 }}>Xem hàng mới về</Link>
          </div>
        </div>

        {/* hero bento */}
        <div className="vs-hero-bento" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gridAutoRows: 220, gap: 14 }}>
          <FlipCard
            label="Lật thẻ: người qua đường nói gì"
            startFlipped
            style={{ gridRow: "span 2", borderRadius: 32 }}
            front={
              <div style={{ height: "100%", boxSizing: "border-box", background: "var(--solid)", color: "var(--on-solid)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--pop)" }}>NGƯỜI QUA ĐƯỜNG</span>
                <span style={{ fontSize: "clamp(34px, 3.4vw, 48px)", lineHeight: 1, fontWeight: 800, letterSpacing: "-0.03em" }}>“Áo gì<br />kỳ vậy?”</span>
              </div>
            }
            back={
              <img src="/hero-trading.webp" alt="Áo thun Trading in chữ “Nobody calls me. Margin does.”" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
            }
          />
          <FlipCard
            label="Lật thẻ: dân nghề nói gì"
            startFlipped
            style={{ borderRadius: 32 }}
            front={
              <div style={{ height: "100%", boxSizing: "border-box", background: "var(--second)", color: "var(--on-second)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span className="mono" style={{ fontSize: 12, letterSpacing: "0.08em" }}>DÂN NGHỀ</span>
                <span style={{ fontSize: 30, lineHeight: 1, fontWeight: 800, letterSpacing: "-0.03em" }}>“Trời, đúng<br />tui luôn.”</span>
              </div>
            }
            back={
              <img src="/hero-navy.webp" alt="Áo thun in biểu đồ và chữ “I don’t need a rollercoaster. My account does that for free”" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
            }
          />
          <div style={{ borderRadius: 32, background: "var(--accent)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="vs-spin" style={{ width: 168, height: 168 }}>
              <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }} role="img" aria-label="Huy hiệu: áo thun, sticker, móc khóa và nhiều phụ kiện khác">
                <defs><path id="vs-circle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" /></defs>
                <text fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="700" style={{ fill: "var(--on-accent)" }}><textPath href="#vs-circle" textLength="460" lengthAdjust="spacing">{"T-SHIRT ✦ STICKER ✦ KEYCHAIN ✦ ACCESSORIES ✦ "}</textPath></text>
                <circle cx="100" cy="100" r="34" style={{ fill: "var(--on-accent)" }} />
                <path d="M100 82 L104 96 L118 100 L104 104 L100 118 L96 104 L82 100 L96 96 Z" style={{ fill: "var(--accent)" }} />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: "var(--solid)", color: "var(--on-solid)", overflow: "hidden", padding: "14px 0", transform: "rotate(-1.2deg)", margin: "24px -20px 0" }}>
        <div className="vs-track" style={{ display: "flex", width: "max-content", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", whiteSpace: "nowrap", alignItems: "center" }}>
          {/* 8 identical groups, each with its own trailing padding, so the loop (-50% = 4 groups) has no seam or gap */}
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} aria-hidden={i > 0} style={{ display: "flex", flex: "none", gap: 32, paddingRight: 32, alignItems: "center" }}>
              {marquee(String(i))}
            </div>
          ))}
        </div>
      </div>

      {/* COLLECTIONS */}
      <section id="collections" style={{ ...wrap, padding: "120px 24px 40px", display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <RollTitle
            lines={[{ text: "Mỗi nghề," }, { text: "một chất.", italic: true }]}
            style={{ margin: 0, fontSize: "clamp(56px, 5.4vw, 76px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}
          />
          <p style={{ margin: 0, maxWidth: 640, fontSize: 15, lineHeight: 1.5, color: "var(--muted)" }}>
            Không phải ai cũng hiểu, và vì vậy mới vui.<br />Customize cho dân trong nghề, từ áo thun đến sticker, móc khóa.
          </p>
        </div>
        <div className="vs-cgrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 16 }}>
          {COLLECTIONS.map((c) => <CollectionCard key={c.id} collection={c} />)}
          <Link href="/#suggest" className="vs-card vs-ccard" style={{ minHeight: 440, borderRadius: 32, border: "2px dashed var(--text)", color: "var(--text)", padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", textDecoration: "none" }}>
            <span className="mono" style={{ fontSize: 13 }}>{String(COLLECTIONS.length + 1).padStart(2, "0")} / sắp ra mắt</span>
            <span className="vs-plus" style={{ width: 72, height: 72, borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 400 }}>+</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="vs-ctitle" style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>Nghề tiếp theo?</span>
              <span className="vs-cblurb" style={{ fontSize: 16, lineHeight: 1.45, color: "var(--muted)" }}>Bác sĩ, barista, dev… Bạn gợi ý, chúng tôi thiết kế.</span>
            </div>
          </Link>
        </div>
      </section>

      <FreshTees products={tees} collections={COLLECTIONS} />

      {/* PROMISE STRIP */}
      <section id="about" style={{ ...wrap, padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 16 }}>
          {PROMISES.map((p) => (
            <div key={p.key} className="vs-promise" style={{ background: "var(--surface)", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{p.key}</span>
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>{p.title}</span>
              <span style={{ fontSize: 15, lineHeight: 1.5, color: "var(--muted)" }}>{p.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MERCH RANGE */}
      <section id="merch" style={{ ...wrap, padding: "0 24px 80px", display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <h2 style={{ margin: 0, fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 800 }}>Hơn cả một chiếc áo<span style={{ color: "var(--second)" }}>.</span></h2>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 15, lineHeight: 1.5, color: "var(--muted)" }}>Những thiết kế theo nghề ấy, trên những món đồ bạn mang theo mỗi ngày.</p>
        </div>
        <div className="vs-mgrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
          {CATEGORIES.map((c) =>
            c.available ? (
              <Link key={c.id} href="/shop" className="vs-card" style={{ minHeight: 260, borderRadius: 28, background: "var(--solid)", color: "var(--on-solid)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", textDecoration: "none" }}>
                <span className="mono" style={{ ...chip, background: "var(--pop)", color: "#111111" }}>CÓ HÀNG NGAY</span>
                <img src="/icons/ao-thun.svg" alt="" width={96} height={96} style={{ width: 96, height: 96 }} />
                <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>{c.label}</span>
              </Link>
            ) : (
              <div key={c.id} style={{ minHeight: 260, borderRadius: 28, background: "var(--surface)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span className="mono" style={{ ...chip, border: "1px solid var(--text)" }}>SẮP RA MẮT</span>
                {c.id === "sticker" ? (
                  <img src="/icons/sticker.svg" alt="" width={96} height={96} style={{ width: 96, height: 96 }} />
                ) : (
                  <img src="/icons/moc-khoa.svg" alt="" width={96} height={96} style={{ width: 96, height: 96 }} />
                )}
                <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>{c.label}</span>
              </div>
            ),
          )}
          <div style={{ minHeight: 260, borderRadius: 28, border: "2px dashed var(--text)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="mono" style={{ alignSelf: "flex-start", fontSize: 12 }}>SAU NÀY</span>
            <span className="vs-mplus" style={{ width: 64, height: 64, borderRadius: 999, background: "var(--accent)", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>+</span>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>&amp; nhiều phụ kiện khác</span>
          </div>
        </div>
      </section>

      {/* SUGGEST A TRADE */}
      <section id="suggest" style={{ ...wrap, padding: "0 24px 80px" }}>
        <div style={{ background: "var(--second)", color: "#FFFFFF", borderRadius: 40, padding: "clamp(32px, 5vw, 72px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 40, alignItems: "end", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <span className="mono" style={{ alignSelf: "flex-start", fontSize: 13, padding: "6px 12px", borderRadius: 999, background: "#FFFFFF", color: "var(--second)" }}>BỘ SƯU TẬP TIẾP THEO</span>
            <h2 style={{ margin: 0, fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.15, letterSpacing: "-0.035em", fontWeight: 800 }}>Nghề của bạn<br />chưa có áo thun?</h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, maxWidth: 440, opacity: 0.9 }}>Hãy cho chúng tôi biết bạn làm nghề gì và câu đùa nội bộ yêu thích. Bộ sưu tập tiếp theo có thể là của bạn.</p>
          </div>
          <SuggestForm />
        </div>
      </section>
    </>
  );
}
