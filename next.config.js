/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["host-two-ochre.vercel.app", "cdn.discordapp.com"],
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
};

module.exports = nextConfig;
