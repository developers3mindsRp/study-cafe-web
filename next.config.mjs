// next.config.mjs
/** @type {import('next').NextConfig} */

function requiredEnv(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    throw new Error(
      `Missing ${name} in study-cafe-web/.env (see .env.example).`,
    );
  }
  return String(v).trim();
}

const gatewayOrigin = requiredEnv('API_GATEWAY_ORIGIN').replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    urlImports: ['https://cdn.skypack.dev'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${gatewayOrigin}/api/:path*`,
      },
      {
        source: '/:slug.html',
        destination: '/blogs/:slug',
      },
      {
        source: '/sitemap/articles/:page.xml',
        destination: '/sitemap/articles/:page',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/course-detailPage',
        destination: '/courses',
        permanent: true,
      },
      {
        source: '/category',
        destination: '/blogs',
        permanent: false,
      },
      {
        source: '/course_cats',
        destination: '/courses',
        permanent: false,
      },
      {
        source: '/blogs/:slug.html',
        destination: '/:slug.html',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.studycafe.in',
        pathname: '/**',
      },
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
};

export default nextConfig;
