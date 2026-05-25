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
