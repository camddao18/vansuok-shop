import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { dataFile, readJson as readJsonOrNull, requireFileFallback, supabase, writeJson } from "./db";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
}

type Row = { id: string; email: string; name: string; phone: string; password_hash: string; created_at: string };
const fromRow = (r: Row): Customer => ({
  id: r.id, email: r.email, name: r.name, phone: r.phone, passwordHash: r.password_hash, createdAt: r.created_at,
});

const FILE = dataFile("customers.json");
const readAll = async () => (await readJsonOrNull<Customer>(FILE)) ?? [];

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${(await scrypt(pw, salt, 64)).toString("hex")}`;
}

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const given = await scrypt(pw, Buffer.from(salt, "hex"), expected.length);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  if (supabase) {
    const { data, error } = await supabase.from("customers").select("*").eq("email", email).maybeSingle();
    if (error) throw new Error(`getCustomerByEmail: ${error.message}`);
    return data ? fromRow(data as Row) : null;
  }
  requireFileFallback();
  return (await readAll()).find((c) => c.email === email) ?? null;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (supabase) {
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`getCustomerById: ${error.message}`);
    return data ? fromRow(data as Row) : null;
  }
  requireFileFallback();
  return (await readAll()).find((c) => c.id === id) ?? null;
}

/** Throws "EMAIL_TAKEN" if the email is already registered. */
export async function createCustomer(input: { email: string; name: string; phone: string; password: string }): Promise<Customer> {
  const customer: Customer = {
    id: randomBytes(12).toString("hex"),
    email: input.email,
    name: input.name,
    phone: input.phone,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  if (supabase) {
    const { error } = await supabase.from("customers").insert({
      id: customer.id, email: customer.email, name: customer.name, phone: customer.phone,
      password_hash: customer.passwordHash, created_at: customer.createdAt,
    });
    if (error) throw new Error(error.code === "23505" ? "EMAIL_TAKEN" : `createCustomer: ${error.message}`);
    return customer;
  }
  requireFileFallback();
  const all = await readAll();
  if (all.some((c) => c.email === customer.email)) throw new Error("EMAIL_TAKEN");
  all.push(customer);
  await writeJson(FILE, all);
  return customer;
}
