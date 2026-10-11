"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <label className="vs-label">Tên đăng nhập<input className="vs-input" name="username" autoComplete="username" defaultValue="admin" required /></label>
      <label className="vs-label">Mật khẩu<input className="vs-input" name="password" type="password" autoComplete="current-password" autoFocus required /></label>
      {state.error && <p role="alert" style={{ margin: 0, color: "#B00020", fontWeight: 700 }}>{state.error}</p>}
      <button className="vs-btn" type="submit" disabled={pending}>{pending ? "Đang đăng nhập…" : "Đăng nhập"}</button>
    </form>
  );
}
