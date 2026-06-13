import type { NextConfig } from "next";

// When deploying to a GitHub Pages *project* site the app is served from a
// sub-path (e.g. /chychkan-real). The Pages workflow sets NEXT_PUBLIC_BASE_PATH
// so the build emits correct asset URLs; locally it stays empty so `next dev`
// serves from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    // Static export can't use the Next.js image optimizer.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

export default nextConfig;
