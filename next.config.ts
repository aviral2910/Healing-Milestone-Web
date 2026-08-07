import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.7', '192.168.1.15', 'localhost', '127.0.0.1'],
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
