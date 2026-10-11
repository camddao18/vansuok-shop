"use client";

import { useActionState, useEffect, useState } from "react";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { saveProductAction, type FormState } from "@/app/admin/(portal)/products/actions";
import { ProductCard } from "@/components/shop/ProductCard";
import type { CategoryId, CollectionId, Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProductAction, {});
  const p = product;

  // Các trường được kiểm soát cấp dữ liệu cho phần xem trước; form vẫn gửi chúng như input bình thường.
  const [name, setName] = useState(p?.name ?? "");
  const [category, setCategory] = useState<CategoryId>(p?.category ?? "tshirt");
  const [collection, setCollection] = useState<CollectionId>(p?.collection ?? COLLECTIONS[0].id);
  const [price, setPrice] = useState(String(p?.price ?? 250000));
  const [description, setDescription] = useState(p?.description ?? "");
  const [slug, setSlug] = useState("");
  const [kept, setKept] = useState<string[]>(p?.images ?? (p?.image ? [p.image] : []));
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const preview: Product = {
    ...p,
    id: p?.id ?? "preview",
    slug: p?.slug ?? "preview",
    name: name || "Tên sản phẩm",
    category,
    collection,
    price: Number(price) || 0,
    tint: p?.tint ?? "#E9E7DF",
    art: p?.art ?? { shirt: "#111111", ink: "#C6F432" },
    description: "",
    image: kept[0] || previews[0],
    active: true,
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
      <form action={action} style={{ flex: "1 1 480px", maxWidth: 640, display: "flex", flexDirection: "column", gap: 16, background: "var(--surface)", borderRadius: 28, padding: 28 }}>
        {p && <input type="hidden" name="id" value={p.id} />}
        <label className="vs-label">Tên<input className="vs-input" name="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} /></label>
        {!p && <label className="vs-label">Slug (không bắt buộc, mặc định theo tên)<input className="vs-input" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} maxLength={80} /></label>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label className="vs-label">Danh mục
            <select className="vs-input" name="category" value={category} onChange={(e) => setCategory(e.target.value as CategoryId)}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="vs-label">Bộ sưu tập
            <select className="vs-input" name="collection" value={collection} onChange={(e) => setCollection(e.target.value as CollectionId)}>
              {COLLECTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <label className="vs-label">Giá (VND)<input className="vs-input" name="price" type="number" min={0} step={1000} value={price} onChange={(e) => setPrice(e.target.value)} required /></label>
        <label className="vs-label">Mô tả<textarea className="vs-input" name="description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} /></label>
        <div className="vs-label">
          Ảnh (JPG, PNG hoặc WebP, tối đa 4 MB mỗi ảnh, tối đa 8 ảnh; ảnh đầu tiên là ảnh bìa; ảnh trên 300 KB được tự động nén)
          {kept.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
              {kept.map((url, i) => (
                <div key={url} style={{ position: "relative", width: 84, height: 84 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Ảnh ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} />
                  <input type="hidden" name="keep" value={url} />
                  <button
                    type="button" aria-label={`Xóa ảnh ${i + 1}`} onClick={() => setKept(kept.filter((u) => u !== url))}
                    style={{ position: "absolute", top: -6, right: -6, width: 24, height: 24, borderRadius: 999, border: 0, background: "#111", color: "#fff", cursor: "pointer", lineHeight: 1 }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
          <input
            className="vs-input" style={{ paddingTop: 12 }} name="photos" type="file" multiple accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPreviews(Array.from(e.target.files ?? [], (f) => URL.createObjectURL(f)))}
          />
        </div>
        <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 700 }}>
          <input type="checkbox" name="active" defaultChecked={p?.active ?? true} /> Hiển thị trong cửa hàng
        </label>
        {state.error && <p role="alert" style={{ margin: 0, color: "#B00020", fontWeight: 700 }}>{state.error}</p>}
        <button className="vs-btn" type="submit" disabled={pending}>{pending ? "Đang lưu…" : p ? "Lưu thay đổi" : "Tạo sản phẩm"}</button>
      </form>

      <aside aria-label="Xem trước" style={{ flex: "1 1 300px", maxWidth: 380, position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--muted)" }}>XEM TRƯỚC · HIỂN THỊ NHƯ TRONG CỬA HÀNG</span>
        <div style={{ pointerEvents: "none" }} aria-hidden="true"><ProductCard product={preview} /></div>
      </aside>
    </div>
  );
}
