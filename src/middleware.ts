import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { shouldFetchGlobalSeoForPathname } from "@/lib/seo/seoRoutePolicy";

/**
 * Attach `x-studycafe-seo-json` (URL-encoded JSON) on the request when platform
 * returns SEO for this pathname. SSR and server code can read request headers;
 * the client also refreshes meta via `AppRouteSeo` on route changes.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);

  if (shouldFetchGlobalSeoForPathname(pathname)) {
    const apiBase = resolveApiBaseForEdge(request);
    const pathParam = pathname === "" ? "/" : pathname;
    const seoUrl = `${apiBase}/platform/seo-metadata/by-path?path=${encodeURIComponent(pathParam)}`;
    try {
      const fetchRes = await fetch(seoUrl, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (fetchRes.ok) {
        const body = (await fetchRes.json()) as { data?: Record<string, unknown> };
        const row = body?.data;
        if (row && typeof row === "object") {
          requestHeaders.set("x-studycafe-seo-json", encodeURIComponent(JSON.stringify(row)));
        }
      }
    } catch {
      /* non-blocking */
    }
  }

  /** WordPress-style public URLs: /{slug}-{id}.html → page at /blogs/[slug] */
  if (/^\/[^/]+\.html$/i.test(pathname)) {
    const inner = pathname.slice(1).replace(/\.html$/i, "");
    return NextResponse.rewrite(new URL(`/blogs/${inner}`, request.url), {
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

function resolveApiBaseForEdge(request: NextRequest): string {
  const pub = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (pub?.startsWith("http")) {
    let s = pub.replace(/\/+$/, "");
    if (!s.endsWith("/api")) s = `${s}/api`;
    return s;
  }
  const gateway = process.env.API_GATEWAY_ORIGIN?.trim();
  if (gateway?.startsWith("http")) {
    return `${gateway.replace(/\/+$/, "")}/api`;
  }
  const host = request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const isLocalHost =
    host.startsWith("localhost:") ||
    host.startsWith("127.0.0.1:") ||
    host === "localhost" ||
    host === "127.0.0.1";
  if (isLocalHost) {
    // Next.js runs on :3001 while api-gateway is on :3000. Using request Host here
    // pointed SSR/Edge fetches at Next's /api rewrite and caused proxy errors.
    return "http://127.0.0.1:3000/api";
  }
  return `${proto}://${host}/api`.replace(/\/+$/, "");
}

export const config = {
  matcher: [
    /*
     * Exclude static assets; run for normal document navigations only.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|map)$).*)",
  ],
};
