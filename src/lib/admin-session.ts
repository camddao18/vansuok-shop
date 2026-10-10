/**
 * Admin session cookie: `<expiresAtMs>.<hmac>`. Uses Web Crypto so it works in the
 * edge middleware as well as in server actions. The HMAC key is ADMIN_SESSION_SECRET,
 * or ADMIN_PASSWORD when that is not set (so changing the password logs everyone out).
 */
export const SESSION_COOKIE = "vs-admin";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

const enc = new TextEncoder();
const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(payload)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Length-independent comparison, so timing does not leak how much of a guess matched. */
export function safeEqual(a: string, b: string): boolean {
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const exp = String(Date.now() + SESSION_SECONDS * 1000);
  return `${exp}.${await sign(exp)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !(Number(exp) > Date.now())) return false;
  return safeEqual(sig, await sign(exp));
}
