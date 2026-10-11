import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getCustomerById, type Customer } from "./customers";

/**
 * Customer session cookie: `<customerId>.<expiresAtMs>.<hmac>`. Separate from the admin
 * cookie. Key: CUSTOMER_SESSION_SECRET, falling back to the admin secrets.
 */
export const CUSTOMER_COOKIE = "vs-customer";
export const CUSTOMER_SESSION_SECONDS = 60 * 60 * 24 * 30;

const secret = () =>
  process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
const sign = (payload: string) => createHmac("sha256", `customer:${secret()}`).update(payload).digest("hex");

export function createCustomerToken(id: string): string {
  const payload = `${id}.${Date.now() + CUSTOMER_SESSION_SECONDS * 1000}`;
  return `${payload}.${sign(payload)}`;
}

function verify(token: string | undefined): string | null {
  if (!token || !secret()) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  if (!(Number(exp) > Date.now())) return null;
  const a = Buffer.from(sig), b = Buffer.from(sign(`${id}.${exp}`));
  return a.length === b.length && timingSafeEqual(a, b) ? id : null;
}

export type SessionCustomer = Omit<Customer, "passwordHash">;

/** The signed-in customer (without the password hash), or null. */
export async function getSessionCustomer(): Promise<SessionCustomer | null> {
  const id = verify((await cookies()).get(CUSTOMER_COOKIE)?.value);
  if (!id) return null;
  const c = await getCustomerById(id);
  if (!c) return null;
  const { passwordHash: _omit, ...safe } = c;
  return safe;
}
