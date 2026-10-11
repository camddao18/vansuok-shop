"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export interface FilterItem {
  name: string;
  /** Có href thì mục là liên kết; không thì gọi onSelect (lọc ngay trên trang). */
  href?: string;
  onSelect?: () => void;
  active: boolean;
}

/** Nút bấm xổ danh sách lọc. Mục đang chọn hiện ngay trên nút; bấm ra ngoài hoặc nhấn Esc để đóng. */
export function FilterDropdown({ label, items }: { label: string; items: FilterItem[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const current = items.find((i) => i.active) ?? items[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} style={{ position: "relative" }}>
      <button
        type="button"
        className="vs-tab"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        style={{ gap: 8, minHeight: 52, padding: "0 18px 0 20px" }}
      >
        <span style={{ color: "var(--muted)", fontWeight: 500 }}>{label}:</span>
        <span style={{ fontWeight: 700 }}>{current.name}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"
          style={{ stroke: "currentColor", transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }}
          strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          id={menuId}
          role="listbox"
          aria-label={label}
          className="vs-menu"
          style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 20, margin: 0, padding: 6, listStyle: "none",
            minWidth: "100%", width: "max-content", maxWidth: "min(320px, 90vw)", background: "var(--surface)", borderRadius: 20,
            border: "1.5px solid var(--text)", boxShadow: "0 12px 32px rgba(17,17,17,.14)",
          }}
        >
          {items.map((i) => (
            <li key={i.name} role="option" aria-selected={i.active}>
              {(() => {
                const content = (
                  <>
                    {i.name}
                    {i.active && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ stroke: "currentColor" }} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    )}
                  </>
                );
                const aria = i.active ? "true" : undefined;
                return i.href ? (
                  <Link href={i.href} onClick={() => setOpen(false)} className="vs-menu-item" aria-current={aria}>{content}</Link>
                ) : (
                  <button type="button" onClick={() => { i.onSelect?.(); setOpen(false); }} className="vs-menu-item" aria-current={aria} style={{ width: "100%", border: 0, background: "transparent", font: "inherit", fontSize: 15, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>{content}</button>
                );
              })()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
