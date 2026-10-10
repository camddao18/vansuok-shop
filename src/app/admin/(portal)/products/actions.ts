"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { getProduct, saveProduct } from "@/lib/products";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, uploadProductImage } from "@/lib/storage";
import type { CategoryId, CollectionId, Product } from "@/lib/types";

export interface FormState { error?: string }

const HEX = /^#[0-9a-fA-F]{6}$/;
const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const text = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

/** Create (no `id` field) or update (`id` present) a product. */
export async function saveProductAction(_prev: FormState, form: FormData): Promise<FormState> {
  const id = text(form, "id", 80);
  const existing = id ? await getProduct(id) : undefined;
  if (id && !existing) return { error: "Product not found." };

  const name = text(form, "name", 120);
  const category = text(form, "category", 20) as CategoryId;
  const collection = text(form, "collection", 20) as CollectionId;
  const price = Number(form.get("price"));
  const tint = text(form, "tint", 7);
  const shirt = text(form, "shirt", 7);
  const ink = text(form, "ink", 7);
  let image = text(form, "image", 500);
  const photo = form.get("photo");
  const upload = photo instanceof File && photo.size > 0 ? photo : null;

  if (!name) return { error: "Name is required." };
  if (!CATEGORIES.some((c) => c.id === category)) return { error: "Pick a category." };
  if (!COLLECTIONS.some((c) => c.id === collection)) return { error: "Pick a collection." };
  if (!Number.isSafeInteger(price) || price < 0) return { error: "Price must be a whole number of VND." };
  if (![tint, shirt, ink].every((c) => HEX.test(c))) return { error: "Colors must look like #RRGGBB." };
  if (upload && !IMAGE_TYPES[upload.type]) return { error: "Photo must be a JPG, PNG or WebP." };
  if (upload && upload.size > MAX_IMAGE_BYTES) return { error: "Photo must be 4 MB or smaller." };
  if (image && !/^(https:\/\/|\/)/.test(image)) return { error: "Image must be an https:// URL or a /path." };

  const slug = existing?.slug ?? slugify(text(form, "slug", 80) || name);
  if (!slug) return { error: "Could not make a slug from that name." };
  if (!existing && (await getProduct(slug))) return { error: `A product with the slug "${slug}" already exists.` };

  if (upload) image = await uploadProductImage(upload);

  const product: Product = {
    ...existing,
    id: existing?.id ?? slug,
    slug,
    name,
    category,
    collection,
    price,
    tint,
    art: { shirt, ink },
    description: text(form, "description", 1000),
    image: image || undefined,
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
