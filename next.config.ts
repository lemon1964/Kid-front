import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    domains: ['localhost', 'kid-wlsf.onrender.com', 'kid-front.onrender.com', 'image.tmdb.org'],
  },
  reactStrictMode: false,
};

export default nextConfig;

