import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionCustomer } from "@/lib/customer-session";
import { PageTitle } from "@/components/shop/Listing";
import { AuthForm } from "@/components/shop/AuthForm";

export const metadata: Metadata = { title: "Đăng nhập — Duck Delivery", robots: { index: false } };

export default async function LoginPage() {
  if (await getSessionCustomer()) redirect("/account");
  return (
    <>
      <PageTitle eyebrow="Tài khoản" title="Đăng nhập" blurb="Đăng nhập để theo dõi đơn hàng của bạn." />
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px" }}>
        <AuthForm mode="login" />
      </section>
    </>
  );
}
