import type { SeoMetadata } from "@/types/models.types";

/**
 * Platform service returns snake_case from Sequelize; normalize to frontend SeoMetadata.
 */
export function normalizeSeoPayload(raw: Record<string, unknown> | null | undefined): SeoMetadata | null {
  if (!raw || typeof raw !== "object") return null;

  const pageSlug = String(raw.page_slug ?? raw.pageSlug ?? "");
  const metaTitle = String(raw.meta_title ?? raw.metaTitle ?? "").trim();
  const metaDescription = String(raw.meta_description ?? raw.metaDescription ?? "").trim();

  // Coalesce optional fields to `null` (never `undefined`) so the object stays
  // JSON-serializable for Next.js getStaticProps/getServerSideProps.
  const nn = (v: unknown): string | null =>
    v === undefined || v === null ? null : String(v);

  return {
    pageSlug,
    pageName: String(raw.page_name ?? raw.pageName ?? "").trim(),
    metaTitle,
    metaDescription,
    metaKeywords: nn(raw.meta_keywords ?? raw.metaKeywords),
    robots: nn(raw.robots),
    canonicalUrl: nn(raw.canonical_url ?? raw.canonicalUrl),
    ogTitle: nn(raw.og_title ?? raw.ogTitle),
    ogDescription: nn(raw.og_description ?? raw.ogDescription),
    ogImageUrl: nn(raw.og_image_url ?? raw.ogImageUrl),
  };
}

/**
 * Path without query string or hash; always starts with `/` or is `/` for home.
 *
 * The hash matters: AdSense appends `#google_vignette` to the URL when it shows
 * a mobile vignette, and `router.asPath` carries it. Left in, the SEO by-path
 * lookup misses and the page falls back to a title built from the raw
 * segment — readers saw `... 406139.Html#Google_vignette | StudyCafe`.
 */
export function pathnameForSeoLookup(pathname: string): string {
  const path = pathname.split(/[?#]/)[0] || "/";
  if (path === "") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

/** Decode SEO JSON attached by middleware (`x-studycafe-seo-json`). */
export function readMiddlewareSeoHeader(
  header: string | string[] | undefined
): SeoMetadata | null {
  const raw = Array.isArray(header) ? header[0] : header;
  if (!raw) return null;
  try {
    return normalizeSeoPayload(
      JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>
    );
  } catch {
    return null;
  }
}
