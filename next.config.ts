import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel production uchun optimized */
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;
