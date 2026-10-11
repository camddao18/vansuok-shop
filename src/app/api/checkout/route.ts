import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getCategory } from "@/lib/catalog";
import { getProduct } from "@/lib/products";
import { shippingFor } from "@/lib/money";
import { createOrder, updateOrder } from "@/lib/orders";
import { getSessionCustomer } from "@/lib/customer-session";
import { createPaymentLink } from "@/lib/payos";
import { SIZES, type Order, type OrderItem, type Size } from "@/lib/types";

export const runtime = "nodejs";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, any> | null;
  if (!body) return fail("Yêu cầu không hợp lệ.");

  // --- customer -----------------------------------------------------------
  const c = body.customer ?? {};
  const customer = {
    name: str(c.name, 100),
    phone: str(c.phone, 20).replace(/[\s.-]/g, ""),
    email: str(c.email, 150),
    province: str(c.province, 80),
    district: str(c.district, 80),
    ward: str(c.ward, 80),
    address: str(c.address, 200),
    note: str(c.note, 300),
  };
  if (!customer.name) return fail("Vui lòng nhập họ tên.");
  if (!/^(0|\+84)\d{9,10}$/.test(customer.phone)) return fail("Vui lòng nhập số điện thoại Việt Nam hợp lệ.");
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return fail("Email không hợp lệ.");
  if (!customer.province || !customer.ward || !customer.address)
    return fail("Vui lòng nhập đầy đủ địa chỉ giao hàng.");

  // --- cart: re-priced from the server catalog, client prices are ignored ----
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50)
    return fail("Giỏ hàng của bạn đang trống.");

  const items: OrderItem[] = [];
  for (const line of body.items) {
    const product = await getProduct(String(line?.productId));
    const qty = Number(line?.qty);
    if (!product?.active || !Number.isInteger(qty) || qty < 1 || qty > 20) return fail("Giỏ hàng có sản phẩm không hợp lệ.");
    if (!getCategory(product.category)?.available) return fail(`${product.name} chưa được bán.`);

    let size: Size | undefined;
    if (getCategory(product.category)?.hasSizes) {
      if (!SIZES.includes(line.size)) return fail(`Vui lòng chọn size cho ${product.name}.`);
      size = line.size;
    }
    let color: string | undefined;
    if (product.colors?.length) {
      if (!product.colors.some((x) => x.id === line.color)) return fail(`Vui lòng chọn màu cho ${product.name}.`);
      color = line.color;
    }
    items.push({ productId: product.id, name: product.name, size, color, qty, unitPrice: product.price });
  }

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const shippingFee = shippingFor(subtotal);
  const total = subtotal + shippingFee;

  const paymentMethod = body.paymentMethod === "cod" ? "cod" : "payos";

  const order: Order = {
    code: Number(`${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`),
    accessToken: randomBytes(16).toString("hex"),
    customerId: (await getSessionCustomer())?.id,
    status: "pending",
    paymentMethod,
    items,
    subtotal,
    shippingFee,
    total,
    customer,
    createdAt: new Date().toISOString(),
  };

  try {
    await createOrder(order);
  } catch (e) {
    console.error(e);
    return fail("Không thể lưu đơn hàng. Vui lòng thử lại.", 500);
  }

  const confirmPath = `/order/${order.code}?t=${order.accessToken}`;
  // COD: không cần cổng thanh toán, chuyển thẳng tới trang xác nhận.
  if (paymentMethod === "cod") return NextResponse.json({ redirect: confirmPath });
  // --- payOS ---------------------------------------------------------------
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin).replace(/\/$/, "");
  try {
    const link = await createPaymentLink({
      orderCode: order.code,
      amount: total,
      description: `DUCK ${String(order.code).slice(-8)}`,
      // payOS requires items to add up to amount, so shipping goes in as its own line.
      items: [
        ...items.map((i) => ({ name: `${i.name}${i.size ? ` (${i.size})` : ""}`, quantity: i.qty, price: i.unitPrice })),
        ...(shippingFee ? [{ name: "Phí vận chuyển", quantity: 1, price: shippingFee }] : []),
      ],
      returnUrl: `${site}${confirmPath}`,
      cancelUrl: `${site}${confirmPath}&cancelled=1`,
    });
    await updateOrder(order.code, { paymentLinkId: link.paymentLinkId, checkoutUrl: link.checkoutUrl });
    return NextResponse.json({ redirect: link.checkoutUrl });
  } catch (e) {
    console.error(e);
    await updateOrder(order.code, { status: "cancelled" }).catch(() => {});
    return fail("Không thể bắt đầu thanh toán. Vui lòng thử lại.", 502);
  }
}
