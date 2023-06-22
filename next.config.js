/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'scss')],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
