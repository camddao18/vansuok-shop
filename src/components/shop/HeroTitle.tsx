"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** How far (in font-size units) the cursor still affects a letter. */
const REACH = 2.4;

interface Props {
  /** One string per line, e.g. ["Áo thun", "cho mọi", "nghề"]. */
  lines: string[];
  /** Coloured full stop after the last line. */
  dot?: boolean;
  /** Extra content placed after the last line (the short description). */
  aside?: ReactNode;
  style?: CSSProperties;
}

/**
 * Big hero headline, letter by letter:
 *  - letters rise in one after another on load,
 *  - letters near the cursor lift, tilt and turn blue (a soft "magnet" wave),
 *  - a click / tap sends a hop ripple outwards from the pointer,
 *  - the full stop bobs on its own.
 * All motion is off for users who prefer reduced motion; the text stays plain, selectable text.
 */
export function HeroTitle({ lines, dot = true, aside, style }: Props) {
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let letters: { node: HTMLElement; x: number; y: number }[] = [];
    let size = 100;
    let raf = 0;
    let pointer: { x: number; y: number } | null = null;

    const measure = () => {
      size = parseFloat(getComputedStyle(el).fontSize) || 100;
      letters = Array.from(el.querySelectorAll<HTMLElement>("[data-l]")).map((node) => {
        const r = node.getBoundingClientRect();
        return { node, x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    const paint = () => {
      raf = 0;
      const reach = size * REACH;
      for (const l of letters) {
        let p = 0;
        if (pointer) {
          const d = Math.hypot(l.x - pointer.x, l.y - pointer.y);
          p = Math.max(0, 1 - d / reach);
          p = p * p * (3 - 2 * p); // smoothstep
        }
        l.node.style.setProperty("--p", p.toFixed(3));
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const onEnter = (e: PointerEvent) => {
      measure();
      onMove(e);
    };
    const onLeave = () => {
      pointer = null;
      schedule();
    };
    const onDown = (e: PointerEvent) => {
      measure();
      for (const l of letters) {
        const d = Math.hypot(l.x - e.clientX, l.y - e.clientY);
        l.node.animate(
          [
            { transform: "translateY(0) rotate(0deg) scale(1)" },
            { transform: "translateY(-0.22em) rotate(-7deg) scale(1.1)", offset: 0.4 },
            { transform: "translateY(0) rotate(0deg) scale(1)" },
          ],
          { duration: 650, delay: Math.min(d / size, 6) * 90, easing: "cubic-bezier(.3,1.6,.5,1)" },
        );
      }
    };

    // Positions go stale when the page scrolls or resizes, so re-measure lazily.
    const stale = () => { if (pointer) measure(); };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", stale, { passive: true });
    window.addEventListener("resize", stale);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", stale);
      window.removeEventListener("resize", stale);
      cancelAnimationFrame(raf);
    };
  }, []);

  let n = 0; // running letter index, drives the stagger and the alternating tilt
  const letter = (ch: string, extra?: CSSProperties, cls = "") => {
    const i = n++;
    return (
      <span key={i} className={`hl-in ${cls}`} aria-hidden="true" style={{ ["--i" as string]: i, ...extra }}>
        <span data-l className="hl" style={{ ["--r" as string]: i % 2 ? "-6deg" : "6deg" }}>{ch}</span>
      </span>
    );
  };

  const text = lines.join(" ");
  return (
    <h1 ref={root} style={style}>
      <span className="vs-sr">{dot ? `${text}.` : text}</span>
      {lines.map((line, li) => {
        const last = li === lines.length - 1;
        return (
          <span key={li} style={last && (dot || aside) ? { display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 18 } : undefined}>
            <span aria-hidden="true">
              {line.split(" ").map((word, wi, words) => (
                <span key={wi}>
                  <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                    {Array.from(word.normalize("NFC")).map((ch) => letter(ch))}
                  </span>
                  {wi < words.length - 1 && " "}
                </span>
              ))}
              {last && dot && letter(".", { color: "var(--second)" }, "hl-dot")}
            </span>
            {last && aside}
          </span>
        );
      })}
    </h1>
  );
}
