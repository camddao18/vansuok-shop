import type { Metadata } from "next";
import Link from "next/link";
import { formatVND } from "@/lib/money";
import { listAllProducts } from "@/lib/products";
import { toggleActive } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Products" };

const th = { textAlign: "left", padding: "12px 14px", fontSize: 12, whiteSpace: "nowrap" } as const;
const td = { padding: "12px 14px", borderTop: "1px solid #E9E7DF", fontSize: 14 } as const;
const small = { minHeight: 36, padding: "0 14px", fontSize: 13 } as const;

export default async function AdminProducts() {
  const products = await listAllProducts();
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(36px, 4.4vw, 60px)", letterSpacing: "-0.04em", fontWeight: 800 }}>Products ({products.length})</h1>
        <Link href="/admin/products/new" className="vs-btn">New product</Link>
      </div>
      <div style={{ overflowX: "auto", background: "var(--surface)", borderRadius: 28 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead>
            <tr className="mono"><th style={th}>NAME</th><th style={th}>COLLECTION</th><th style={th}>PRICE</th><th style={th}>STATUS</th><th style={th}>ACTIONS</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ ...td, fontWeight: 700 }}>{p.name}</td>
                <td style={td}>{p.collection}</td>
                <td style={td}>{formatVND(p.price)}</td>
                <td style={td}>{p.active ? "Visible" : "Hidden"}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/admin/products/${p.id}`} className="vs-tab" style={small}>Edit</Link>
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="vs-tab" style={small}>{p.active ? "Hide" : "Show"}</button>
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
