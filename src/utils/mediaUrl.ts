export function resolveApiAssetUrl(path?: string | null): string {
  if (!path?.trim()) return "";
  const p = path.trim();

  if (p.startsWith("http://") || p.startsWith("https://")) return p;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const origin = base.replace(/\/api\/?$/, "");

  if (p.startsWith("/api/")) {
    return origin ? `${origin}${p}` : p;
  }

  if (p.startsWith("/uploads/")) {
    return origin ? `${origin}/api${p}` : `/api${p}`;
  }

  return p;
}
