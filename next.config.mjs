// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    urlImports: ['https://cdn.skypack.dev'],
  },
  // ... other configs
};

export default nextConfig;
