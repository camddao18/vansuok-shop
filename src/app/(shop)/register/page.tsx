import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionCustomer } from "@/lib/customer-session";
import { PageTitle } from "@/components/shop/Listing";
import { AuthForm } from "@/components/shop/AuthForm";

export const metadata: Metadata = { title: "Đăng ký — Duck Delivery", robots: { index: false } };

export default async function RegisterPage() {
  if (await getSessionCustomer()) redirect("/account");
  return (
    <>
      <PageTitle eyebrow="Tài khoản" title="Đăng ký" blurb="Tạo tài khoản để theo dõi đơn hàng và đặt hàng nhanh hơn." />
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px" }}>
        <AuthForm mode="register" />
      </section>
    </>
  );
}
