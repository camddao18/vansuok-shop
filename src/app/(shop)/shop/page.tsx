import type { Metadata } from "next";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { getProducts } from "@/lib/products";
import type { CategoryId, CollectionId } from "@/lib/types";
import { Listing, PageTitle } from "@/components/shop/Listing";

export const metadata: Metadata = { title: "Shop — Vansuok Studio" };

type SP = { category?: string; collection?: string; q?: string };

export default async function ShopPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const category = CATEGORIES.find((c) => c.id === sp.category)?.id as CategoryId | undefined;
  const collection = COLLECTIONS.find((c) => c.id === sp.collection)?.id as CollectionId | undefined;
  const q = sp.q?.trim().slice(0, 60) || undefined;

  const products = (await getProducts({ category, collection })).filter(
    (p) => !q || p.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageTitle eyebrow="Shop" title="All merch" blurb="Every design, every trade. Pick a size on the product page." />
      <Listing base="/shop" products={products} filters={{ category, collection, q }} showCollectionTabs showSearch />
    </>
  );
}
