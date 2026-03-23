// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    urlImports: ['https://cdn.skypack.dev'],
  },
  async redirects() {
    return [
      { source: "/account", destination: "/dashboard/profile", permanent: false },
      { source: "/account/:path*", destination: "/dashboard/profile", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // ... other configs
};

export default nextConfig;
