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
    p === "/forget-password"
  ) {
    return false;
  }
  return true;
}
