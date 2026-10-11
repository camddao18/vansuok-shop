import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Thêm sản phẩm" };

export default function NewProduct() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(26px, 2.6vw, 34px)", letterSpacing: "-0.04em", fontWeight: 800 }}>Thêm sản phẩm</h1>
      <ProductForm />
    </section>
  );
}
