import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.86.49"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.workoscdn.com",
      },
    ],
  },
};

export default nextConfig;
