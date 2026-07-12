import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@react-pdf/renderer"],
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable filesystem caching to prevent Windows file-locking/rename warnings
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
