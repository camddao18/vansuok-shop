"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className="vs-tab" aria-current={pathname.startsWith(l.href) ? "true" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
