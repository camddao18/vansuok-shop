// Registers the webhook URL with payOS (same as the SDKs' confirmWebhook).
// Usage: node --env-file=.env.local scripts/confirm-webhook.mjs https://<your-domain>/api/payos/webhook
const url = process.argv[2];
const { PAYOS_CLIENT_ID, PAYOS_API_KEY } = process.env;

if (!url || !/^https:\/\//.test(url)) {
  console.error("Pass the full https:// webhook URL as the first argument.");
  process.exit(1);
}
if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY) {
  console.error("PAYOS_CLIENT_ID / PAYOS_API_KEY missing. Put them in .env.local first.");
  process.exit(1);
}

const res = await fetch("https://api-merchant.payos.vn/confirm-webhook", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-client-id": PAYOS_CLIENT_ID, "x-api-key": PAYOS_API_KEY },
  body: JSON.stringify({ webhookUrl: url }),
});
console.log(res.status, await res.text());
