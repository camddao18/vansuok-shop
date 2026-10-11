import Link from "next/link";
import { COLLECTIONS } from "@/data/catalog";
import { SOCIALS, STUDIO } from "@/data/site";

const head = { fontSize: 13, opacity: 0.65 } as const;
const col = { display: "flex", flexDirection: "column", gap: 10 } as const;
const link = { textDecoration: "none" } as const;

export function Footer() {
  return (
    <footer style={{ background: "var(--solid)", color: "var(--on-solid)", borderRadius: "40px 40px 0 0", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 32 }}>
          <div style={col}>
            <span className="mono" style={head}>BỘ SƯU TẬP</span>
            {COLLECTIONS.map((c) => (
              <Link key={c.id} href={`/collections/${c.id}`} style={link}>{c.name}</Link>
            ))}
          </div>
          <div style={col}>
            <span className="mono" style={head}>HỖ TRỢ</span>
            <Link href="/size-guide" style={link}>Hướng dẫn chọn size</Link>
            <Link href="/shipping-returns" style={link}>Vận chuyển &amp; đổi trả</Link>
            <Link href="/#about" style={link}>Liên hệ</Link>
            <Link href="/account" style={link}>Theo dõi đơn hàng</Link>
          </div>
          <div style={col}>
            <span className="mono" style={head}>THEO DÕI</span>
            {SOCIALS.map((s) => (
              <span key={s.name}>{s.name} {s.handle}</span>
            ))}
          </div>
          <div style={col}>
            <span className="mono" style={head}>STUDIO</span>
            <span>{STUDIO.address}</span>
            <span>{STUDIO.contact}</span>
          </div>
        </div>
        <img src="/logo-white.png" alt="Duck Delivery" width={1682} height={1525} style={{ height: 100, width: "auto", display: "block", alignSelf: "flex-start" }} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, fontSize: 14, opacity: 0.65 }}>
          <span>© Duck Delivery</span>
          <span>Áo thun &amp; phụ kiện cho mọi nghề.</span>
        </div>
      </div>
    </footer>
  );
}
