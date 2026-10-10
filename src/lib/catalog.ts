import { CATEGORIES, COLLECTIONS, PRODUCTS } from "@/data/catalog";
import type { CategoryId, CollectionId, Product } from "./types";

export const getProducts = (f: { category?: CategoryId; collection?: CollectionId } = {}): Product[] =>
  PRODUCTS.filter(
    (p) => (!f.category || p.category === f.category) && (!f.collection || p.collection === f.collection),
  );

export const getProduct = (idOrSlug: string) =>
  PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);

export const getCollection = (id: string) => COLLECTIONS.find((c) => c.id === id);
export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
