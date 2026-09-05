/**
 * Turn API / legacy paths into absolute URLs for <img src> / next/image.
 *
 * Config from .env only — see src/config/env.ts and .env.example.
 */
import {
  getApiServerOrigin,
  getAssetsOrigin,
  getMediaOrigin,
} from '@/config/env';

/** Remote hosts the next/image optimizer is known to handle in production.
 *
 *  Remote URLs were bypassing the optimizer wholesale, because it runs on the Next server
 *  and had been failing for some cross-origin fetches (timeouts, IP rules, SSL). The cost
 *  was that every CMS image — hero, promo popup — shipped at full size in its original
 *  format.
 *
 *  Re-checked against production: /_next/image against assets.studycafe.in returns
 *  200 image/webp, cache-HIT, for both the hero and the popup asset. Optimization is
 *  enabled for that one host; every other remote host keeps the old bypass. If the
 *  optimizer ever regresses for the CMS, empty this array to restore the previous
 *  behaviour everywhere at once. */
export const OPTIMIZER_SAFE_REMOTE_HOSTS = ['assets.studycafe.in'];

/** Whether `src` must skip the next/image optimizer. Local /public assets never do. */
export function isUnoptimizedImageSrc(src: string): boolean {
  if (!/^https?:\/\//i.test(src)) return false;
  try {
    return !OPTIMIZER_SAFE_REMOTE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return true; // unparseable URL: bypass rather than risk a broken image
  }
}

export function resolveApiAssetUrl(path?: string | null): string {
  if (!path?.trim()) return '';
  const p = path.trim();

  if (p.startsWith('http://') || p.startsWith('https://')) {
    return rewriteUploadUrlToAssetsOrigin(p);
  }

  if (p.startsWith('//')) {
    return rewriteUploadUrlToAssetsOrigin(`https:${p}`);
  }

  const origin = getApiServerOrigin();
  const assetsOrigin = getAssetsOrigin();
  const mediaOrigin = getMediaOrigin();

  if (mediaOrigin && (p.startsWith('/wp-content/') || p.startsWith('/wp-includes/'))) {
    return `${mediaOrigin}${p}`;
  }

  if (p.startsWith('/api/uploads/')) {
    if (assetsOrigin) return `${assetsOrigin}${p}`;
    return `${origin}${p}`;
  }

  if (p.startsWith('/uploads/')) {
    if (assetsOrigin) return `${assetsOrigin}/api${p}`;
    return `${origin}/api${p}`;
  }

  if (p.startsWith('/api/')) {
    return `${origin}${p}`;
  }

  return p;
}

function rewriteUploadUrlToAssetsOrigin(url: string): string {
  const assets = getAssetsOrigin();
  if (!assets) return url;

  try {
    const u = new URL(url);
    if (u.pathname.startsWith('/api/uploads/')) {
      return `${assets}${u.pathname}${u.search}${u.hash}`;
    }
  } catch {
    return url;
  }
  return url;
}

/**
 * Resolve a CMS image path and wrap it as a CSS `background-image` value, falling
 * back to `fallbackSrc` when nothing is set.
 *
 * These backgrounds cannot be Tailwind arbitrary classes: Tailwind compiles class
 * names at build time, so a `bg-[url(...)]` can never reflect a CMS value. They have
 * to be inline styles, which means the URL is interpolated into a CSS string — quotes
 * and backslashes are escaped so a crafted filename cannot close the url() and inject
 * further declarations.
 */
export function resolveCssBackgroundImage(
  path: string | null | undefined,
  fallbackSrc: string,
): string {
  const resolved = path ? resolveApiAssetUrl(path) || path : '';
  const src = resolved || fallbackSrc;
  return `url("${src.replace(/["\\]/g, (c) => `\\${c}`)}")`;
}
