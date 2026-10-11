"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";

const face: CSSProperties = {
  position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden",
  backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
};

/**
 * Card that flips between a front and a back face.
 *  - Mouse: hovering flips it to the other face, moving away flips it back.
 *  - Touch / pen: tap to flip, tap again to flip back.
 *  - Keyboard: Enter / Space toggles.
 * `style` goes on the outer element, so grid placement and border radius are set by the caller.
 */
export function FlipCard({
  front, back, style, label, startFlipped = false,
}: {
  front: ReactNode;
  back: ReactNode;
  style?: CSSProperties;
  label: string;
  /** Rest on the back face; hovering then shows the front. */
  startFlipped?: boolean;
}) {
  const [flipped, setFlipped] = useState(startFlipped);
  const pointerType = useRef("");

  const toggle = () => setFlipped((f) => !f);

  return (
    <div
      role="button" tabIndex={0} aria-pressed={flipped !== startFlipped} aria-label={label}
      onPointerDown={(e) => { pointerType.current = e.pointerType; }}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setFlipped(!startFlipped); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setFlipped(startFlipped); }}
      // With a mouse the hover already did the flip, so a click must not undo it.
      onClick={() => { if (pointerType.current !== "mouse") toggle(); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
      style={{ perspective: 1200, cursor: "pointer", position: "relative", ...style }}
    >
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit", transformStyle: "preserve-3d",
          transition: "transform .7s cubic-bezier(.4,.2,.2,1)", transform: flipped ? "rotateY(180deg)" : "none",
        }}
      >
        <div style={face}>{front}</div>
        <div style={{ ...face, transform: "rotateY(180deg)" }}>{back}</div>
      </div>
    </div>
  );
}
