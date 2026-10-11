# Vansuok Studio — Design handoff

Landing page + storefront for **Vansuok Studio**: profession-themed T-shirts, organised as one collection per trade (Trading, Navy, Nails…). Stickers, keychains and more merch come later.

`index.html` in this folder is the approved visual design: standalone HTML/CSS with a little JS for the collection filter. Treat it as the source of truth for look and feel and rebuild it as real components. Don't ship it as-is.

---

## Brief for Claude Code

> Build the Vansuok Studio online shop from `index.html` and this file.
> - Recreate the landing page pixel-faithfully as components (exact colors, fonts, radii, spacing from `index.html`).
> - Add: product listing per collection, product detail page (size picker S–XXL, color if any), cart, checkout with our **own payment flow**, order confirmation page.
> - Products must have a `category` field (`tshirt`, `sticker`, `keychain`, …) and a `collection` field (`trading`, `navy`, `nails`, …) so new merch types slot in without redesign.
> - Ask me before choosing the stack, database and payment provider. Propose 2–3 options with tradeoffs.

---

## Design tokens (palette "Signal")

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#F3F2EC` | Page ground (warm off-white) |
| `--surface` | `#FFFFFF` | Cards, nav pill |
| `--text` | `#111111` | Body text, outlines |
| `--muted` | `#45453F` | Secondary text |
| `--solid` / `--on-solid` | `#111111` / `#F3F2EC` | Black tiles, marquee, footer |
| `--btn` / `--on-btn` | `#111111` / `#FFFFFF` | Primary buttons |
| `--accent` / `--on-accent` | `#FF5B1F` / `#111111` | Signal orange. Always dark text on it, never white |
| `--second` / `--on-second` | `#2B44FF` / `#FFFFFF` | Cobalt blocks |
| `--deep` | `#16245E` | Navy collection |
| `--pop` | `#C6F432` | Lime highlight on black (Trading) |
| Product tints | `#E9E7DF` `#DCE9B0` `#D5DBF3` | Product image backgrounds |

Alternative palettes (Night Shift, Mint & Grape, Varsity) exist on the design canvas. Keep colors as CSS variables so a theme swap stays cheap.

**Type**
- Display and body: **Bricolage Grotesque** (Google Fonts, 400/500/700/800). Headlines are 800 weight with tight tracking (-0.04 to -0.045em) and line-height around 0.92.
- Labels and tags: **JetBrains Mono** (500/700), 12–13px, often uppercase with letter-spacing 0.08em.

**Shape and spacing**
- Radii: 999px for pills and buttons, 28–32px for cards, 40px for big blocks and the footer top, 20px for product images.
- Container is `max-width: 1360px` with 24px side padding. Grid gaps are 14–16px. Sections are spaced 80–120px apart.
- Touch targets are at least 44px. Responsive grids use `repeat(auto-fit, minmax(min(Npx,100%),1fr))`.

**Motion**
- Marquee scroll (28s linear).
- Spinning badge (14s).
- Cards lift 6px on hover.
- All motion is disabled under `prefers-reduced-motion`.

---

## Page sections (top → bottom)

1. **Header**: wordmark, pill nav (Collections · T-shirts · Merch · Suggest a trade · About), search, cart with count.
2. **Hero**: "T-shirts for every trade." with an inline tee pill, one primary CTA "Shop tees by trade", and a bento of a Trading tee, a Navy tile and a spinning "TEES ✦ STICKERS ✦ KEYCHAINS" badge.
3. **Marquee**: collection names plus "stickers & keychains soon".
4. **Collections**: one card per trade, plus a "Next trade?" card linking to the suggestion form.
5. **Fresh tees**: product grid with a collection filter (All / Trading / Navy / Nails) and add-to-cart buttons.
6. **More than a tee**: product-type cards (T-shirts available; Stickers, Keychains coming soon; & more).
7. **Promise strip**: fabric, print method, exchanges.
8. **Suggest a trade**: form with one text input that collects profession suggestions.
9. **Footer**: links, socials, studio info, giant VANSUOK wordmark.

## Placeholders to fill (real data needed)

`[PRICE]`, `[#] designs`, `[Fabric · weight]`, `[Print method]`, `[Return policy]`, `[Studio address]`, `[Email · Phone]`, social handles. Tee images are drawn SVG stand-ins. Replace them with real product photos at a square 1:1 ratio on the tint backgrounds.

## Checkout notes (to decide with the user)

- Vietnam-local payments: bank transfer via VietQR (for example payOS), MoMo, ZaloPay, VNPay, plus COD. A shop selling in Vietnam usually needs QR transfer and COD at minimum.
- Must have: guest checkout, shipping address form (province/district/ward), order status emails or SMS, admin order list.
- Payment confirmation should come from the provider's webhook, never from the client redirect alone.
