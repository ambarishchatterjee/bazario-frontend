import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ skip ESLint in production build
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bazario-backend-vmlz.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
