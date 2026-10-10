"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

const NAV = [
  { href: "/#collections", label: "Collections", match: (p: string) => p === "/" || p.startsWith("/collections") },
  { href: "/shop", label: "T-shirts", match: (p: string) => p.startsWith("/shop") || p.startsWith("/products") },
  { href: "/#merch", label: "Merch", match: () => false },
  { href: "/#suggest", label: "Suggest a trade", match: () => false },
  { href: "/#about", label: "About", match: () => false },
];

export function Header() {
  const pathname = usePathname();
  const { count, ready } = useCart();

  return (
    <header
      style={{
        maxWidth: 1360, margin: "0 auto", padding: "20px 24px", display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between", gap: 16,
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--text)" }}>
        <span
          style={{
            width: 40, height: 40, borderRadius: 12, background: "var(--btn)", color: "var(--on-btn)",
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20,
          }}
        >
          V
        </span>
        <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>
          VANSUOK<span style={{ fontWeight: 500, color: "var(--muted)" }}> studio</span>
        </span>
      </Link>

      <nav aria-label="Main" style={{ display: "flex", flexWrap: "wrap", gap: 6, background: "var(--surface)", borderRadius: 999, padding: 6 }}>
        {NAV.map((n) => {
          const active = n.match(pathname);
          return (
            <Link
              key={n.label}
              href={n.href}
              aria-current={active ? "page" : undefined}
              style={{
                padding: "10px 18px", borderRadius: 999, textDecoration: "none", fontWeight: 500, fontSize: 15,
                ...(active ? { background: "var(--btn)", color: "var(--on-btn)" } : {}),
              }}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link
          href="/shop#search"
          aria-label="Search"
          style={{
            width: 46, height: 46, borderRadius: 999, border: "1.5px solid var(--text)", background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ stroke: "var(--text)" }} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </Link>
        <Link
          href="/cart"
          style={{
            height: 46, padding: "0 18px", borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)",
            display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ stroke: "var(--on-btn)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1.2 12H6.2z" />
            <path d="M9 8a3 3 0 0 1 6 0" />
          </svg>
          Cart
          <span
            aria-label={`${ready ? count : 0} items`}
            style={{
              minWidth: 22, height: 22, borderRadius: 999, background: "var(--accent)", color: "var(--on-accent)",
              fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {ready ? count : 0}
          </span>
        </Link>
      </div>
    </header>
  );
}
