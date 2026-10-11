"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface AccountInfo {
  name: string;
  phone: string;
  email: string;
}

const Ctx = createContext<AccountInfo | null>(null);

/** Signed-in customer (null for guests), passed down from the shop layout. */
export function AccountProvider({ account, children }: { account: AccountInfo | null; children: ReactNode }) {
  return <Ctx.Provider value={account}>{children}</Ctx.Provider>;
}

export const useAccount = () => useContext(Ctx);
