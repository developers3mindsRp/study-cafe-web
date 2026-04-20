/**
 * Turn API / legacy paths into absolute URLs for <img src> / next/image.
 * - Full http(s) URLs are returned as-is.
 * - Protocol-relative `//host/...` → https (avoids edge cases with SSR).
 * - `/api/...` and `/uploads/...` are rooted on the API host from NEXT_PUBLIC_API_BASE_URL.
 * - WordPress-style `/wp-content/...` (and similar) use NEXT_PUBLIC_MEDIA_ORIGIN or NEXT_PUBLIC_SITE_URL
 *   when set, so images are not requested from the Next.js origin by mistake.
 */
export function resolveApiAssetUrl(path?: string | null): string {
  if (!path?.trim()) return "";
  const p = path.trim();

  if (p.startsWith("http://") || p.startsWith("https://")) return p;

  if (p.startsWith("//")) {
    return `https:${p}`;
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const origin = base.replace(/\/api\/?$/, "");

  const mediaOrigin =
    process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "";

  if (mediaOrigin && (p.startsWith("/wp-content/") || p.startsWith("/wp-includes/"))) {
    return `${mediaOrigin}${p}`;
  }

  if (p.startsWith("/api/")) {
    return origin ? `${origin}${p}` : p;
  }

  if (p.startsWith("/uploads/")) {
    return origin ? `${origin}/api${p}` : `/api${p}`;
  }

  return p;
}
