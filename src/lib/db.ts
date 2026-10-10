import "server-only";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Storage backend shared by orders and products. Supabase when SUPABASE_URL +
 * SUPABASE_SERVICE_ROLE_KEY are set; otherwise local JSON files in .data/ so
 * `npm run dev` works with zero setup. The file fallback refuses to run in production.
 */
export const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

const DATA_DIR = path.join(process.cwd(), ".data");
export const dataFile = (name: string) => path.join(DATA_DIR, name);

export function requireFileFallback() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
}

export async function readJson<T>(file: string): Promise<T[] | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T[];
  } catch {
    return null;
  }
}
export async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}
