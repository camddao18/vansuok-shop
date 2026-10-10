"use client";

import { useActionState } from "react";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { saveProductAction, type FormState } from "@/app/admin/products/actions";
import type { Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProductAction, {});
  const p = product;
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640, background: "var(--surface)", borderRadius: 28, padding: 28 }}>
      {p && <input type="hidden" name="id" value={p.id} />}
      <label className="vs-label">Name<input className="vs-input" name="name" defaultValue={p?.name} required maxLength={120} /></label>
      {!p && <label className="vs-label">Slug (optional, defaults to the name)<input className="vs-input" name="slug" maxLength={80} /></label>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <label className="vs-label">Category
          <select className="vs-input" name="category" defaultValue={p?.category ?? "tshirt"}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="vs-label">Collection
          <select className="vs-input" name="collection" defaultValue={p?.collection ?? COLLECTIONS[0].id}>
            {COLLECTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>
      <label className="vs-label">Price (VND)<input className="vs-input" name="price" type="number" min={0} step={1000} defaultValue={p?.price ?? 250000} required /></label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <label className="vs-label">Background<input className="vs-input" name="tint" defaultValue={p?.tint ?? "#E9E7DF"} pattern="#[0-9a-fA-F]{6}" required /></label>
        <label className="vs-label">Shirt<input className="vs-input" name="shirt" defaultValue={p?.art.shirt ?? "#111111"} pattern="#[0-9a-fA-F]{6}" required /></label>
        <label className="vs-label">Ink<input className="vs-input" name="ink" defaultValue={p?.art.ink ?? "#C6F432"} pattern="#[0-9a-fA-F]{6}" required /></label>
      </div>
      <label className="vs-label">Description<textarea className="vs-input" name="description" defaultValue={p?.description} maxLength={1000} /></label>
      <label className="vs-label">Photo (JPG, PNG or WebP, max 4 MB, square works best)<input className="vs-input" style={{ paddingTop: 12 }} name="photo" type="file" accept="image/jpeg,image/png,image/webp" /></label>
      <label className="vs-label">...or photo URL (an uploaded photo wins; clear this to go back to the drawn tee)<input className="vs-input" name="image" defaultValue={p?.image} placeholder="https://…" /></label>
      <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 700 }}>
        <input type="checkbox" name="active" defaultChecked={p?.active ?? true} /> Visible in the shop
      </label>
      {state.error && <p role="alert" style={{ margin: 0, color: "#B00020", fontWeight: 700 }}>{state.error}</p>}
      <button className="vs-btn" type="submit" disabled={pending}>{pending ? "Saving…" : p ? "Save changes" : "Create product"}</button>
    </form>
  );
}
