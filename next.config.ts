import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'turquoise-worldwide-armadillo-75.mypinata.cloud',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'w7.pngwing.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
