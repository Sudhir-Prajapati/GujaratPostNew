import type { NextConfig } from "next";
import fs from "fs";

// Fix Windows case-sensitivity path issues by forcing the process to use the real filesystem casing
try {
  const realCwd = fs.realpathSync.native(process.cwd());
  if (process.cwd() !== realCwd) {
    process.chdir(realCwd);
  }
} catch (e) {
  // Fallback in case realpathSync fails
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-tabs',
    ],
  },
  turbopack: {},

  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable memory-heavy packfile caching to prevent V8/OS allocation failures
      config.cache = false;
    }
    return config;
  },

  async rewrites() {
    const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    const backendUrl = rawUrl && rawUrl.startsWith('http')
      ? rawUrl.replace(/\/api\/?.*$/, '')
      : "http://127.0.0.1:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
