import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export (HTML/CSS/JS in `out/`) for shared hosting on DonWeb
  output: "export",
  trailingSlash: true,
  // Production builds use their own dir so they don't clobber a running `next dev`
  distDir: process.env.NODE_ENV === "production" ? "out" : ".next",
};

export default nextConfig;
