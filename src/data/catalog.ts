import type { Category, Collection, Product } from "@/lib/types";

/** Loại phụ kiện mới: thêm một dòng ở đây + sản phẩm có `category` tương ứng. Không cần sửa bố cục. */
export const CATEGORIES: Category[] = [
  { id: "tshirt", name: "Áo thun", label: "Áo thun", available: true, hasSizes: true },
  { id: "sticker", name: "Sticker", label: "Sticker", available: false, hasSizes: false },
  { id: "keychain", name: "Móc khóa", label: "Móc khóa", available: false, hasSizes: false },
];

/** Nghề mới: thêm một dòng ở đây + sản phẩm có `collection` tương ứng, cùng một mục THEMES trong components/shop/CollectionCard. */
export const COLLECTIONS: Collection[] = [
  {
    id: "trading",
    number: "01",
    name: "Trading",
    tagline: "Thức khuya vì chart, không vì ai khác.",
    blurb: "Nến xanh là do mình giỏi, nến đỏ là do thị trường. Thêm một lệnh nữa thôi rồi đi ngủ.",
    designs: 2,
    tint: "#E9E7DF",
  },
  {
    id: "navy",
    number: "02",
    name: "Navy",
    tagline: "Sóng gió quen rồi, bờ mới lạ",
    blurb: "Sóng lớn thì bảo “êm mà”. Mỏ neo, sọc kẻ, hải đồ cho người sống nửa đời trên biển.",
    designs: 2,
    tint: "#D5DBF3",
  },
  {
    id: "nails",
    number: "03",
    name: "Nails",
    tagline: "Một tay cầm cọ, cả phố đổi màu.",
    blurb: "Khách bảo “màu này hơi khác ảnh”. Bảng màu, cọ mảnh và đôi tay vững nhất phố.",
    designs: 2,
    tint: "#DCE9B0",
  },
];

// TODO(owner): [GIÁ] chưa quyết định. 250.000₫ là giá tạm cho mọi áo.
const PLACEHOLDER_TEE_PRICE = 250000;

const tee = (
  p: Omit<Product, "price" | "category" | "description" | "active"> & { description?: string },
): Product => ({
  category: "tshirt",
  active: true,
  price: PLACEHOLDER_TEE_PRICE,
  description: "Áo thun unisex theo chủ đề nghề nghiệp, vải dày 250gsm. Size S–XL.",
  ...p,
});

/** Dữ liệu mẫu cho cửa hàng trống (lần chạy đầu). Sau đó bảng products / .data/products.json là nguồn dữ liệu chính. */
export const SEED_PRODUCTS: Product[] = [
  tee({
    id: "trading-01", slug: "trading-tee-01", name: "Áo thun Trading — Mẫu 01", collection: "trading",
    tint: "#E9E7DF", art: { shirt: "#111111", ink: "#C6F432" },
  }),
  tee({
    id: "navy-01", slug: "navy-tee-01", name: "Áo thun Navy — Mẫu 01", collection: "navy",
    tint: "#D5DBF3", art: { shirt: "#16245E", ink: "#FFFFFF" },
  }),
  tee({
    id: "nails-01", slug: "nails-tee-01", name: "Áo thun Nails — Mẫu 01", collection: "nails",
    tint: "#DCE9B0", art: { shirt: "#F7F6F1", ink: "#2B44FF" },
  }),
  tee({
    id: "trading-02", slug: "trading-tee-02", name: "Áo thun Trading — Mẫu 02", collection: "trading",
    tint: "#DCE9B0", art: { shirt: "#F7F6F1", ink: "#111111" },
  }),
  tee({
    id: "navy-02", slug: "navy-tee-02", name: "Áo thun Navy — Mẫu 02", collection: "navy",
    tint: "#E9E7DF", art: { shirt: "#F7F6F1", ink: "#16245E" },
  }),
  tee({
    id: "nails-02", slug: "nails-tee-02", name: "Áo thun Nails — Mẫu 02", collection: "nails",
    tint: "#D5DBF3", art: { shirt: "#111111", ink: "#C6F432" },
  }),
];
