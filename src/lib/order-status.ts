import type { Order, OrderStatus } from "./types";

/** Nhãn trạng thái đơn hàng bằng tiếng Việt. */
export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  shipped: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

export const PAYMENT_LABEL: Record<Order["paymentMethod"], string> = {
  payos: "Chuyển khoản (VietQR)",
  cod: "Thanh toán khi nhận hàng (COD)",
};

/** Đơn COD ở trạng thái "pending" nghĩa là chờ shop xác nhận, chưa phải chờ tiền. */
export const statusLabel = (o: Pick<Order, "status" | "paymentMethod">) =>
  o.status === "pending" && o.paymentMethod === "cod" ? "Chờ xác nhận" : STATUS_LABEL[o.status];

/**
 * Các chuyển trạng thái thủ công được phép. "paid" không bao giờ đặt bằng tay: chỉ webhook payOS làm được.
 * Đơn COD không qua "paid": xác nhận xong là giao luôn, tiền thu khi giao.
 */
export function nextStatuses(o: Pick<Order, "status" | "paymentMethod">): { to: OrderStatus; label: string }[] {
  switch (o.status) {
    case "pending":
      return o.paymentMethod === "cod"
        ? [{ to: "shipped", label: "Xác nhận & giao hàng" }, { to: "cancelled", label: "Hủy đơn" }]
        : [{ to: "cancelled", label: "Hủy đơn" }];
    case "paid":
      return [{ to: "shipped", label: "Đánh dấu đã giao vận" }];
    case "shipped":
      return [{ to: "completed", label: "Đánh dấu hoàn tất" }];
    default:
      return [];
  }
}
