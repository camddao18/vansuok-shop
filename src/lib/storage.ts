import "server-only";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { requireFileFallback, supabase } from "./db";

const BUCKET = "product-images";
export const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_IMAGES = 8;
/** Ảnh lớn hơn mức này (300 KB) được nén lại. */
const TARGET_BYTES = 300 * 1024;

/** Nén ảnh > 300 KB: thu nhỏ dần kích thước và chất lượng WebP tới khi vừa mức giới hạn. Ảnh nhỏ giữ nguyên. */
async function compress(bytes: Buffer, type: string): Promise<{ bytes: Buffer; type: string }> {
  if (bytes.length <= TARGET_BYTES) return { bytes, type };
  let out = bytes;
  for (const size of [1600, 1200, 900, 700]) {
    for (const quality of [80, 68, 56, 44]) {
      out = await sharp(bytes).rotate().resize(size, size, { fit: "inside", withoutEnlargement: true }).webp({ quality }).toBuffer();
      if (out.length <= TARGET_BYTES) return { bytes: out, type: "image/webp" };
    }
  }
  return { bytes: out, type: "image/webp" };
}

/** Stores a product photo (compressed if over 300 KB) and returns its public URL. Supabase Storage, or public/uploads in local dev. */
export async function uploadProductImage(file: File): Promise<string> {
  const { bytes, type } = await compress(Buffer.from(await file.arrayBuffer()), file.type);
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${IMAGE_TYPES[type]}`;

  if (supabase) {
    const { error } = await supabase.storage.from(BUCKET).upload(name, bytes, { contentType: type, cacheControl: "31536000" });
    if (error) throw new Error(`uploadProductImage: ${error.message}`);
    return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  }
  requireFileFallback();
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
