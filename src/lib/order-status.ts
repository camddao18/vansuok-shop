import type { OrderStatus } from "./types";

/** Allowed manual moves. "paid" is never set by hand: only the payOS webhook can do that. */
export const NEXT_STATUS: Record<string, { to: OrderStatus; label: string }[]> = {
  pending: [{ to: "cancelled", label: "Cancel" }],
  paid: [{ to: "shipped", label: "Mark shipped" }],
  shipped: [{ to: "completed", label: "Mark completed" }],
};
