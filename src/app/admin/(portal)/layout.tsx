import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { logout } from "../login/actions";

export const metadata: Metadata = { title: { default: "Quản trị Duck Delivery", template: "%s — Quản trị Duck Delivery" }, robots: { index: false } };

/** Khung cổng quản trị (thanh bên + nội dung). Trang đăng nhập nằm ngoài nhóm này. Xác thực ở src/middleware.ts. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ad-shell">
      <AdminSidebar
        brand={
          <Link href="/admin" className="ad-brand">
          <img src="/logo-white.png" alt="" width={1682} height={1525} style={{ height: 40, width: "auto" }} />
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <strong>Bảng quản trị</strong>
            <span style={{ fontSize: 12, opacity: 0.6 }}>Duck Delivery</span>
          </span>
        </Link>
        }
      >
        <AdminNav />
        <div className="ad-foot">
          <Link href="/" className="ad-link">Xem cửa hàng ↗</Link>
          <form action={logout}><button type="submit" className="ad-link" style={{ width: "100%" }}>Đăng xuất</button></form>
        </div>
      </AdminSidebar>
      <main className="ad-main">{children}</main>
    </div>
  );
}
