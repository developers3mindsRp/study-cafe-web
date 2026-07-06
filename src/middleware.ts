import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { shouldFetchGlobalSeoForPathname } from "@/lib/seo/seoRoutePolicy";
import {
  BLOG_RESERVED_SEGMENTS,
  isBlogArticleDetailSegment,
} from "@/lib/articlePaths";
import { getPublicApiBaseUrl } from "@/config/env";

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

  /** /blogs/{slug}-{id}.html → /{slug}-{id}.html (canonical) */
  const blogsHtml = pathname.match(/^\/blogs\/([^/]+\.html)$/i);
  if (blogsHtml && isBlogArticleDetailSegment(blogsHtml[1].replace(/\.html$/i, ""))) {
    return NextResponse.redirect(new URL(`/${blogsHtml[1]}`, request.url), 308);
  }

  /** /blogs/{slug}-{id} → /{slug}-{id}.html when segment ends with numeric id */
  const blogsArticle = pathname.match(/^\/blogs\/([^/]+)$/);
  if (blogsArticle) {
    const segment = blogsArticle[1];
    if (
      isBlogArticleDetailSegment(segment) &&
      !BLOG_RESERVED_SEGMENTS.has(segment) &&
      /-\d+$/.test(segment)
    ) {
      return NextResponse.redirect(new URL(`/${segment}.html`, request.url), 308);
    }
  }

  /**
   * Canonical article URLs: /{slug}-{id}.html
   * Rewrite is handled in next.config.mjs. Pass the browser path to GSSP so it
   * does not redirect /blogs/... → .html → /blogs/... (308 loop).
   */
  if (/^\/[^/]+\.html$/i.test(pathname)) {
    requestHeaders.set("x-studycafe-public-path", pathname);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

function resolveApiBaseForEdge(_request: NextRequest): string {
  return getPublicApiBaseUrl();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|map|xml)$).*)",
  ],
};
