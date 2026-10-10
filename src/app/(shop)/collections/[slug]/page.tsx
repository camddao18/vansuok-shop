import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { getCollection } from "@/lib/catalog";
import { getProducts } from "@/lib/products";
import type { CategoryId } from "@/lib/types";
import { Listing, PageTitle } from "@/components/shop/Listing";

export const dynamicParams = false;
export const generateStaticParams = () => COLLECTIONS.map((c) => ({ slug: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCollection((await params).slug);
  return { title: c ? `${c.name} collection — Vansuok Studio` : "Collection" };
}

export default async function CollectionPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();
  const sp = await searchParams;
  const category = CATEGORIES.find((c) => c.id === sp.category)?.id as CategoryId | undefined;

  return (
    <>
      <PageTitle eyebrow={`${collection.number} / collection`} title={collection.name} blurb={collection.blurb} />
      <Listing
        base={`/collections/${collection.id}`}
        products={await getProducts({ collection: collection.id, category })}
        filters={{ category }}
      />
    </>
  );
}
