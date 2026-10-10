import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: { default: "Vansuok admin", template: "%s — Vansuok admin" }, robots: { index: false } };

/** Admin portal shell. Auth lives in src/middleware.ts (matcher: /admin/*). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header style={{ background: "var(--solid)", color: "var(--on-solid)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <Link href="/admin" style={{ textDecoration: "none", fontWeight: 800, letterSpacing: "-0.02em" }}>Vansuok admin</Link>
        <AdminNav />
        <Link href="/" style={{ marginLeft: "auto", fontSize: 14 }}>View shop ↗</Link>
      </header>
      <main>{children}</main>
    </>
  );
}
