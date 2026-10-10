import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getCollection } from "@/lib/catalog";
import { getProduct, getProducts } from "@/lib/products";
import { formatVND } from "@/lib/money";
import { AddToCart } from "@/components/shop/AddToCart";
import { ProductCard } from "@/components/shop/ProductCard";
import { TeeArt } from "@/components/shop/TeeArt";

export const generateStaticParams = async () => (await getProducts()).map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return { title: p ? `${p.name} — Vansuok Studio` : "Product", description: p?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product || !product.active) notFound();
  const collection = getCollection(product.collection);
  const category = getCategory(product.category);
  const related = (await getProducts({ collection: product.collection })).filter((p) => p.id !== product.id);

  return (
    <>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "16px 24px 0", fontSize: 14, color: "var(--muted)" }}>
        <Link href="/shop">Shop</Link> / <Link href={`/collections/${product.collection}`}>{collection?.name}</Link> / {product.name}
      </div>

      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "24px 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(480px, 100%), 1fr))", gap: 40, alignItems: "start" }}>
        <div style={{ borderRadius: 32, background: product.tint, aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <span className="mono" style={{ position: "absolute", top: 20, left: 20, fontSize: 12, background: "#FFFFFF", color: "#111111", padding: "6px 12px", borderRadius: 999 }}>
            {collection?.name}
          </span>
          <TeeArt product={product} width="72%" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="mono" style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
              {category?.name} · {collection?.name}
            </span>
            <h1 style={{ margin: 0, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 800 }}>{product.name}</h1>
            <span style={{ fontSize: 28, fontWeight: 800 }}>{formatVND(product.price)}</span>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: "var(--muted)", maxWidth: 520 }}>{product.description}</p>
          </div>
          <AddToCart productId={product.id} hasSizes={!!category?.hasSizes} colors={product.colors} />
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ maxWidth: 1360, margin: "0 auto", padding: "0 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
          <h2 style={{ margin: 0, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.04em", fontWeight: 800 }}>More from {collection?.name}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 16 }}>
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
