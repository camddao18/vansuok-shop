import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { logout } from "../login/actions";

export const metadata: Metadata = { title: { default: "Vansuok admin", template: "%s — Vansuok admin" }, robots: { index: false } };

/** Portal shell (sidebar + content). The login page lives outside this group. Auth is in src/middleware.ts. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <Link href="/admin" className="ad-brand">
          <span className="ad-logo">V</span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <strong>Admin Panel</strong>
            <span style={{ fontSize: 12, opacity: 0.6 }}>Vansuok Studio</span>
          </span>
        </Link>
        <AdminNav />
        <div className="ad-foot">
          <Link href="/" className="ad-link">View shop ↗</Link>
          <form action={logout}><button type="submit" className="ad-link" style={{ width: "100%" }}>Sign out</button></form>
        </div>
      </aside>
      <main className="ad-main">{children}</main>
    </div>
  );
}
