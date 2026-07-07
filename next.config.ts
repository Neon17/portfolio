import type { NextConfig } from "next";
import path from "path";

// On GitHub Pages the site is served from /<repo>, so it needs a basePath.
// Gated behind an env var so local `next dev` and other hosts stay at root.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "portfolio";

const nextConfig: NextConfig = {
  // Pin the workspace root (multiple lockfiles exist on this machine).
  turbopack: {
    root: path.join(__dirname),
  },
  // Static export so it can be dropped on Vercel / GitHub Pages / any static host.
  output: "export",
  images: { unoptimized: true },
  basePath: isPages ? `/${repo}` : undefined,
  assetPrefix: isPages ? `/${repo}/` : undefined,
};

export default nextConfig;
