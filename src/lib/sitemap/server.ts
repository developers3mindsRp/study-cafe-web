import { getServerApiBaseUrl, getSiteUrl } from '@/config/env';
import { buildArticlePublicPath } from '@/lib/articlePaths';
import { ARTICLES_PER_SITEMAP, NEWS_SITEMAP_ARTICLE_COUNT } from '@/lib/sitemap/constants';
import type { NewsSitemapUrlEntry, SitemapUrlEntry } from '@/lib/sitemap/xml';
import { toIsoDate } from '@/lib/sitemap/xml';

type ApiEnvelope<T> = { data?: T };

type ArticleRow = {
  id: number;
  title?: string;
  slug: string;
  published_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

type PaginatedArticles = {
  data: ArticleRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type CourseRow = {
  slug: string;
  updated_at?: string | null;
};

type PaginatedCourses = {
  data: CourseRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type CategoryRow = {
  slug: string;
};

async function fetchPlatform<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const base = getServerApiBaseUrl().replace(/\/$/, '');
  const url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Sitemap API ${path} failed: ${res.status}`);
  }
  const json = (await res.json()) as ApiEnvelope<T>;
  if (json.data == null) {
    throw new Error(`Sitemap API ${path} returned no data`);
  }
  return json.data;
}

export function absoluteSiteUrl(path: string): string {
  const site = getSiteUrl();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${site}${normalized}`;
}

export async function getPublishedArticleTotal(): Promise<number> {
  const result = await fetchPlatform<PaginatedArticles>('/platform/articles', { page: 1, limit: 1 });
  return result.total || 0;
}

export function getArticleSitemapPartCount(totalArticles: number): number {
  if (totalArticles <= 0) return 0;
  return Math.ceil(totalArticles / ARTICLES_PER_SITEMAP);
}

export async function buildArticleSitemapEntries(part: number): Promise<SitemapUrlEntry[]> {
  const safePart = Math.max(1, part);
  const startIndex = (safePart - 1) * ARTICLES_PER_SITEMAP;
  const entries: SitemapUrlEntry[] = [];
  const apiLimit = 100;
  let fetched = 0;
  let apiPage = Math.floor(startIndex / apiLimit) + 1;
  let skipInFirstPage = startIndex % apiLimit;

  while (fetched < ARTICLES_PER_SITEMAP) {
    const batch = await fetchPlatform<PaginatedArticles>('/platform/articles', {
      page: apiPage,
      limit: apiLimit,
    });
    const rows = batch.data || [];
    if (!rows.length) break;

    for (let i = skipInFirstPage; i < rows.length && fetched < ARTICLES_PER_SITEMAP; i += 1) {
      const row = rows[i];
      const path = buildArticlePublicPath(row.slug, row.id);
      if (!path) continue;
      entries.push({
        loc: absoluteSiteUrl(path),
        lastmod: toIsoDate(row.updated_at || row.published_at || row.created_at),
        changefreq: 'weekly',
        priority: 0.7,
      });
      fetched += 1;
    }

    skipInFirstPage = 0;
    apiPage += 1;
    if (apiPage > (batch.totalPages || 0)) break;
  }

  return entries;
}

/**
 * Google News sitemap: the most recently published articles only (Google News ignores
 * anything older than ~2 days, so this intentionally stays small — no pagination).
 * `/platform/articles` sorts by created_at, which can drift from published_at (e.g.
 * backdated posts), so we over-fetch and re-sort by published_at here to be safe.
 */
export async function buildNewsSitemapEntries(): Promise<NewsSitemapUrlEntry[]> {
  const overfetchLimit = Math.max(NEWS_SITEMAP_ARTICLE_COUNT * 2, 50);
  const batch = await fetchPlatform<PaginatedArticles>('/platform/articles', {
    page: 1,
    limit: overfetchLimit,
  });

  return (batch.data || [])
    .filter((row) => row.title && row.slug && row.published_at)
    .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime())
    .slice(0, NEWS_SITEMAP_ARTICLE_COUNT)
    .map((row) => {
      const path = buildArticlePublicPath(row.slug, row.id);
      if (!path) return null;
      return {
        loc: absoluteSiteUrl(path),
        title: row.title!,
        publicationDate: new Date(row.published_at!).toISOString(),
      };
    })
    .filter((entry): entry is NewsSitemapUrlEntry => entry != null);
}

export async function buildCourseSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const entries: SitemapUrlEntry[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const batch = await fetchPlatform<PaginatedCourses>('/courses/by-category', {
      page,
      limit: 24,
      sort: 'latest',
      price: 'all',
    });
    totalPages = batch.totalPages || 1;

    for (const course of batch.data || []) {
      if (!course.slug) continue;
      entries.push({
        loc: absoluteSiteUrl(`/course/${course.slug}`),
        lastmod: toIsoDate(course.updated_at),
        changefreq: 'weekly',
        priority: 0.8,
      });
    }

    page += 1;
  }

  return entries;
}

export async function buildCategorySitemapEntries(): Promise<SitemapUrlEntry[]> {
  const [articleCats, courseCats] = await Promise.all([
    fetchPlatform<CategoryRow[]>('/platform/article-categories').catch(() => [] as CategoryRow[]),
    fetchPlatform<CategoryRow[]>('/course-cats/all').catch(() => [] as CategoryRow[]),
  ]);

  const entries: SitemapUrlEntry[] = [];

  for (const cat of articleCats) {
    if (!cat.slug || cat.slug === 'all') continue;
    entries.push({
      loc: absoluteSiteUrl(`/category/${cat.slug}`),
      changefreq: 'daily',
      priority: 0.6,
    });
  }

  for (const cat of courseCats) {
    if (!cat.slug || cat.slug === 'all') continue;
    entries.push({
      loc: absoluteSiteUrl(`/course_cats/${cat.slug}`),
      changefreq: 'weekly',
      priority: 0.6,
    });
  }

  return entries;
}
