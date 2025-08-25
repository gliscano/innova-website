import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://res.cloudinary.com/innova54/**')
    ]
  }
};

export default nextConfig;
