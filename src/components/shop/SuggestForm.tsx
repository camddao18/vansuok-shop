"use client";

import { useState } from "react";
import { Req } from "./Req";

export function SuggestForm() {
  const [trade, setTrade] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/suggest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trade }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Đã có lỗi xảy ra.");
      setState("done");
      setTrade("");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label htmlFor="vs-trade" style={{ fontSize: 15, fontWeight: 700 }}>Nghề nghiệp của bạn<Req /></label>
      <div className="vs-suggest-row" style={{ display: "flex", gap: 10, background: "#FFFFFF", borderRadius: 999, padding: 6 }}>
        <input
          id="vs-trade" className="vs-suggest-input" type="text" value={trade} onChange={(e) => setTrade(e.target.value)} required maxLength={100}
          placeholder="VD: Barista, Kiến trúc sư, Lập trình viên…"
          style={{ flex: "1 1 0", minWidth: 0, minHeight: 44, border: "none", outline: "none", background: "transparent", padding: "0 16px", fontFamily: "inherit", color: "#111111" }}
        />
        <button
          type="submit" disabled={state === "sending"} className="vs-suggest-btn"
          style={{ minHeight: 44, padding: "0 22px", borderRadius: 999, border: "none", background: "#111111", color: "#FFFFFF", fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
        >
          {state === "sending" ? "Đang gửi…" : "Gửi đi"}
        </button>
      </div>
      <p role="status" style={{ margin: 0, minHeight: 22, fontSize: 15 }}>
        {state === "done" && "Cảm ơn bạn! Chúng tôi đã nhận được."}
        {state === "error" && msg}
      </p>
    </form>
  );
}
