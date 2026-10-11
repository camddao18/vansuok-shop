"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CUSTOMER_COOKIE, CUSTOMER_SESSION_SECONDS, createCustomerToken } from "@/lib/customer-session";
import { createCustomer, getCustomerByEmail, verifyPassword } from "@/lib/customers";

export interface AuthState { error?: string }

const text = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

async function startSession(id: string) {
  (await cookies()).set(CUSTOMER_COOKIE, createCustomerToken(id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CUSTOMER_SESSION_SECONDS,
  });
}

export async function register(_prev: AuthState, form: FormData): Promise<AuthState> {
  const name = text(form, "name", 100);
  const phone = text(form, "phone", 20).replace(/[\s.-]/g, "");
  const email = text(form, "email", 150).toLowerCase();
  const password = String(form.get("password") ?? "");

  if (!name) return { error: "Vui lòng nhập họ tên." };
  if (!/^(0|\+84)\d{9,10}$/.test(phone)) return { error: "Vui lòng nhập số điện thoại Việt Nam hợp lệ." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Email không hợp lệ." };
  if (password.length < 8 || password.length > 100) return { error: "Mật khẩu cần từ 8 đến 100 ký tự." };

  try {
    const customer = await createCustomer({ email, name, phone, password });
    await startSession(customer.id);
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_TAKEN") return { error: "Email này đã được đăng ký. Hãy đăng nhập." };
    console.error(e);
    return { error: "Không thể tạo tài khoản. Vui lòng thử lại." };
  }
  redirect("/account");
}

export async function login(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = text(form, "email", 150).toLowerCase();
  const password = String(form.get("password") ?? "");

  const customer = email ? await getCustomerByEmail(email) : null;
  // Always hash-compare so the response time does not reveal whether the email exists.
  const ok = await verifyPassword(password, customer?.passwordHash ?? "00:00");
  if (!customer || !ok) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    return { error: "Sai email hoặc mật khẩu." };
  }
  await startSession(customer.id);
  redirect("/account");
}

export async function logoutCustomer() {
  (await cookies()).delete({ name: CUSTOMER_COOKIE, path: "/" });
  redirect("/");
}
