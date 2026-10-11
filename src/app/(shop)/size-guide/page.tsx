import type { Metadata } from "next";
import { PageTitle } from "@/components/shop/Listing";
import { SIZES } from "@/lib/types";

export const metadata: Metadata = { title: "Hướng dẫn chọn size — Duck Delivery" };

const cell = { padding: "14px 20px", borderTop: "1px solid #E9E7DF", fontSize: 16 } as const;

export default function SizeGuidePage() {
  return (
    <>
      <PageTitle
        eyebrow="Hỗ trợ"
        title="Hướng dẫn chọn size"
        blurb="Tất cả áo thun của chúng tôi đều là unisex. Chưa chắc chắn? Hãy đo một chiếc áo bạn đang thích rồi so sánh."
      />
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ overflowX: "auto", background: "var(--surface)", borderRadius: 28, maxWidth: 720 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr className="mono" style={{ textAlign: "left", fontSize: 13 }}>
                <th style={{ padding: "16px 20px" }}>SIZE</th>
                <th style={{ padding: "16px 20px" }}>NGỰC (cm)</th>
                <th style={{ padding: "16px 20px" }}>DÀI ÁO (cm)</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO(owner): thay [cm] bằng số đo thật của áo */}
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
          Số đo được lấy khi để áo phẳng. Vải dày có thể chênh 1–2 cm. Nếu bạn đang lưỡng lự giữa hai size, chúng tôi gợi ý chọn size lớn hơn.
        </p>
      </section>
    </>
  );
}
