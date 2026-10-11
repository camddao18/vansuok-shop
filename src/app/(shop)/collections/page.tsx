import type { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS } from "@/data/catalog";
import { CollectionCard } from "@/components/shop/CollectionCard";
import { PageTitle } from "@/components/shop/Listing";

export const metadata: Metadata = { title: "Bộ sưu tập — Duck Delivery" };

export default function CollectionsPage() {
  return (
    <>
      <PageTitle
        eyebrow="Bộ sưu tập"
        title="Mỗi nghề, một chất."
        blurb="Không phải ai cũng hiểu, và vì vậy mới vui. Chọn nghề của bạn."
      />
      <section className="vs-cgrid" style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 16 }}>
        {COLLECTIONS.map((c) => <CollectionCard key={c.id} collection={c} />)}
        <Link href="/#suggest" className="vs-card vs-ccard" style={{ minHeight: 440, borderRadius: 32, border: "2px dashed var(--text)", color: "var(--text)", padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", textDecoration: "none" }}>
          <span className="mono" style={{ fontSize: 13 }}>{String(COLLECTIONS.length + 1).padStart(2, "0")} / sắp ra mắt</span>
          <span className="vs-plus" style={{ width: 72, height: 72, borderRadius: 999, background: "var(--btn)", color: "var(--on-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 400 }}>+</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="vs-ctitle" style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>Nghề tiếp theo?</span>
            <span className="vs-cblurb" style={{ fontSize: 16, lineHeight: 1.45, color: "var(--muted)" }}>Bác sĩ, barista, dev… Bạn gợi ý, chúng tôi thiết kế.</span>
          </div>
        </Link>
      </section>
    </>
  );
}
