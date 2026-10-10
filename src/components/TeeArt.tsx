import type { Product } from "@/lib/types";

const TEE = "M60 12 L82 4 Q100 20 118 4 L140 12 L192 42 L172 82 L150 70 L150 212 L50 212 L50 70 L28 82 L8 42 Z";

/** Drawn stand-in for product photos. Replaced by <img> when product.image is set. */
export function TeeArt({ product, width = "70%" }: { product: Product; width?: string }) {
  if (product.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />;
  }
  const { shirt, ink } = product.art;
  return (
    <svg viewBox="0 0 200 220" style={{ width }} role="img" aria-label={product.name}>
      <path d={TEE} fill={shirt} stroke="#88888855" strokeWidth="1.5" />
      {product.collection === "trading" && (
        <g>
          <line x1="82" y1="88" x2="82" y2="126" stroke={ink} strokeWidth="2" />
          <rect x="77" y="96" width="10" height="22" fill={ink} opacity="0.55" />
          <line x1="100" y1="78" x2="100" y2="120" stroke={ink} strokeWidth="2" />
          <rect x="95" y="84" width="10" height="28" fill={ink} />
          <line x1="118" y1="66" x2="118" y2="106" stroke={ink} strokeWidth="2" />
          <rect x="113" y="72" width="10" height="26" fill={ink} />
        </g>
      )}
      {product.collection === "navy" && (
        <g fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round">
          <circle cx="100" cy="74" r="7" />
          <path d="M100 81 L100 130 M86 94 L114 94 M78 112 Q100 146 122 112" />
        </g>
      )}
      {product.collection === "nails" && (
        <g fill={ink}>
          <circle cx="76" cy="104" r="8" />
          <circle cx="88" cy="84" r="8" />
          <circle cx="108" cy="78" r="8" />
          <circle cx="124" cy="94" r="8" />
          <rect x="94" y="100" width="12" height="34" rx="6" />
        </g>
      )}
    </svg>
  );
}

export { TEE as TEE_PATH };
