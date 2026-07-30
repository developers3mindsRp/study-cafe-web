import type { SeoMetadata } from "@/types/models.types";
import { getSiteUrl } from "@/config/env";

export const SITE_BRAND = "StudyCafe";

export const DEFAULT_META_DESCRIPTION =
  "Discover courses, study spaces, and learning resources on StudyCafe.";

export const DEFAULT_META_KEYWORDS = "StudyCafe, online courses, learning, study";

export const DEFAULT_ROBOTS = "index, follow";

/** Human-readable label from the last path segment, or "Home" for `/`. */
export function pathSegmentDisplayName(pathname: string): string {
  const trimmed = pathname.split("?")[0]?.replace(/\/+$/, "") || "";
  if (trimmed === "" || trimmed === "/") return "Home";
  const parts = trimmed.split("/").filter(Boolean);
  const last = parts[parts.length - 1] ?? "Page";
  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Default page title when the CMS/API has none (home is brand-only). */
export function defaultMetaTitleForPath(pathname: string): string {
  const label = pathSegmentDisplayName(pathname);
  if (label === "Home") return SITE_BRAND;
  return `${label} | ${SITE_BRAND}`;
}

/** Site origin, or `undefined` when `NEXT_PUBLIC_SITE_URL` is unset. */
function siteOrigin(): string | undefined {
  try {
    return getSiteUrl() || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Absolute URL for og/canonical tags. Course + article SEO rows store relative
 * paths (`/course/foo`); Facebook, LinkedIn and WhatsApp reject a relative
 * `og:url`/`og:image` and fall back to their cached scrape of the page.
 */
export function toAbsoluteUrl(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;

  const base = siteOrigin();
  if (!base) return null;
  return `${base}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

/** Absolute canonical when `NEXT_PUBLIC_SITE_URL` is set and API omitted one. */
export function defaultCanonicalUrlForPath(pathname: string): string | undefined {
  const base = siteOrigin();
  if (!base) return undefined;
  let path = pathname.split("?")[0] ?? "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path === "") path = "/";
  return `${base}${path}`;
}

/** Fill missing SEO fields from API with site defaults (API wins when present). */
export function mergeGlobalSeoDefaults(
  pathname: string,
  api: SeoMetadata | null
): SeoMetadata {
  const metaTitle =
    api?.metaTitle?.trim() || defaultMetaTitleForPath(pathname);
  const metaDescription =
    api?.metaDescription?.trim() || DEFAULT_META_DESCRIPTION;

  const pageSlugRaw = api?.pageSlug?.trim();
  const pageSlug =
    pageSlugRaw ||
    (pathname === "/" ? "/" : pathname.replace(/^\/+|\/+$/g, "") || "home");

  return {
    pageSlug,
    pageName: api?.pageName?.trim() || pathSegmentDisplayName(pathname),
    metaTitle,
    metaDescription,
    metaKeywords: api?.metaKeywords?.trim() || DEFAULT_META_KEYWORDS,
    robots: api?.robots?.trim() || DEFAULT_ROBOTS,
    canonicalUrl:
      toAbsoluteUrl(api?.canonicalUrl) ||
      defaultCanonicalUrlForPath(pathname) ||
      null,
    ogTitle: api?.ogTitle?.trim() || null,
    ogDescription: api?.ogDescription?.trim() || null,
    ogImageUrl: toAbsoluteUrl(api?.ogImageUrl),
  };
}
