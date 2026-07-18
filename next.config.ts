import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // next/image's built-in optimizer hard-refuses upstream hosts that
    // resolve to a private/loopback IP (SSRF guard, not configurable via
    // remotePatterns) - and the API contract's own dev base URL is
    // "http://localhost:8787". Skip the optimizer entirely so local dev
    // (and any other private-network deployment of the backend) can still
    // load these images; a real public domain in production wouldn't hit
    // this at all.
    unoptimized: true,
  },
};

export default nextConfig;
