import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: true,   // ← tambahkan ini
  },
};

export default nextConfig;
