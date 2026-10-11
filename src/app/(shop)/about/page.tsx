import type { Metadata } from "next";
import { PageTitle } from "@/components/shop/Listing";
import { PROMISES } from "@/data/site";

export const metadata: Metadata = { title: "Về Giao Zịt — Duck Delivery" };

// Nội dung tạm. Thay đoạn giới thiệu bằng câu chuyện thật của thương hiệu.
export default function AboutPage() {
  return (
    <>
      <PageTitle
        eyebrow="Giới thiệu"
        title="Về Giao Zịt"
        blurb="[Câu chuyện thương hiệu: ai làm, vì sao làm, làm cho ai.]"
      />
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 16 }}>
        {PROMISES.map((p) => (
          <div key={p.key} className="vs-promise" style={{ background: "var(--surface)", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{p.key}</span>
            <span className="vs-ptitle" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>{p.title}</span>
            <span style={{ fontSize: 15, lineHeight: 1.5, color: "var(--muted)" }}>{p.note}</span>
          </div>
        ))}
      </section>
    </>
  );
}
