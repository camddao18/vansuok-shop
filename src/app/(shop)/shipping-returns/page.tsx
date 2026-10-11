import type { Metadata } from "next";
import { PageTitle } from "@/components/shop/Listing";
import { formatVND, FREE_SHIPPING_OVER, SHIPPING_FEE } from "@/lib/money";

export const metadata: Metadata = { title: "Vận chuyển & đổi trả — Duck Delivery" };

// Nội dung tạm. Thay các phần trong [ngoặc vuông] bằng chính sách thật.
const blocks = [
  {
    key: "VẬN CHUYỂN",
    title: "Vận chuyển",
    lines: [
      `Phí vận chuyển đồng giá ${formatVND(SHIPPING_FEE)}. Miễn phí vận chuyển cho đơn từ ${formatVND(FREE_SHIPPING_OVER)}.`,
      "Thời gian giao hàng: [số ngày].",
      "Hiện chúng tôi chỉ giao hàng trong Việt Nam.",
    ],
  },
  {
    key: "THANH TOÁN",
    title: "Thanh toán",
    lines: [
      "Chúng tôi nhận chuyển khoản qua VietQR. Quét mã QR bằng bất kỳ ứng dụng ngân hàng nào.",
      "Đơn hàng được xác nhận tự động ngay khi nhận được tiền chuyển khoản.",
    ],
  },
  {
    key: "ĐỔI TRẢ",
    title: "Đổi & trả hàng",
    lines: [
      "Sai size hoặc đơn hàng có vấn đề? Hãy liên hệ với chúng tôi trong vòng [thời hạn] kể từ khi nhận hàng.",
      "Điều kiện: [điều kiện, VD: chưa mặc, còn nguyên tem mác].",
      "Phí vận chuyển đổi trả: [bên chịu phí].",
    ],
  },
];

export default function ShippingReturnsPage() {
  return (
    <>
      <PageTitle eyebrow="Hỗ trợ" title="Vận chuyển & đổi trả" />
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 16 }}>
        {blocks.map((b) => (
          <div key={b.key} style={{ background: "var(--surface)", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{b.key}</span>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>{b.title}</span>
            {b.lines.map((l) => (
              <p key={l} style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "var(--muted)" }}>{l}</p>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}
