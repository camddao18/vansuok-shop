/**
 * Store copy and contact details in one place.
 * TEMP: the "promise" texts below are placeholder wording. Replace with the real ones.
 * Anything still in [brackets] is real data we don't have yet (shown as-is on the site).
 */
export const PROMISES = [
  {
    key: "FABRIC",
    title: "Cotton 100% · 250gsm",
    note: "Vải dày dặn, đứng form, cầm lên là thấy chất. Thấm hút tốt, mặc cả ngày không bí.",
  },
  {
    key: "PRINT",
    title: "In DTF sắc nét, bền màu",
    note: "Màu lên chuẩn, mịn tay, giặt nhiều vẫn giữ hình. Giặt lộn trái bằng nước lạnh và không sấy để bền lâu.",
  },
  {
    key: "SHIPPING",
    title: "Freeship toàn quốc từ 500k",
    note: "Đơn từ 500.000đ được miễn phí giao hàng, từ Bắc vào Nam. Áo đóng gói kỹ, có mã theo dõi, giao trong [số ngày] ngày.",
  },
] as const;

export const STUDIO = {
  address: "[Địa chỉ studio]",
  contact: "[Email · Điện thoại]",
};

export const SOCIALS = [
  { name: "Instagram", handle: "[@handle]" },
  { name: "TikTok", handle: "[@handle]" },
  { name: "Facebook", handle: "[liên kết]" },
];
