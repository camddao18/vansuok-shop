"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_SECONDS, createSessionToken, safeEqual } from "@/lib/admin-session";

export interface LoginState { error?: string }

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return { error: "Máy chủ chưa đặt ADMIN_PASSWORD." };

  const user = String(form.get("username") ?? "");
  const pass = String(form.get("password") ?? "");
  // Evaluate both so the response time does not reveal which one was wrong.
  const ok = safeEqual(user, "admin") && safeEqual(pass, password);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    return { error: "Sai tên đăng nhập hoặc mật khẩu." };
  }

  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
