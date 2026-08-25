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

/**
 * Membership tiers, mirroring `premium_plans.tier_rank`. The three slugs below
 * are the only values `user_memberships.membership_type` holds.
 */
export const PLAN_TIER: Record<string, number> = {
  basic: 1,
  premium: 2,
  ultimate: 3,
};

/** Basic still sees ads; premium and above do not. */
export const AD_FREE_MIN_TIER = 2;

/**
 * Fold display names and legacy plan values onto a canonical slug — mirrors
 * `normalizeMembershipSlug` in the API's `membershipViewer`. `/user/subscription`
 * swaps `membershipType` for the plan's display name once a membership is
 * active, so "Ultimate" and "Advanced Membership" both have to resolve here.
 */
export function normalizePlanSlug(value: string | null | undefined): string {
  const s = String(value ?? "").trim().toLowerCase();
  if (!s) return "";
  if (s.includes("ultimate")) return "ultimate";
  if (s.includes("premium") || s === "advanced") return "premium";
  if (s.includes("basic")) return "basic";
  return s;
}

/**
 * Whether a paying member's plan buys them an ad-free experience.
 *
 * Only meaningful for users who actually hold an active membership — callers
 * decide that first. An unrecognised or missing plan resolves to ad-free: a
 * new plan added later should default to the paid experience rather than
 * showing ads to someone who paid, which is the complaint this fixes.
 */
export function planHidesAds(membershipType: string | null | undefined): boolean {
  const slug = normalizePlanSlug(membershipType);
  if (!slug) return true;
  return (PLAN_TIER[slug] ?? AD_FREE_MIN_TIER) >= AD_FREE_MIN_TIER;
}

/** Shape of `/user/subscription`, narrowed to what the ad decision needs. */
export type AdViewerMembership = {
  hasActiveMembership?: boolean | null;
  /** Raw plan slug when the API sends it; falls back to the display name. */
  membershipSlug?: string | null;
  membershipType?: string | null;
};

/**
 * Ad decision for one viewer, ignoring the route.
 *
 * Free and logged-out readers see ads, and so do basic members; premium and
 * ultimate do not. Shared by the AdSense loader and the in-article CMS banners
 * so both answer the question the same way.
 */
export function viewerSeesAds(membership: AdViewerMembership | null | undefined): boolean {
  if (!membership?.hasActiveMembership) return true;
  return !planHidesAds(membership.membershipSlug ?? membership.membershipType);
}
