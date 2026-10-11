"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";

/** Drifting product icons. `d` is the parallax depth in px, `rot` the resting tilt. */
const FLOATERS: { icon: string; left: string; top: string; size: string; d: number; rot: number; delay: number }[] = [
  { icon: "ao-thun", left: "7%", top: "16%", size: "clamp(64px, 10vw, 130px)", d: 34, rot: -12, delay: 0 },
  { icon: "sticker", left: "80%", top: "12%", size: "clamp(56px, 8vw, 110px)", d: 22, rot: 10, delay: 0.6 },
  { icon: "moc-khoa", left: "86%", top: "58%", size: "clamp(56px, 8.5vw, 116px)", d: 40, rot: 14, delay: 1.1 },
  { icon: "trading", left: "5%", top: "62%", size: "clamp(70px, 11vw, 140px)", d: 28, rot: 8, delay: 0.3 },
  { icon: "navy", left: "72%", top: "80%", size: "clamp(60px, 9vw, 120px)", d: 18, rot: -8, delay: 0.9 },
  { icon: "nails", left: "22%", top: "82%", size: "clamp(52px, 7.5vw, 100px)", d: 44, rot: 12, delay: 1.4 },
];

/** These three are drawn in light colours for the dark cards; the intro background is light, so use darker versions. */
const iconSrc = (name: string) => (["ao-thun", "trading", "navy"].includes(name) ? `/icons/light/${name}.svg` : `/icons/${name}.svg`);

/** Quack sounds in public/sounds/. One is picked at random per click; add more files here. */
const QUACKS = ["/sounds/quack.mp3"];

const WORDS = ["QUẠC!", "QUẠC QUẠC!", "FREESHIP?", "CỰC CHẤT", "VANSUOK STUDIO", "GÌ CŨNG CÓ", "HÚ DỊ"];

/**
 * Full-screen interactive opener laid over the home page (only on "/", once per page load).
 * The duck tilts toward the cursor, the icons drift with a little parallax, and any click or tap
 * makes the duck squash and quack in a floating word. The first scroll down (wheel, swipe, arrow
 * key, or the arrow button) slides the opener away and reveals the shop; it is gone after that.
 */
export function Intro() {
  const pathname = usePathname();
  const stage = useRef<HTMLElement>(null);
  const duck = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const active = pathname === "/" && !gone;

  // Deep links such as /#collections go straight to the page.
  useEffect(() => {
    if (window.location.hash) setGone(true);
  }, []);

  const dismiss = useCallback(() => {
    setLeaving(true);
    // transitionend can be skipped (hidden tab, reduced motion), so do not rely on it alone.
    setTimeout(() => setGone(true), 900);
  }, []);

  // While the opener is up the page behind it does not scroll; the first scroll gesture dismisses it.
  useEffect(() => {
    if (!active || leaving) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    let startY = 0;
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) dismiss(); };
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => { if (startY - e.touches[0].clientY > 24) dismiss(); };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End", " "].includes(e.key)) {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, leaving, dismiss]);

  useEffect(() => {
    const el = stage.current;
    if (!active || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let nx = 0, ny = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", nx.toFixed(3));
      el.style.setProperty("--my", ny.toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      nx = 0; ny = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      const r = el.getBoundingClientRect();
      const ox = e.clientX - r.left, oy = e.clientY - r.top;

      duck.current?.animate(
        [
          { transform: "scale(1,1)" },
          { transform: "scale(1.12,.86)", offset: 0.25 },
          { transform: "scale(.94,1.1) translateY(-3%)", offset: 0.55 },
          { transform: "scale(1,1)" },
        ],
        { duration: 520, easing: "ease-out" },
      );

      // A fresh Audio per click so rapid clicks overlap instead of cutting each other off.
      // Autoplay rules are fine here because this runs inside a click/tap. A missing file is ignored.
      try {
        const sound = new Audio(QUACKS[Math.floor(Math.random() * QUACKS.length)]);
        sound.volume = 0.7;
        sound.play().catch(() => {});
      } catch {}

      const word = document.createElement("span");
      word.textContent = WORDS[Math.floor(Math.random() * WORDS.length)];
      word.className = "mono";
      Object.assign(word.style, {
        position: "absolute", left: `${ox}px`, top: `${oy}px`, pointerEvents: "none", zIndex: "5",
        fontWeight: "800", fontSize: "clamp(16px, 2vw, 24px)", letterSpacing: "0.04em", whiteSpace: "nowrap",
      } satisfies Partial<CSSStyleDeclaration>);
      el.appendChild(word);
      word
        .animate(
          [
            { transform: "translate(-50%,-50%) scale(.4) rotate(-6deg)", opacity: 0 },
            { transform: "translate(-50%,-90%) scale(1.1) rotate(4deg)", opacity: 1, offset: 0.25 },
            { transform: "translate(-50%,-190%) scale(1) rotate(-2deg)", opacity: 0 },
          ],
          { duration: 900, easing: "ease-out" },
        )
        .finished.then(() => word.remove(), () => word.remove());
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  if (!active) return null;

  return (
    <section
      ref={stage}
      className="vs-intro"
      aria-label="Chào mừng đến Duck Delivery"
      onTransitionEnd={(e) => { if (e.target === e.currentTarget) setGone(true); }}
      style={{
        position: "fixed", inset: 0, zIndex: 100, overflow: "hidden", background: "#DAFD87", color: "var(--on-accent)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, cursor: "pointer",
        transform: leaving ? "translateY(-100%)" : "none", transition: "transform .8s cubic-bezier(.7,0,.2,1)",
        userSelect: "none", WebkitUserSelect: "none", touchAction: "manipulation",
        ["--mx" as string]: 0, ["--my" as string]: 0,
      } as CSSProperties}
    >
      {FLOATERS.map((f) => (
        <div
          key={f.icon} aria-hidden="true" className="vs-par"
          style={{ left: f.left, top: f.top, width: f.size, ["--d" as string]: f.d, ["--rot" as string]: `${f.rot}deg` } as CSSProperties}
        >
          <img src={iconSrc(f.icon)} alt="" draggable={false} className="vs-bob-icon" style={{ animationDelay: `${f.delay}s` }} />
        </div>
      ))}

      <div className="vs-tilt" style={{ position: "relative", zIndex: 2, width: "min(78vw, 52svh, 520px)" }}>
        <div ref={duck}>
          <img src="/logo.png" alt="Duck Delivery" width={1682} height={1525} draggable={false} style={{ display: "block", width: "100%", height: "auto" }} />
        </div>
      </div>

      <p style={{ margin: 0, zIndex: 2, textAlign: "center", fontWeight: 800, letterSpacing: "-0.03em", fontSize: "clamp(30px, 3vw, 40px)", lineHeight: 1.05 }}>
        Áo thun cho mọi nghề<span style={{ color: "var(--second)" }}>.</span>
      </p>
      <span className="mono" aria-hidden="true" style={{ zIndex: 2, fontSize: 13, textAlign: "center", padding: "0 16px", letterSpacing: "0.12em", opacity: 0.7 }}>
        CHẠM VÀO ĐỂ NGHE TIẾNG EM NÈ HIHI
      </span>

      <button
        type="button" onClick={dismiss} aria-label="Vào cửa hàng"
        style={{
          position: "absolute", bottom: 24, left: "50%", marginLeft: -28, zIndex: 3, width: 56, height: 56, borderRadius: 999,
          border: "2px solid var(--on-accent)", background: "var(--on-accent)", color: "var(--accent)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
        }}
        className="vs-cue"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </button>
    </section>
  );
}
