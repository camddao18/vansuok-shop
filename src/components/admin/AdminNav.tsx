"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS: { title: string; links: { href: string; label: string; exact?: boolean }[] }[] = [
  { title: "OVERVIEW", links: [{ href: "/admin", label: "Dashboard", exact: true }] },
  { title: "SALES", links: [{ href: "/admin/orders", label: "Orders" }] },
  { title: "CATALOG", links: [{ href: "/admin/products", label: "Products" }] },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="ad-nav" aria-label="Admin">
      {GROUPS.map((g) => (
        <div key={g.title} className="ad-group">
          <span className="mono ad-group-title">{g.title}</span>
          {g.links.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className="ad-link" aria-current={active ? "page" : undefined}>
                {l.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
