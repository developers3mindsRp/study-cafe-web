// next.config.mjs
/** @type {import('next').NextConfig} */

function buildImageRemotePatterns() {
  /** @type {import('next/dist/shared/lib/image-config').RemotePattern[]} */
  const patterns = [];
  const seen = new Set();

  const push = (protocol, hostname, port, pathname = "/**") => {
    if (!hostname) return;
    const key = `${protocol}://${hostname}:${port || "default"}:${pathname}`;
    if (seen.has(key)) return;
    seen.add(key);
    patterns.push({
      protocol,
      hostname,
      ...(port ? { port } : {}),
      pathname,
    });
  };

  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (base) {
    try {
      const u = new URL(base);
      push(
        u.protocol.replace(":", ""),
        u.hostname,
        u.port || undefined,
        "/**"
      );
    } catch {
      /* ignore bad env */
    }
  }

  push("https", "api.studycafe.in", undefined, "/**");
  push("http", "localhost", "3000", "/**");
  push("http", "127.0.0.1", "3000", "/**");

  return patterns;
}

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    urlImports: ["https://cdn.skypack.dev"],
  },
  async redirects() {
    return [
      { source: "/account", destination: "/dashboard/profile", permanent: false },
      { source: "/account/:path*", destination: "/dashboard/profile", permanent: false },
    ];
  },
  images: {
    remotePatterns: buildImageRemotePatterns(),
  },
};

export default nextConfig;
