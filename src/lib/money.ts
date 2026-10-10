const fmt = new Intl.NumberFormat("vi-VN");

export const formatVND = (n: number) => `${fmt.format(n)}₫`;

/** Flat shipping for now. TODO(owner): replace with real carrier rates. */
export const SHIPPING_FEE = 30000;
export const FREE_SHIPPING_OVER = 500000;

export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
