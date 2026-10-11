/** @type {import('next').NextConfig} */
const nextConfig = {
  // Admin product form uploads photos through a server action (limit enforced again in the action).
  experimental: { serverActions: { bodySizeLimit: "36mb" } },
};
export default nextConfig;
