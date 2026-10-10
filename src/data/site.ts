/**
 * Store copy and contact details in one place.
 * TEMP: the "promise" texts below are placeholder wording. Replace with the real ones.
 * Anything still in [brackets] is real data we don't have yet (shown as-is on the site).
 */
export const PROMISES = [
  {
    key: "FABRIC",
    title: "Heavy fabric · 250gsm",
    note: "Thick and sturdy, it holds its shape. A tee that feels substantial.", // TEMP wording
  },
  {
    key: "PRINT",
    title: "[Print method]",
    note: "Made to last. Wash inside out in cold water and skip the dryer.", // TEMP wording
  },
  {
    key: "EXCHANGES",
    title: "Easy exchanges",
    note: "Size doesn't fit? Contact us after you receive your order. Time window and conditions: [to be confirmed].", // TEMP wording
  },
] as const;

export const STUDIO = {
  address: "[Studio address]",
  contact: "[Email · Phone]",
};

export const SOCIALS = [
  { name: "Instagram", handle: "[@handle]" },
  { name: "TikTok", handle: "[@handle]" },
  { name: "Facebook", handle: "[link]" },
];
