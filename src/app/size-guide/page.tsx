import type { Metadata } from "next";
import { PageTitle } from "@/components/Listing";
import { SIZES } from "@/lib/types";

export const metadata: Metadata = { title: "Size guide — Vansuok Studio" };

const cell = { padding: "14px 20px", borderTop: "1px solid #E9E7DF", fontSize: 16 } as const;

export default function SizeGuidePage() {
  return (
    <>
      <PageTitle
        eyebrow="Help"
        title="Size guide"
        blurb="All our tees are unisex. Not sure? Measure a tee you already like and compare."
      />
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ overflowX: "auto", background: "var(--surface)", borderRadius: 28, maxWidth: 720 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr className="mono" style={{ textAlign: "left", fontSize: 13 }}>
                <th style={{ padding: "16px 20px" }}>SIZE</th>
                <th style={{ padding: "16px 20px" }}>CHEST (cm)</th>
                <th style={{ padding: "16px 20px" }}>LENGTH (cm)</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO(owner): replace [cm] with the real measurements of your tees */}
              {SIZES.map((s) => (
                <tr key={s}>
                  <td style={{ ...cell, fontWeight: 800 }}>{s}</td>
                  <td style={cell}>[cm]</td>
                  <td style={cell}>[cm]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, maxWidth: 560, fontSize: 15, lineHeight: 1.5, color: "var(--muted)" }}>
          Measurements are taken flat. Heavy fabric can differ by 1–2 cm. If you are between sizes, we suggest the larger one.
        </p>
      </section>
    </>
  );
}
