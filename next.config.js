/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'scss')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.datocms-assets.com',
        port: '',
        pathname: '/101470/**',
      },
    ],
  },
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = nextConfig;
