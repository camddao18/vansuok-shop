"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type ReactNode } from "react";

interface Props {
  background: string;
  children: ReactNode;
  /** Nhãn nổi ở góc, đứng yên khi ảnh phóng to. */
  badge?: ReactNode;
  /** Có href thì khung là một liên kết (thẻ sản phẩm). */
  href?: string;
  label?: string;
  radius?: number;
  /** Mức phóng to khi rê chuột. */
  scale?: number;
  /** false: phóng to đều quanh tâm khi rê chuột, không bám theo vị trí con trỏ. */
  follow?: boolean;
}

/**
 * Khung ảnh sản phẩm: rê chuột vào thì ảnh phóng to theo đúng vùng đang rê (kiểu kính lúp),
 * rời chuột thì thu về. Chỉ áp dụng với con trỏ chuột; cảm ứng giữ nguyên ảnh.
 */
export function ZoomFrame({ background, children, badge, href, label, radius = 32, scale = 2, follow = true }: Props) {
  const inner = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !inner.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    inner.current.style.setProperty("--ox", `${((e.clientX - r.left) / r.width) * 100}%`);
    inner.current.style.setProperty("--oy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const style: CSSProperties = {
    borderRadius: radius, background, aspectRatio: "1 / 1", position: "relative", overflow: "hidden", display: "block", textDecoration: "none",
    ["--zs" as string]: scale,
  };
  const content = (
    <>
      {badge}
      <div ref={inner} className="vs-zoomframe-in" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </>
  );

  return href ? (
    <Link href={href} aria-label={label} className="vs-zoomframe" onPointerMove={follow ? onMove : undefined} style={style}>{content}</Link>
  ) : (
    <div className="vs-zoomframe" onPointerMove={follow ? onMove : undefined} style={style}>{content}</div>
  );
}
