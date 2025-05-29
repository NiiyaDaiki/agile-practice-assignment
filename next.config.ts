import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
    scrollRestoration: true
  },
};

export default nextConfig;
