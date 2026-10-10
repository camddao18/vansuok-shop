import "server-only";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { requireFileFallback, supabase } from "./db";

const BUCKET = "product-images";
export const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/** Stores a product photo and returns its public URL. Supabase Storage, or public/uploads in local dev. */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (supabase) {
    const { error } = await supabase.storage.from(BUCKET).upload(name, bytes, { contentType: file.type, cacheControl: "31536000" });
    if (error) throw new Error(`uploadProductImage: ${error.message}`);
    return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  }
  requireFileFallback();
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
