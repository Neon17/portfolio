import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root (multiple lockfiles exist on this machine).
  turbopack: {
    root: path.join(__dirname),
  },
  // Static export so it can be dropped on Vercel / GitHub Pages / any static host.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
