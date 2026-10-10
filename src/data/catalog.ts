import type { Category, Collection, Product } from "@/lib/types";

/** New merch types: add a row here + products with that `category`. No layout changes needed. */
export const CATEGORIES: Category[] = [
  { id: "tshirt", name: "T-shirt", label: "T-shirts", available: true, hasSizes: true },
  { id: "sticker", name: "Sticker", label: "Stickers", available: false, hasSizes: false },
  { id: "keychain", name: "Keychain", label: "Keychains", available: false, hasSizes: false },
];

/** New trades: add a row here + products with that `collection`, plus an art entry in components/CollectionArt. */
export const COLLECTIONS: Collection[] = [
  {
    id: "trading",
    number: "01",
    name: "Trading",
    tagline: "For chart people",
    blurb: "For chart people: green candles, red candles and late nights watching orders.",
    designs: 2,
    tint: "#E9E7DF",
  },
  {
    id: "navy",
    number: "02",
    name: "Navy",
    tagline: "Sailor stripes, zero cringe.",
    blurb: "For those who sail and those who dream of it: stripes, anchors, sea charts.",
    designs: 2,
    tint: "#D5DBF3",
  },
  {
    id: "nails",
    number: "03",
    name: "Nails",
    tagline: "Steadiest hands in town",
    blurb: "For nail artists and salons: color swatches, fine brushes and the steadiest hands in town.",
    designs: 2,
    tint: "#FFD9C7",
  },
];

// TODO(owner): [PRICE] is not decided yet. 250.000₫ is a placeholder for every tee.
const PLACEHOLDER_TEE_PRICE = 250000;

const tee = (
  p: Omit<Product, "price" | "category" | "description"> & { description?: string },
): Product => ({
  category: "tshirt",
  price: PLACEHOLDER_TEE_PRICE,
  description: "Profession-themed unisex tee in heavy 250gsm fabric. Sizes S–XXL.",
  ...p,
});

export const PRODUCTS: Product[] = [
  tee({
    id: "trading-01", slug: "trading-tee-01", name: "Trading Tee — No. 01", collection: "trading",
    tint: "#E9E7DF", art: { shirt: "#111111", ink: "#C6F432" },
  }),
  tee({
    id: "navy-01", slug: "navy-tee-01", name: "Navy Tee — No. 01", collection: "navy",
    tint: "#D5DBF3", art: { shirt: "#16245E", ink: "#FFFFFF" },
  }),
  tee({
    id: "nails-01", slug: "nails-tee-01", name: "Nails Tee — No. 01", collection: "nails",
    tint: "#FFD9C7", art: { shirt: "#F7F6F1", ink: "#2B44FF" },
  }),
  tee({
    id: "trading-02", slug: "trading-tee-02", name: "Trading Tee — No. 02", collection: "trading",
    tint: "#DCE9B0", art: { shirt: "#F7F6F1", ink: "#111111" },
  }),
  tee({
    id: "navy-02", slug: "navy-tee-02", name: "Navy Tee — No. 02", collection: "navy",
    tint: "#E9E7DF", art: { shirt: "#F7F6F1", ink: "#16245E" },
  }),
  tee({
    id: "nails-02", slug: "nails-tee-02", name: "Nails Tee — No. 02", collection: "nails",
    tint: "#FFD9C7", art: { shirt: "#111111", ink: "#FF5B1F" },
  }),
];
