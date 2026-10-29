import type { NextConfig } from "next";
const upstream =
  process.env.MERGEFINITY_ORIGIN || "https://mergefinity.vercel.app";
const config: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    // fallback preserves the local service-worker adapter and real hub routes.
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        { source: "/mergefinity/:path*", destination: `${upstream}/:path*` },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/mergefinity/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "Service-Worker-Allowed", value: "/mergefinity/" },
        ],
      },
    ];
  },
};
export default config;
