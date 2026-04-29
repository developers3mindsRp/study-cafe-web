import type { SeoMetadata } from "@/types/models.types";

/**
 * Platform service returns snake_case from Sequelize; normalize to frontend SeoMetadata.
 */
export function normalizeSeoPayload(raw: Record<string, unknown> | null | undefined): SeoMetadata | null {
  if (!raw || typeof raw !== "object") return null;

  const pageSlug = String(raw.page_slug ?? raw.pageSlug ?? "");
  const metaTitle = String(raw.meta_title ?? raw.metaTitle ?? "").trim();
  const metaDescription = String(raw.meta_description ?? raw.metaDescription ?? "").trim();

  return {
    pageSlug,
    pageName: String(raw.page_name ?? raw.pageName ?? "").trim(),
    metaTitle,
    metaDescription,
    metaKeywords: (raw.meta_keywords ?? raw.metaKeywords) as string | undefined,
    robots: (raw.robots as string | undefined) || undefined,
    canonicalUrl: (raw.canonical_url ?? raw.canonicalUrl) as string | undefined,
    ogTitle: (raw.og_title ?? raw.ogTitle) as string | undefined,
    ogDescription: (raw.og_description ?? raw.ogDescription) as string | undefined,
    ogImageUrl: (raw.og_image_url ?? raw.ogImageUrl) as string | undefined,
  };
}

/** Path without query string; always starts with `/` or is `/` for home */
export function pathnameForSeoLookup(pathname: string): string {
  const path = pathname.split("?")[0] || "/";
  if (path === "") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}
