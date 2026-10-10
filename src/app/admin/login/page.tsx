import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in — Vansuok admin", robots: { index: false } };

export default function AdminLogin() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--solid)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--surface)", borderRadius: 28, padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--muted)" }}>VANSUOK ADMIN</span>
          <h1 style={{ margin: 0, fontSize: 36, letterSpacing: "-0.04em", fontWeight: 800 }}>Sign in</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
