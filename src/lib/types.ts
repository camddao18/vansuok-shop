export type CategoryId = "tshirt" | "sticker" | "keychain";
export type CollectionId = "trading" | "navy" | "nails";
export type Size = "S" | "M" | "L" | "XL" | "XXL";

export const SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];

export interface Category {
  id: CategoryId;
  name: string;
  label: string; // plural display name
  available: boolean;
  /** Variant axes this category uses on the product page. */
  hasSizes: boolean;
}

export interface Collection {
  id: CollectionId;
  number: string;
  name: string;
  tagline: string;
  blurb: string;
  designs: number;
  tint: string; // product image background
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  collection: CollectionId;
  /** Whole VND. */
  price: number;
  tint: string; // product image background
  /** Tee fill + ink used by the drawn stand-in artwork. */
  art: { shirt: string; ink: string };
  colors?: ColorOption[];
  description: string;
  /** If set, replaces the drawn stand-in. Square 1:1 photo. */
  image?: string;
}

export interface CartLine {
  productId: string;
  size?: Size;
  color?: string; // ColorOption.id
  qty: number;
}

/** Add providers here (e.g. "stripe") when international payments are wanted. */
export type PaymentMethod = "payos";
export type OrderStatus = "pending" | "paid" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  size?: Size;
  color?: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  code: number; // numeric: doubles as the payOS orderCode
  accessToken: string; // required to view the public confirmation page
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  customer: {
    name: string;
    phone: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    note: string;
  };
  paymentLinkId?: string;
  checkoutUrl?: string;
  createdAt: string;
}
