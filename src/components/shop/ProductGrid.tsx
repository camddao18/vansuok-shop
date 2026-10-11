"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const PER_PAGE = 4;
const MOBILE = "(max-width: 559px)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(MOBILE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Lưới sản phẩm. Từ 560px trở lên là lưới thường; trên điện thoại mỗi trang chỉ có 4 sản phẩm (2×2)
 * và vuốt ngang để sang 4 sản phẩm tiếp theo thay vì kéo dài đến hết.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  const mobile = useSyncExternalStore(subscribe, () => window.matchMedia(MOBILE).matches, () => false);
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += PER_PAGE) pages.push(products.slice(i, i + PER_PAGE));

  // Đổi bộ lọc thì quay về trang đầu
  const key = products.map((p) => p.id).join("|");
  useEffect(() => {
    setPage(0);
    track.current?.scrollTo({ left: 0 });
  }, [key]);

  if (!mobile || pages.length <= 1) {
    return (
      <div className="vs-pgrid">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    );
  }

  const go = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={track}
        className="vs-pslider"
        onScroll={(e) => {
          const el = e.currentTarget;
          setPage(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {pages.map((items, i) => (
          <div key={i} className="vs-pgrid vs-ppage" aria-label={`Trang ${i + 1}/${pages.length}`}>
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ))}
      </div>
      <div className="vs-pdots" role="group" aria-label="Chuyển trang sản phẩm">
        {pages.map((_, i) => (
          <button key={i} type="button" aria-label={`Trang ${i + 1}`} aria-current={i === page} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}
