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

  /**
   * The redirect lookup and the SEO lookup used to run as two separate awaited fetches,
   * one after the other. Middleware runs on every request and cannot be cached, so those
   * two round trips were added to the TTFB of every page — including pages that are
   * otherwise served straight from the ISR cache in a few milliseconds.
   *
   * They are independent queries against the same service, so they are now issued
   * together and awaited once: one round trip instead of two. The redirect still wins
   * when it matches; the SEO response is simply discarded on that path, which costs one
   * cheap query on the small minority of requests that actually redirect.
   */
  if (shouldFetchGlobalSeoForPathname(pathname)) {
    const apiBase = resolveApiBaseForEdge(request);
    const pathParam = pathname === "" ? "/" : pathname;
    const encodedPath = encodeURIComponent(pathParam);
    const json = { Accept: "application/json" };

    const [redirectRow, seoRow] = await Promise.all([
      fetchJson<{ new_path?: string; redirect_type?: string }>(
        `${apiBase}/platform/redirects/by-path?path=${encodedPath}`,
        json,
      ),
      fetchJson<Record<string, unknown>>(
        `${apiBase}/platform/seo-metadata/by-path?path=${encodedPath}`,
        json,
      ),
    ]);

    const newPath = redirectRow?.new_path?.trim();
    if (newPath) {
      const status = redirectRow?.redirect_type === "302" ? 302 : 301;
      return NextResponse.redirect(new URL(newPath, request.url), status);
    }

    if (seoRow && typeof seoRow === "object") {
      requestHeaders.set("x-studycafe-seo-json", encodeURIComponent(JSON.stringify(seoRow)));
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

/**
 * GET a `{ data: T }` endpoint and return `data`, or null for anything else.
 *
 * Never throws. Both call sites previously wrapped their fetch in a try/catch marked
 * "non-blocking", and that has to hold: if the SEO/redirect service is slow, down or
 * returns something unexpected, the page must still render. Returning null here means
 * "no redirect" and "no SEO override", which is the same fallback as before.
 */
async function fetchJson<T>(
  url: string,
  headers: Record<string, string>,
): Promise<T | null> {
  try {
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: T } | null;
    return body?.data ?? null;
  } catch {
    return null;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|ads.txt|sitemap|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|map|xml)$).*)",
  ],
};
