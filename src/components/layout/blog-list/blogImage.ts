import { resolveApiAssetUrl } from "@/utils/mediaUrl";

/**
 * Turn API-relative paths (e.g. `/uploads/...`) into a browser-loadable absolute URL.
 * Protocol-relative `//host/...` becomes `https://...` so `<img>` always loads.
 */
export function resolveBlogImageSrc(url?: string | null): string {
  const raw = (url ?? "").trim();
  if (!raw) return "";
  let out = resolveApiAssetUrl(raw) || raw;
  out = out.trim();
  if (out.startsWith("//")) return `https:${out}`;
  return out;
}

/** Fallback thumbnail for cards / hero when missing. */
export function cardThumb(url?: string | null): string {
  const resolved = resolveBlogImageSrc(url);
  return resolved || "/images/s-court.png";
}
