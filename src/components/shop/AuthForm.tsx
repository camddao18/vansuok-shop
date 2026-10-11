"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Req } from "./Req";
import { login, register, type AuthState } from "@/app/(shop)/account/actions";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const [state, action, pending] = useActionState<AuthState, FormData>(isRegister ? register : login, {});

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 460 }}>
      {isRegister && (
        <>
          <label className="vs-label"><span>Họ và tên<Req /></span><input className="vs-input" name="name" autoComplete="name" required maxLength={100} /></label>
          <label className="vs-label"><span>Số điện thoại<Req /></span><input className="vs-input" name="phone" type="tel" autoComplete="tel" required maxLength={20} /></label>
        </>
      )}
      <label className="vs-label"><span>Email<Req /></span><input className="vs-input" name="email" type="email" autoComplete="email" required maxLength={150} /></label>
      <label className="vs-label">
        <span>Mật khẩu{isRegister && " (tối thiểu 8 ký tự)"}<Req /></span>
        <input
          className="vs-input" name="password" type="password" required minLength={isRegister ? 8 : undefined} maxLength={100}
          autoComplete={isRegister ? "new-password" : "current-password"}
        />
      </label>
      {state.error && <p role="alert" style={{ margin: 0, color: "#B00020", fontWeight: 700 }}>{state.error}</p>}
      <button className="vs-btn" type="submit" disabled={pending}>
        {pending ? "Vui lòng chờ…" : isRegister ? "Tạo tài khoản" : "Đăng nhập"}
      </button>
      <p style={{ margin: 0, fontSize: 15, color: "var(--muted)" }}>
        {isRegister ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
        <Link href={isRegister ? "/login" : "/register"} style={{ fontWeight: 700 }}>
          {isRegister ? "Đăng nhập" : "Đăng ký"}
        </Link>
      </p>
    </form>
  );
}
