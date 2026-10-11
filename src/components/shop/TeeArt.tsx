import type { Product } from "@/lib/types";

/** Ảnh mặc định khi sản phẩm chưa có ảnh riêng. */
export const DEFAULT_TEE_IMAGE = "/products/default-tee.webp";

/** Product photo, inset so the card background shows around it. Falls back to the default tee photo when product.image is empty. */
export function TeeArt({ product, width = "80%" }: { product: Product; width?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={product.image || DEFAULT_TEE_IMAGE} alt={product.name} loading="lazy" decoding="async" style={{ width, height: width, objectFit: "contain" }} />;
}
