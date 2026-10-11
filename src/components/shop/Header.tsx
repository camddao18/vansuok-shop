"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "./AccountProvider";
import { useCart } from "./CartProvider";

const NAV = [
  { href: "/collections", label: "Bộ sưu tập", match: (p: string) => p.startsWith("/collections") },
  { href: "/shop", label: "Sản phẩm", match: (p: string) => p.startsWith("/shop") || p.startsWith("/products") },
  { href: "/about", label: "Về Giao Zịt", match: (p: string) => p.startsWith("/about") },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready } = useCart();
  const account = useAccount();

  const [hover, setHover] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Đóng menu di động khi chuyển trang
  useEffect(() => setMenuOpen(false), [pathname]);
  const searchInput = useRef<HTMLInputElement>(null);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!searchOpen) { setSearchOpen(true); searchInput.current?.focus(); return; }
    if (!term) { setSearchOpen(false); return; }
    router.push(`/shop?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  };

  const activeIdx = NAV.findIndex((n) => n.match(pathname));
  const target = hover ?? activeIdx; // -1 = không có mục nào

  // Header dính trên cùng, thu nhỏ + mờ nền khi cuộn
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Huy hiệu giỏ hàng nảy lên mỗi khi số lượng thay đổi
  const prevCount = useRef(count);
  useEffect(() => {
    if (prevCount.current === count) return;
    prevCount.current = count;
    setBump(true);
    const t = setTimeout(() => setBump(false), 350);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "color-mix(in srgb, var(--bg) 85%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none", WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(17,17,17,.08)" : "none", transition: "background .25s, box-shadow .25s",
      }}
    >
      <header
        className="vs-header"
        style={{
          maxWidth: 1360, margin: "0 auto", padding: scrolled ? "10px 24px" : "20px 24px", display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: 16, transition: "padding .25s",
        }}
      >
        <Link href="/" aria-label="Duck Delivery — trang chủ" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <span
            role="img" aria-label="Duck Delivery" className="vs-logo"
            style={{ height: scrolled ? 48 : 64, aspectRatio: "434.78 / 393.51", display: "block", transition: "height .25s, transform .25s, background-color .2s" }}
          />
        </Link>

        <nav
          aria-label="Menu chính"
          className="vs-nav-desk"
          onMouseLeave={() => setHover(null)}
          style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 6, background: "var(--surface)", borderRadius: 999, padding: 6 }}
        >
          {NAV.map((n, idx) => {
            const active = n.match(pathname);
            return (
              <Link
                key={n.label}
                href={n.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHover(idx)}
                onFocus={() => setHover(idx)}
                onBlur={() => setHover(null)}
                style={{
                  position: "relative", padding: "10px 18px", borderRadius: 999, textDecoration: "none", fontSize: 15,
                  fontWeight: active ? 700 : 500, color: hover === idx ? "#F2421B" : "var(--text)", transition: "color .2s",
                }}
              >
                {n.label}
                <span
                  aria-hidden="true"
                  className="vs-underline"
                  style={{ transform: target === idx ? "scaleX(1)" : "scaleX(0)" }}
                />
              </Link>
            );
          })}
        </nav>

        <div className="vs-hactions" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <form
            role="search"
            onSubmit={onSearch}
            className="vs-hbtn vs-search vs-desk-only"
            style={{
              boxSizing: "border-box", height: 46, borderRadius: 999, border: "1.5px solid var(--text)", background: searchOpen ? "var(--surface)" : "transparent",
              display: "flex", alignItems: "center", overflow: "hidden", transition: "background-color .2s",
            }}
          >
            <input
              ref={searchInput}
              type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm…" aria-label="Tìm sản phẩm"
              tabIndex={searchOpen ? 0 : -1}
              onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); (e.target as HTMLElement).blur(); } }}
              style={{
                width: searchOpen ? 200 : 0, padding: searchOpen ? "0 4px 0 16px" : 0, border: "none", outline: "none", background: "transparent",
                font: "inherit", fontSize: 15, color: "var(--text)", transition: "width .3s cubic-bezier(.2,.8,.2,1), padding .3s",
              }}
            />
            <button
              type="submit" aria-label="Tìm kiếm"
              style={{ width: 43, height: 43, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", padding: 0 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ stroke: "var(--text)" }} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
          </form>
          <Link
            href={account ? "/account" : "/login"}
            className="vs-hbtn vs-desk-only"
            style={{
              height: 46, padding: "0 18px", borderRadius: 999, border: "1.5px solid var(--text)", background: "transparent",
              display: "flex", alignItems: "center", fontWeight: 700, fontSize: 15, textDecoration: "none", boxSizing: "border-box",
            }}
          >
            {account ? "Tài khoản" : "Đăng nhập"}
          </Link>
          <Link
            href="/cart"
            className="vs-hbtn vs-hbtn-solid"
            style={{
              height: 46, padding: "0 18px", borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)",
              display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 15, textDecoration: "none",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ stroke: "var(--on-btn)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 8h14l-1.2 12H6.2z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
            <span className="vs-cart-label">Giỏ hàng</span>
            <span
              aria-label={`${ready ? count : 0} sản phẩm`}
              style={{
                minWidth: 22, height: 22, borderRadius: 999, background: "var(--accent)", color: "var(--on-accent)",
                fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                transform: bump ? "scale(1.4)" : "scale(1)", transition: "transform .3s cubic-bezier(.3,1.6,.5,1)",
              }}
            >
              {ready ? count : 0}
            </span>
          </Link>
          <button
            type="button" className="vs-burger vs-hbtn" aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen} aria-controls="vs-mpanel" onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div id="vs-mpanel" className="vs-mpanel">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                const term = q.trim();
                if (term) router.push(`/shop?q=${encodeURIComponent(term)}`);
              }}
            >
              <input
                type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm…" aria-label="Tìm sản phẩm"
                className="vs-input"
              />
            </form>
            <nav aria-label="Menu di động" className="vs-mlinks">
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} aria-current={n.match(pathname) ? "page" : undefined}>{n.label}</Link>
              ))}
              <Link href={account ? "/account" : "/login"}>{account ? "Tài khoản" : "Đăng nhập"}</Link>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
