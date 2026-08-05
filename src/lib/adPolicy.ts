/**
 * Single source of truth for where display ads are allowed to load.
 *
 * Allowlist, not blocklist: any route absent from this list gets no ads, so
 * new pages ship ad-free by default. The reverse — a global tag in
 * `_document` — is what put ads on the home, membership, course and profile
 * pages when AdSense was switched on.
 *
 * Entries are Next.js route patterns (`router.pathname`), not URLs, so one
 * entry covers every slug beneath it.
 */
export const AD_ALLOWED_ROUTES: readonly string[] = [
  // Blogs / articles
  "/blogs",
  "/blogs/[slug]",
  "/blogs/blog-detail",
  "/blogs/finance",
  "/category/[...slug]",

  // Case laws
  "/case-laws/[[...slug]]",

  // Downloads
  "/downloads",
  "/downloads/details",
  "/downloads/accounts",
  "/file/[slug]",
  "/files_cats/[slug]",
];

const ALLOWED = new Set(AD_ALLOWED_ROUTES);

/** True only on content routes cleared for ads; everything else is ad-free. */
export function shouldShowAds(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return ALLOWED.has(pathname);
}
