import type { Metadata } from "next";
import Link from "next/link";
import { formatVND } from "@/lib/money";
import { listAllProducts } from "@/lib/products";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { deleteProductAction, toggleActive } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sản phẩm" };

const th = { textAlign: "left", padding: "12px 14px", fontSize: 12, whiteSpace: "nowrap" } as const;
const td = { padding: "12px 14px", borderTop: "1px solid #E9E7DF", fontSize: 14 } as const;
const small = { minHeight: 36, padding: "0 14px", fontSize: 13 } as const;

export default async function AdminProducts() {
  const products = await listAllProducts();
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(26px, 2.6vw, 34px)", letterSpacing: "-0.04em", fontWeight: 800 }}>Sản phẩm ({products.length})</h1>
        <Link href="/admin/products/new" className="vs-btn">Thêm sản phẩm</Link>
      </div>
      <div style={{ overflowX: "auto", background: "var(--surface)", borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead>
            <tr className="mono"><th style={th}>SẢN PHẨM</th><th style={th}>BỘ SƯU TẬP</th><th style={th}>GIÁ</th><th style={th}>TRẠNG THÁI</th><th style={th}>THAO TÁC</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ ...td, fontWeight: 700 }}>{p.name}</td>
                <td style={td}>{p.collection}</td>
                <td style={td}>{formatVND(p.price)}</td>
                <td style={td}><span className={`vs-chip ${p.active ? "vs-chip-on" : "vs-chip-off"}`}>{p.active ? "Hiển thị" : "Đã ẩn"}</span></td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/admin/products/${p.id}`} className="vs-tab" style={small}>Sửa</Link>
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={p.id} />
                      <SubmitButton className="vs-tab" style={small} pendingText="Đang lưu…">{p.active ? "Ẩn" : "Hiện"}</SubmitButton>
                    </form>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <SubmitButton className="vs-tab vs-tab-danger" style={small} pendingText="Đang xóa…" confirm={`Xóa sản phẩm "${p.name}"? Không thể hoàn tác.`}>Xóa</SubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
