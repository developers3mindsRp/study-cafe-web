// next.config.mjs
/** @type {import('next').NextConfig} */

const gatewayOrigin =
  process.env.API_GATEWAY_ORIGIN || "http://127.0.0.1:3000";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    urlImports: ["https://cdn.skypack.dev"],
  },
  /** Proxy /api on the Next dev server to the gateway so SSR and same-origin /api work on any port */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${gatewayOrigin.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/course-detailPage",
        destination: "/courses",
        permanent: true,
      },
      {
        source: "/account",
        destination: "/dashboard/profile",
        permanent: false,
      },
      {
        source: "/account/:path*",
        destination: "/dashboard/profile",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
