import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sửa sản phẩm" };

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const product = await getProduct((await params).id);
  if (!product) notFound();
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(26px, 2.6vw, 34px)", letterSpacing: "-0.04em", fontWeight: 800 }}>{product.name}</h1>
      <ProductForm product={product} />
    </section>
  );
}
