"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Thanh bên của cổng quản trị. Từ 820px trở lên là thanh bên cố định; trên điện thoại chỉ còn dòng logo
 * + nút hamburger, bấm vào mới xổ menu (đóng khi chọn trang khác hoặc nhấn Esc).
 */
export function AdminSidebar({ brand, children }: { brand: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <aside className="ad-side" data-open={open}>
      <div className="ad-top">
        {brand}
        <button type="button" className="ad-burger" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      <div id={panelId} className="ad-panel">{children}</div>
    </aside>
  );
}
