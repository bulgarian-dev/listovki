/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["media.discordapp.net"],
  },
};

module.exports = nextConfig;
