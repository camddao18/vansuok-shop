/** @type {import('next').NextConfig} */
const nextConfig = {
  // Admin product form uploads a photo through a server action (limit enforced again in the action).
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
};
export default nextConfig;
