import "server-only";
import { SEED_PRODUCTS } from "@/data/catalog";
import { dataFile, readJson, requireFileFallback, supabase, writeJson } from "./db";
import type { CategoryId, CollectionId, Product } from "./types";

/** Product storage: see ./db for the Supabase / local-file switch. The file is seeded from SEED_PRODUCTS. */

const PRODUCTS_FILE = dataFile("products.json");

type Row = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  collection: CollectionId;
  price: number;
  tint: string;
  art: Product["art"];
  colors: Product["colors"] | null;
  description: string;
  image: string | null;
  active: boolean;
};

const fromRow = (r: Row): Product => ({
  id: r.id, slug: r.slug, name: r.name, category: r.category, collection: r.collection, price: r.price,
  tint: r.tint, art: r.art, colors: r.colors ?? undefined, description: r.description,
  image: r.image ?? undefined, active: r.active,
});
const toRow = (p: Product): Row => ({
  id: p.id, slug: p.slug, name: p.name, category: p.category, collection: p.collection, price: p.price,
  tint: p.tint, art: p.art, colors: p.colors?.length ? p.colors : null, description: p.description,
  image: p.image ?? null, active: p.active,
});

async function readAll(): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: true });
    if (error) throw new Error(`listProducts: ${error.message}`);
    return (data as Row[]).map(fromRow);
  }
  // Reads never need Supabase (the seed keeps builds and demos working); writes do, see saveProduct.
  return (await readJson<Product>(PRODUCTS_FILE)) ?? SEED_PRODUCTS;
}

/** Everything, including inactive. For the admin portal. */
export const listAllProducts = readAll;

/** Storefront view: active products only. */
export async function getProducts(f: { category?: CategoryId; collection?: CollectionId } = {}): Promise<Product[]> {
  return (await readAll()).filter(
    (p) => p.active && (!f.category || p.category === f.category) && (!f.collection || p.collection === f.collection),
  );
}

/** Any product by id or slug, including inactive (callers decide what to do with those). */
export async function getProduct(idOrSlug: string): Promise<Product | undefined> {
  return (await readAll()).find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export async function saveProduct(product: Product): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("products").upsert(toRow(product));
    if (error) throw new Error(`saveProduct: ${error.message}`);
    return;
  }
  requireFileFallback();
  const all = await readAll();
  const i = all.findIndex((p) => p.id === product.id);
  if (i >= 0) all[i] = product;
  else all.push(product);
  await writeJson(PRODUCTS_FILE, all);
}
