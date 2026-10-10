import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New product" };

export default function NewProduct() {
  return (
    <section style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(36px, 4.4vw, 60px)", letterSpacing: "-0.04em", fontWeight: 800 }}>New product</h1>
      <ProductForm />
    </section>
  );
}
