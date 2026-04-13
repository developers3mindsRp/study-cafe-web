import axios from "axios";
import type { ArticleBySlug, BlogSpotlightFeed } from "@/types/models.types";
import type { ApiResponse } from "@/types/api.types";

/** Read `auth_token` cookie from SSR `Cookie` header (matches js-cookie client name). */
export function bearerFromCookieHeader(cookieHeader?: string): string | undefined {
  if (!cookieHeader) return undefined;
  const m = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  if (!m) return undefined;
  try {
    return decodeURIComponent(m[1].trim());
  } catch {
    return m[1].trim();
  }
}

/** Server-side article fetch (pass-through membership logic on the API). */
export async function fetchArticleBySlugSSR(
  slug: string,
  opts: { baseUrl: string; token?: string }
): Promise<ArticleBySlug | null> {
  const base = opts.baseUrl.replace(/\/?$/, "");
  const url = `${base}/platform/articles/${encodeURIComponent(slug)}`;
  const headers: Record<string, string> = {};
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  try {
    const res = await axios.get<ApiResponse<ArticleBySlug>>(url, { headers, timeout: 12000 });
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}

const emptySpotlight: BlogSpotlightFeed = {
  hero: null,
  recent_posts: [],
  all_posts: [],
  author: null,
  author_recent_articles: [],
  popular_tags: [],
};

/** Blog landing / sidebar bundle (hero + lists + author + tags). */
export async function fetchBlogSpotlightSSR(opts: {
  baseUrl: string;
  token?: string;
  /** When set, sidebar + author are scoped to this article (excluded from lists); `hero` is null. */
  currentSlug?: string;
  recentLimit?: number;
  allLimit?: number;
  authorRecentLimit?: number;
  tagLimit?: number;
}): Promise<BlogSpotlightFeed> {
  const base = opts.baseUrl.replace(/\/?$/, "");
  const params = new URLSearchParams();
  if (opts.currentSlug?.trim()) params.set("current_slug", opts.currentSlug.trim());
  if (opts.recentLimit != null) params.set("recent_limit", String(opts.recentLimit));
  if (opts.allLimit != null) params.set("all_limit", String(opts.allLimit));
  if (opts.authorRecentLimit != null) params.set("author_recent_limit", String(opts.authorRecentLimit));
  if (opts.tagLimit != null) params.set("tag_limit", String(opts.tagLimit));
  const q = params.toString();
  const url = `${base}/platform/articles/blog-spotlight${q ? `?${q}` : ""}`;
  const headers: Record<string, string> = {};
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  try {
    const res = await axios.get<ApiResponse<BlogSpotlightFeed>>(url, { headers, timeout: 12000 });
    return res.data?.data ?? emptySpotlight;
  } catch {
    return emptySpotlight;
  }
}
