import { CATEGORIES, COLLECTIONS } from "@/data/catalog";

/** Categories and collections are static config (safe to import from client components). Products live in ./products. */
export const getCollection = (id: string) => COLLECTIONS.find((c) => c.id === id);
export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
