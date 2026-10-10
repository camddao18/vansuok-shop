import "server-only";
import { dataFile, readJson as readJsonOrNull, requireFileFallback, supabase, writeJson } from "./db";
import type { Order, OrderStatus } from "./types";

/** Order storage: see ./db for the Supabase / local-file switch. */

const ORDERS_FILE = dataFile("orders.json");
const SUGGEST_FILE = dataFile("suggestions.json");

const readJson = async <T>(file: string): Promise<T[]> => (await readJsonOrNull<T>(file)) ?? [];
type Row = {
  code: number;
  access_token: string;
  status: OrderStatus;
  payment_method: Order["paymentMethod"];
  items: Order["items"];
  subtotal: number;
  shipping_fee: number;
  total: number;
  customer: Order["customer"];
  payment_link_id: string | null;
  checkout_url: string | null;
  created_at: string;
};

const fromRow = (r: Row): Order => ({
  code: Number(r.code),
  accessToken: r.access_token,
  status: r.status,
  paymentMethod: r.payment_method,
  items: r.items,
  subtotal: r.subtotal,
  shippingFee: r.shipping_fee,
  total: r.total,
  customer: r.customer,
  paymentLinkId: r.payment_link_id ?? undefined,
  checkoutUrl: r.checkout_url ?? undefined,
  createdAt: r.created_at,
});

const toRow = (o: Order): Row => ({
  code: o.code,
  access_token: o.accessToken,
  status: o.status,
  payment_method: o.paymentMethod,
  items: o.items,
  subtotal: o.subtotal,
  shipping_fee: o.shippingFee,
  total: o.total,
  customer: o.customer,
  payment_link_id: o.paymentLinkId ?? null,
  checkout_url: o.checkoutUrl ?? null,
  created_at: o.createdAt,
});

export async function createOrder(order: Order): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("orders").insert(toRow(order));
    if (error) throw new Error(`createOrder: ${error.message}`);
    return;
  }
  requireFileFallback();
  const all = await readJson<Order>(ORDERS_FILE);
  all.push(order);
  await writeJson(ORDERS_FILE, all);
}

export async function getOrder(code: number): Promise<Order | null> {
  if (supabase) {
    const { data, error } = await supabase.from("orders").select("*").eq("code", code).maybeSingle();
    if (error) throw new Error(`getOrder: ${error.message}`);
    return data ? fromRow(data as Row) : null;
  }
  requireFileFallback();
  return (await readJson<Order>(ORDERS_FILE)).find((o) => o.code === code) ?? null;
}

export async function updateOrder(
  code: number,
  patch: Partial<Pick<Order, "status" | "paymentLinkId" | "checkoutUrl">>,
): Promise<void> {
  if (supabase) {
    const row: Partial<Row> = {};
    if (patch.status) row.status = patch.status;
    if (patch.paymentLinkId) row.payment_link_id = patch.paymentLinkId;
    if (patch.checkoutUrl) row.checkout_url = patch.checkoutUrl;
    const { error } = await supabase.from("orders").update(row).eq("code", code);
    if (error) throw new Error(`updateOrder: ${error.message}`);
    return;
  }
  requireFileFallback();
  const all = await readJson<Order>(ORDERS_FILE);
  const i = all.findIndex((o) => o.code === code);
  if (i >= 0) all[i] = { ...all[i], ...patch };
  await writeJson(ORDERS_FILE, all);
}

export async function listOrders(limit = 200): Promise<Order[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(`listOrders: ${error.message}`);
    return (data as Row[]).map(fromRow);
  }
  requireFileFallback();
  return (await readJson<Order>(ORDERS_FILE)).reverse().slice(0, limit);
}

export async function addTradeSuggestion(trade: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("trade_suggestions").insert({ trade });
    if (error) throw new Error(`addTradeSuggestion: ${error.message}`);
    return;
  }
  requireFileFallback();
  const all = await readJson<{ trade: string; createdAt: string }>(SUGGEST_FILE);
  all.push({ trade, createdAt: new Date().toISOString() });
  await writeJson(SUGGEST_FILE, all);
}
