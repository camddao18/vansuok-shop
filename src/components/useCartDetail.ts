"use client";

import { useMemo } from "react";
import { getProduct } from "@/lib/catalog";
import { shippingFor } from "@/lib/money";
import type { CartLine, Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export interface DetailedLine {
  line: CartLine;
  product: Product;
  colorName?: string;
}

/** Cart lines joined with catalog data. Display only: the server re-prices at checkout. */
export function useCartDetail() {
  const cart = useCart();
  return useMemo(() => {
    const lines: DetailedLine[] = [];
    for (const line of cart.lines) {
      const product = getProduct(line.productId);
      if (!product) continue;
      lines.push({ line, product, colorName: product.colors?.find((c) => c.id === line.color)?.name });
    }
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.line.qty, 0);
    const shipping = shippingFor(subtotal);
    return { ...cart, details: lines, subtotal, shipping, total: subtotal + shipping };
  }, [cart]);
}
