/**
 * Routes where we skip calling the global SEO API (SPA / auth).
 * Other pages get metadata from platform `seo_metadata.by-path` when configured.
 */
export function shouldFetchGlobalSeoForPathname(pathname: string): boolean {
  if (!pathname) return false;
  const p = pathname.split("?")[0] || "";
  if (
    p.startsWith("/api") ||
    p.startsWith("/_next") ||
    p.startsWith("/dashboard") ||
    p.startsWith("/account") ||
    p === "/login" ||
    p === "/register" ||
    p === "/signup" ||
    p === "/forget-password" ||
    p === "/verify-email" ||
    // Public certificate claim pages carry their own <Head> and are noindex, so the two SEO
    // round trips would only slow a cold visitor down. Matched exactly rather than by prefix:
    // p.startsWith("/certificate") would also swallow the existing /verify-certificate page.
    p === "/certificate" ||
    p.startsWith("/certificate/")
  ) {
    return false;
  }
  return true;
}
