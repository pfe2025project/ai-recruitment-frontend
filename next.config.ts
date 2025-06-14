import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },{
        protocol: 'https',
        hostname: 'randomuser.me',
      },{
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },{
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },{
        protocol:'https',
        hostname:'cdn-icons-png.flaticon.com'
      }
    ],
  },
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.1.46:3000"],
};

export default nextConfig;
