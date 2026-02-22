import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Prevent browser from caching protected app pages.
        // no-store disables bfcache so the back button can't restore a logged-in page.
        source: '/app/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
