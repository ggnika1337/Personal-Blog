import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "personal-blog-project-kxgf.onrender.com",
      },
    ],
  },
};

export default nextConfig;
