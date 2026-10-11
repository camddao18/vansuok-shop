import { NextResponse } from "next/server";
import { addTradeSuggestion } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { trade?: unknown } | null;
  const trade = typeof body?.trade === "string" ? body.trade.trim().slice(0, 100) : "";
  if (trade.length < 2) return NextResponse.json({ error: "Hãy cho chúng tôi biết nghề nghiệp của bạn." }, { status: 400 });
  try {
    await addTradeSuggestion(trade);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Không thể lưu. Vui lòng thử lại." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
