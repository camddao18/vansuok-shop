"use server";

import { revalidatePath } from "next/cache";
import { getOrder, updateOrder } from "@/lib/orders";
import { nextStatuses } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";

export async function changeStatus(formData: FormData) {
  const code = Number(formData.get("code"));
  const to = String(formData.get("to")) as OrderStatus;
  const order = Number.isSafeInteger(code) ? await getOrder(code) : null;
  if (!order || !nextStatuses(order).some((s) => s.to === to)) return;
  await updateOrder(order.code, { status: to });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${order.code}`);
}
