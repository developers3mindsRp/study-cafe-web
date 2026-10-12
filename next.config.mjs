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

  /**
   * Deploys build into a staging directory (NEXT_DIST_DIR) and only swap it
   * over `.next` once the build succeeded, so a failed build can never leave
   * the server with no production build at all. `next start` runs without the
   * variable set and therefore always serves `.next`.
   */
  distDir: process.env.NEXT_DIST_DIR || '.next',

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

      /**
       * WordPress-era URLs that still get traffic from old backlinks and
       * Google's index. All confirmed 404s in the nginx access log; none of
       * these paths has a route in `src/pages`, so nothing live is shadowed.
       * Temporary (302) where the old archive may be rebuilt later.
       */
      {
        source: '/tag/:slug',
        destination: '/blogs',
        permanent: false,
      },
      {
        source: '/author/:slug',
        destination: '/blogs',
        permanent: false,
      },
      {
        source: '/feed',
        destination: '/sitemap-news.xml',
        permanent: false,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/user',
        destination: '/account',
        permanent: false,
      },
    ];
  },
  images: {
    /**
     * Image optimizer switched OFF (Oct 2026). Every <Image> renders a plain <img> of the
     * original file, and /_next/image returns 404 without doing any work.
     *
     * The optimizer resizes on this same Node process that does SSR. Production has no
     * `sharp`, so it runs on the slow WASM fallback, and every deploy swaps `.next` and
     * with it `.next/cache/images` — so after each deploy every image is resized again.
     * When article pages were moved onto it, uncached resizes took 10s+ and page TTFB
     * went from <1s to 15–20s site-wide; reverting that alone did not recover it.
     *
     * Before turning this back on: install `sharp`, keep the image cache across deploys,
     * and add a Cloudflare cache rule for /_next/image.
     */
    unoptimized: true,
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
