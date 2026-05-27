import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  async rewrites() {
    return [
      // Proxy all summarizer API requests to the backend
      {
        source: "/api/summarize/:path*",
        destination: "http://localhost:8000/api/summarize/:path*",
      },
      // Proxy PDF preview requests to the backend
      {
        source: "/api/pdf/:path*",
        destination: "http://localhost:8000/api/pdf/:path*",
      },
    ];
  },
};

export default nextConfig;
