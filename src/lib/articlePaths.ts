/**
 * WordPress-style public article path: /{slug}-{id}.html (root).
 * Middleware rewrites to /blogs/{slug}-{id} for the Next.js dynamic page.
 */
export function buildArticlePublicPath(
  slug: string | null | undefined,
  id: number | string | null | undefined
): string {
  const s = (slug && String(slug).trim()) || "article";
  const idNum = id != null && id !== "" ? Number(id) : NaN;
  if (!Number.isFinite(idNum) || idNum <= 0) {
    return `/blogs/${encodeURIComponent(s)}`;
  }
  return `/${s}-${idNum}.html`;
}
