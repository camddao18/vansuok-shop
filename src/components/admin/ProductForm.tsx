"use client";

import { useActionState, useEffect, useState } from "react";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { saveProductAction, type FormState } from "@/app/admin/(portal)/products/actions";
import { ProductCard } from "@/components/shop/ProductCard";
import type { CategoryId, CollectionId, Product } from "@/lib/types";

const HEX = /^#[0-9a-fA-F]{6}$/;
const color = (v: string, fallback: string) => (HEX.test(v) ? v : fallback);

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProductAction, {});
  const p = product;

  // Controlled fields feed the live preview; the form still submits them as normal inputs.
  const [name, setName] = useState(p?.name ?? "");
  const [category, setCategory] = useState<CategoryId>(p?.category ?? "tshirt");
  const [collection, setCollection] = useState<CollectionId>(p?.collection ?? COLLECTIONS[0].id);
  const [price, setPrice] = useState(String(p?.price ?? 250000));
  const [tint, setTint] = useState(p?.tint ?? "#E9E7DF");
  const [shirt, setShirt] = useState(p?.art.shirt ?? "#111111");
  const [ink, setInk] = useState(p?.art.ink ?? "#C6F432");
  const [description, setDescription] = useState(p?.description ?? "");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState(p?.image ?? "");
  const [photoPreview, setPhotoPreview] = useState<string>();

  useEffect(() => () => { if (photoPreview) URL.revokeObjectURL(photoPreview); }, [photoPreview]);

  const preview: Product = {
    ...p,
    id: p?.id ?? "preview",
    slug: p?.slug ?? "preview",
    name: name || "Product name",
    category,
    collection,
    price: Number(price) || 0,
    tint: color(tint, "#E9E7DF"),
    art: { shirt: color(shirt, "#111111"), ink: color(ink, "#C6F432") },
    description: "",
    image: photoPreview || imageUrl.trim() || undefined,
    active: true,
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
      <form action={action} style={{ flex: "1 1 480px", maxWidth: 640, display: "flex", flexDirection: "column", gap: 16, background: "var(--surface)", borderRadius: 28, padding: 28 }}>
        {p && <input type="hidden" name="id" value={p.id} />}
        <label className="vs-label">Name<input className="vs-input" name="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} /></label>
        {!p && <label className="vs-label">Slug (optional, defaults to the name)<input className="vs-input" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} maxLength={80} /></label>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label className="vs-label">Category
            <select className="vs-input" name="category" value={category} onChange={(e) => setCategory(e.target.value as CategoryId)}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="vs-label">Collection
            <select className="vs-input" name="collection" value={collection} onChange={(e) => setCollection(e.target.value as CollectionId)}>
              {COLLECTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <label className="vs-label">Price (VND)<input className="vs-input" name="price" type="number" min={0} step={1000} value={price} onChange={(e) => setPrice(e.target.value)} required /></label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <label className="vs-label">Background<input className="vs-input" name="tint" value={tint} onChange={(e) => setTint(e.target.value)} pattern="#[0-9a-fA-F]{6}" required /></label>
          <label className="vs-label">Shirt<input className="vs-input" name="shirt" value={shirt} onChange={(e) => setShirt(e.target.value)} pattern="#[0-9a-fA-F]{6}" required /></label>
          <label className="vs-label">Ink<input className="vs-input" name="ink" value={ink} onChange={(e) => setInk(e.target.value)} pattern="#[0-9a-fA-F]{6}" required /></label>
        </div>
        <label className="vs-label">Description<textarea className="vs-input" name="description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} /></label>
        <label className="vs-label">Photo (JPG, PNG or WebP, max 4 MB, square works best)
          <input
            className="vs-input" style={{ paddingTop: 12 }} name="photo" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPhotoPreview(f ? URL.createObjectURL(f) : undefined);
            }}
          />
        </label>
        <label className="vs-label">...or photo URL (an uploaded photo wins; clear this to go back to the drawn tee)
          <input className="vs-input" name="image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
        </label>
        <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 700 }}>
          <input type="checkbox" name="active" defaultChecked={p?.active ?? true} /> Visible in the shop
        </label>
        {state.error && <p role="alert" style={{ margin: 0, color: "#B00020", fontWeight: 700 }}>{state.error}</p>}
        <button className="vs-btn" type="submit" disabled={pending}>{pending ? "Saving…" : p ? "Save changes" : "Create product"}</button>
      </form>

      <aside aria-label="Live preview" style={{ flex: "1 1 300px", maxWidth: 380, position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--muted)" }}>LIVE PREVIEW · AS IT LOOKS IN THE SHOP</span>
        <div style={{ pointerEvents: "none" }} aria-hidden="true"><ProductCard product={preview} /></div>
      </aside>
    </div>
  );
}
