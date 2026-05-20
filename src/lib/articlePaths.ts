/**
 * Canonical public article URL: /{slug}-{id}.html (WordPress-style, site root).
 * Middleware rewrites that path to /blogs/{slug}-{id} for the Next.js page.
 */
export function buildArticlePublicPath(
  slug: string | null | undefined,
  id: number | string | null | undefined
): string | null {
  const s = (slug && String(slug).trim()) || "";
  const idNum = id != null && id !== "" ? Number(id) : NaN;
  if (!s || !Number.isFinite(idNum) || idNum <= 0) {
    return null;
  }
  return `/${s}-${idNum}.html`;
}

/** Blog listing routes under /blogs — not article detail. */
export const BLOG_RESERVED_SEGMENTS = new Set(["finance", "blog-detail"]);

export function isBlogArticleDetailSegment(segment: string): boolean {
  const s = String(segment || "").trim();
  if (!s || BLOG_RESERVED_SEGMENTS.has(s)) return false;
  return true;
}

/** True when pathname is the canonical article URL at site root. */
export function isCanonicalArticlePath(pathname: string): boolean {
  return /^\/[^/]+\.html$/i.test(pathname.split("?")[0] || "");
}
