/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["host-two-ochre.vercel.app"],
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
};

module.exports = nextConfig;
