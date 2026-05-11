// next.config.mjs
/** @type {import('next').NextConfig} */

/**
 * Where `/api/*` rewrites are forwarded (StudyCafe api-gateway).
 * Default is port 3000 so the storefront can run on another port (`npm run dev` → 3001) without clashing.
 * If the gateway runs elsewhere, set API_GATEWAY_ORIGIN (e.g. http://127.0.0.1:3000).
 */
function resolveGatewayOrigin() {
  if (process.env.API_GATEWAY_ORIGIN) {
    return process.env.API_GATEWAY_ORIGIN.replace(/\/$/, "");
  }
  const pub = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (pub) {
    try {
      return new URL(pub).origin;
    } catch {
      /* fall through */
    }
  }
  return "http://127.0.0.1:3000";
}

const gatewayOrigin = resolveGatewayOrigin();

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
      // {
      //   source: "/account",
      //   destination: "/dashboard/profile",
      //   permanent: false,
      // },
      // {
      //   source: "/account/:path*",
      //   destination: "/dashboard/profile",
      //   permanent: false,
      // },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.studycafe.in",
        pathname: "/**",
      },
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
