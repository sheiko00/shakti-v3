import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REQUIRED for Docker production image.
  // Generates a self-contained server in .next/standalone —
  // no node_modules needed, resulting in a much smaller Docker image.
  output: "standalone",
};

export default nextConfig;
