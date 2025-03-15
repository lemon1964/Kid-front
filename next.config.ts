import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXTAUTH_URL: "http://localhost:3000", // или ваш домен
  },
  images: {
    domains: ['localhost', 'kid-wlsf.onrender.com'], // список разрешенных доменов
  },
  reactStrictMode: false,
};

export default nextConfig;
