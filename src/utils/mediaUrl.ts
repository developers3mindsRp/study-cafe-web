/**
 * Turn API-relative paths (e.g. `/api/uploads/...` from platform CMS) into an absolute URL
 * using NEXT_PUBLIC_API_BASE_URL so images load from the gateway, not the Next.js origin.
 */
export function resolveApiAssetUrl(path?: string | null): string {
  if (!path?.trim()) return "";
  const p = path.trim();
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  // Base is usually `http://localhost:3000/api` — strip trailing `/api` for origin
  const origin = base.replace(/\/api\/?$/, "");
  if (p.startsWith("/api/")) {
    return origin ? `${origin}${p}` : p;
  }
  return p;
}
