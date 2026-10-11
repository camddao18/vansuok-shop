"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { deleteProduct, getProduct, saveProduct } from "@/lib/products";
import { IMAGE_TYPES, MAX_IMAGES, MAX_IMAGE_BYTES, uploadProductImage } from "@/lib/storage";
import type { CategoryId, CollectionId, Product } from "@/lib/types";

export interface FormState { error?: string }

const DEFAULT_TINT = "#E9E7DF";
const DEFAULT_ART = { shirt: "#111111", ink: "#C6F432" };
const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const text = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

/** Tạo mới (không có trường `id`) hoặc cập nhật (có `id`) sản phẩm. */
export async function saveProductAction(_prev: FormState, form: FormData): Promise<FormState> {
  const id = text(form, "id", 80);
  const existing = id ? await getProduct(id) : undefined;
  if (id && !existing) return { error: "Không tìm thấy sản phẩm." };

  const name = text(form, "name", 120);
  const category = text(form, "category", 20) as CategoryId;
  const collection = text(form, "collection", 20) as CollectionId;
  const price = Number(form.get("price"));
  // Ảnh cũ giữ lại (form gửi `keep`; chỉ nhận URL đang thuộc sản phẩm) + ảnh mới tải lên, theo thứ tự đó.
  const owned = existing?.images ?? (existing?.image ? [existing.image] : []);
  const kept = form.getAll("keep").map(String).filter((u) => owned.includes(u));
  const uploads = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  if (!name) return { error: "Vui lòng nhập tên." };
  if (!CATEGORIES.some((c) => c.id === category)) return { error: "Vui lòng chọn danh mục." };
  if (!COLLECTIONS.some((c) => c.id === collection)) return { error: "Vui lòng chọn bộ sưu tập." };
  if (!Number.isSafeInteger(price) || price < 0) return { error: "Giá phải là số nguyên (VND)." };
  if (kept.length + uploads.length > MAX_IMAGES) return { error: `Tối đa ${MAX_IMAGES} ảnh.` };
  if (uploads.some((u) => !IMAGE_TYPES[u.type])) return { error: "Ảnh phải là JPG, PNG hoặc WebP." };
  if (uploads.some((u) => u.size > MAX_IMAGE_BYTES)) return { error: "Mỗi ảnh tối đa 4 MB." };

  const slug = existing?.slug ?? slugify(text(form, "slug", 80) || name);
  if (!slug) return { error: "Không thể tạo slug từ tên này." };
  if (!existing && (await getProduct(slug))) return { error: `Đã có sản phẩm với slug "${slug}".` };

  const images = [...kept, ...(await Promise.all(uploads.map(uploadProductImage)))];

  const product: Product = {
    ...existing,
    id: existing?.id ?? slug,
    slug,
    name,
    category,
    collection,
    price,
    tint: existing?.tint ?? DEFAULT_TINT,
    art: existing?.art ?? DEFAULT_ART,
    description: text(form, "description", 1000),
    image: images[0],
    images: images.length ? images : undefined,
    active: form.get("active") === "on",
  };
  await saveProduct(product);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function toggleActive(form: FormData) {
  const product = await getProduct(String(form.get("id")));
  if (!product) return;
  await saveProduct({ ...product, active: !product.active });
  revalidatePath("/", "layout");
}

export async function deleteProductAction(form: FormData) {
  await deleteProduct(String(form.get("id")));
  revalidatePath("/", "layout");
}
