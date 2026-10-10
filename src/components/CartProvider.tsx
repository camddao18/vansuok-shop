"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine } from "@/lib/types";

const KEY = "vs-cart";
const same = (a: CartLine, b: CartLine) => a.productId === b.productId && a.size === b.size && a.color === b.color;

interface CartCtx {
  lines: CartLine[];
  ready: boolean;
  count: number;
  add: (line: CartLine) => void;
  setQty: (line: CartLine, qty: number) => void;
  remove: (line: CartLine) => void;
  clear: () => void;
}
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => same(l, line));
      if (i < 0) return [...prev, line];
      const next = [...prev];
      next[i] = { ...next[i], qty: Math.min(20, next[i].qty + line.qty) };
      return next;
    });
  }, []);
  const setQty = useCallback(
    (line: CartLine, qty: number) =>
      setLines((prev) => prev.map((l) => (same(l, line) ? { ...l, qty: Math.max(1, Math.min(20, qty)) } : l))),
    [],
  );
  const remove = useCallback((line: CartLine) => setLines((prev) => prev.filter((l) => !same(l, line))), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, ready, count: lines.reduce((s, l) => s + l.qty, 0), add, setQty, remove, clear }),
    [lines, ready, add, setQty, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
