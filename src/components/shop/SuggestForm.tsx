"use client";

import { useState } from "react";

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
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState("done");
      setTrade("");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label htmlFor="vs-trade" style={{ fontSize: 15, fontWeight: 700 }}>Your profession</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, background: "#FFFFFF", borderRadius: 999, padding: 6 }}>
        <input
          id="vs-trade" type="text" value={trade} onChange={(e) => setTrade(e.target.value)} required maxLength={100}
          placeholder="e.g. Barista, Architect, Developer…"
          style={{ flex: "1 1 200px", minWidth: 0, minHeight: 48, border: "none", outline: "none", background: "transparent", padding: "0 18px", fontFamily: "inherit", fontSize: 16, color: "#111111" }}
        />
        <button
          type="submit" disabled={state === "sending"}
          style={{ minHeight: 52, padding: "0 26px", borderRadius: 999, border: "none", background: "#111111", color: "#FFFFFF", fontFamily: "inherit", fontWeight: 700, fontSize: 16, cursor: "pointer" }}
        >
          {state === "sending" ? "Sending…" : "Send it"}
        </button>
      </div>
      <p role="status" style={{ margin: 0, minHeight: 22, fontSize: 15 }}>
        {state === "done" && "Thanks! We got it."}
        {state === "error" && msg}
      </p>
    </form>
  );
}
