/**
 * Turn API / legacy paths into absolute URLs for <img src> / next/image.
 *
 * - Full http(s) URLs: returned as-is, except `api` host URLs under `/api/uploads/`
 *   are rewritten to `NEXT_PUBLIC_ASSETS_ORIGIN` when set (e.g. https://assets.studycafe.in).
 * - Protocol-relative `//host/...` → https, then same rewrite rules.
 * - **Uploads** (`/api/uploads/...` or `/uploads/...`): prefer `NEXT_PUBLIC_ASSETS_ORIGIN`
 *   so images load from the CDN (e.g. https://assets.studycafe.in/api/uploads/...).
 * - Other `/api/...` paths: rooted on the API host from `NEXT_PUBLIC_API_BASE_URL`.
 * - WordPress-style `/wp-content/...` use `NEXT_PUBLIC_MEDIA_ORIGIN` or `NEXT_PUBLIC_SITE_URL`.
 */
export function resolveApiAssetUrl(path?: string | null): string {
  if (!path?.trim()) return "";
  const p = path.trim();

  if (p.startsWith("http://") || p.startsWith("https://")) {
    return rewriteUploadUrlToAssetsOrigin(p);
  }

  if (p.startsWith("//")) {
    return rewriteUploadUrlToAssetsOrigin(`https:${p}`);
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const origin = base.replace(/\/api\/?$/, "");
  const assetsOrigin =
    process.env.NEXT_PUBLIC_ASSETS_ORIGIN?.replace(/\/$/, "") || "";

  const mediaOrigin =
    process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "";

  if (mediaOrigin && (p.startsWith("/wp-content/") || p.startsWith("/wp-includes/"))) {
    return `${mediaOrigin}${p}`;
  }

  // CMS / platform uploads: same path as API, different host (CDN)
  if (p.startsWith("/api/uploads/")) {
    if (assetsOrigin) return `${assetsOrigin}${p}`;
    return origin ? `${origin}${p}` : p;
  }

  if (p.startsWith("/uploads/")) {
    if (assetsOrigin) return `${assetsOrigin}/api${p}`;
    return origin ? `${origin}/api${p}` : `/api${p}`;
  }

  if (p.startsWith("/api/")) {
    return origin ? `${origin}${p}` : p;
  }

  return p;
}

/**
 * If the DB or API still returns the API host for file URLs, map `/api/uploads/...`
 * to the assets / CDN origin when `NEXT_PUBLIC_ASSETS_ORIGIN` is set.
 */
function rewriteUploadUrlToAssetsOrigin(url: string): string {
  const assets = process.env.NEXT_PUBLIC_ASSETS_ORIGIN?.replace(/\/$/, "");
  if (!assets) return url;

  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/api/uploads/")) {
      return `${assets}${u.pathname}${u.search}${u.hash}`;
    }
  } catch {
    return url;
  }
  return url;
}
