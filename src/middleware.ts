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

  if (!shouldFetchGlobalSeoForPathname(pathname)) {
    return NextResponse.next();
  }

  const apiBase = resolveApiBaseForEdge(request);
  const pathParam = pathname === "" ? "/" : pathname;
  const seoUrl = `${apiBase}/platform/seo-metadata/by-path?path=${encodeURIComponent(pathParam)}`;

  try {
    const res = await fetch(seoUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.next();

    const body = (await res.json()) as { data?: Record<string, unknown> };
    const row = body?.data;
    if (!row || typeof row !== "object") return NextResponse.next();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-studycafe-seo-json", encodeURIComponent(JSON.stringify(row)));
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    return NextResponse.next();
  }
}

function resolveApiBaseForEdge(request: NextRequest): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (raw?.startsWith("http")) {
    return raw.replace(/\/+$/, "");
  }
  const host = request.headers.get("host") ?? "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
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
