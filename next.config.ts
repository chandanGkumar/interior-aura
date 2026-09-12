import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Type errors must fail the build. They were previously ignored, which hid
  // three real null-safety bugs in cursor-effect.tsx.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Strict mode surfaces unsafe lifecycle and effect bugs during development.
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
