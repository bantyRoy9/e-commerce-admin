import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Ignore TypeScript errors during production build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ignore ESLint errors during production build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;