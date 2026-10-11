"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface Line {
  text: string;
  /** Dòng in nghiêng, nét mảnh. Khi rê chuột, từ "lăn" sang kiểu đối lập (đậm, thẳng). */
  italic?: boolean;
}

/**
 * Tiêu đề lớn, tương tác theo TỪ (khác HeroTitle tương tác theo chữ cái):
 *  - khi cuộn tới, từng từ trượt lên từ sau một đường cắt,
 *  - rê chuột / chạm vào từ nào thì từ đó lăn lên, lộ bản đối lập (đậm <-> nghiêng) màu xanh dương.
 * Tắt hết chuyển động nếu người dùng chọn giảm chuyển động; chữ vẫn là chữ thường, chọn được.
 */
export function RollTitle({ lines, style }: { lines: Line[]; style?: CSSProperties }) {
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.classList.add("in"); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let n = 0;
  return (
    <h2 ref={root} className="rt" style={style}>
      <span className="vs-sr">{lines.map((l) => l.text).join(" ")}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" style={{ display: "block" }}>
          {line.text.split(" ").map((word, wi, words) => {
            const i = n++;
            return (
              <span key={wi}>
                <span className="rt-w" style={{ ["--i" as string]: i } as CSSProperties}>
                  <span className="rt-rise">
                    <span className="rt-roll">
                      <span className={line.italic ? "rt-a rt-it" : "rt-a"}>{word}</span>
                      <span className={line.italic ? "rt-b" : "rt-b rt-it"}>{word}</span>
                    </span>
                  </span>
                </span>
                {wi < words.length - 1 && " "}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}
