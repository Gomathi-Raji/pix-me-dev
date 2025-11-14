import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      },
      {
        protocol: 'https',
        hostname: 'komarev.com',
      },
      {
        protocol: 'https',
        hostname: 'leetcard.jacoblin.cool',
      },
      {
        protocol: 'https',
        hostname: 'github-readme-stats.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'github-readme-activity-graph.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'streak-stats.demolab.com',
      },
      {
        protocol: 'https',
        hostname: 'github-profile-trophy.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
