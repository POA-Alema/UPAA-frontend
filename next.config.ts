import type { NextConfig } from 'next';

const backendApiUrl =
  process.env.BACKEND_API_URL ??
  process.env.SERVER_API_URL ??
  'http://upaa-api-alb-741774205.us-east-2.elb.amazonaws.com';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_API_URL: backendApiUrl,
    SERVER_API_URL: backendApiUrl,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      }
    ]
  }
};

export default nextConfig;
