import axiosInstance from '@/lib/axios';
import {
  HomePageData,
  Membership,
  FAQ,
  Testimonial,
  PageContent,
  SeoMetadata,
  ArticleBySlug,
  BlogSpotlightArticleCard,
  BlogSpotlightFeed,
  CourseCat,
  PublicCourse,
  Course,
  PaginatedCourses,
  CoursePublicDetail,
  CourseBatch,
} from '@/types/models.types';
import { ApiResponse } from '@/types/api.types';
import { shouldUseMock } from '@/config/app.config';
import { mockPlatformApi } from '@/mocks/api.mock';

/**
 * Platform Service
 * Fetches public website data: home page, memberships, FAQ, testimonials, page content, SEO.
 * Use for landing page, pricing, about, contact, and other static/cms content.
 */

/** Home page: hero, features, stats, highlight */
export const getHomePageData = async (): Promise<HomePageData> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getHomePageData();
  }
  const response = await axiosInstance.get<ApiResponse<HomePageData>>(
    '/platform/home'
  );
  return response.data.data;
};

/** All active membership plans (for pricing page) */
export const getMemberships = async (): Promise<Membership[]> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getMemberships();
  }
  const response = await axiosInstance.get<ApiResponse<Membership[]>>(
    '/platform/memberships'
  );
  return response.data.data;
};

/** Single membership plan by slug (for plan detail / checkout page) */
export const getMembershipBySlug = async (slug: string): Promise<Membership | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Membership>>(
      `/platform/plans/${encodeURIComponent(slug)}`
    );
    return response.data.data;
  } catch {
    return null;
  }
};

/** FAQ list (for FAQ page or accordion) */
export const getFaq = async (): Promise<FAQ[]> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getFaq();
  }
  const response = await axiosInstance.get<ApiResponse<FAQ[]>>(
    '/platform/faq'
  );
  return response.data.data;
};

/** Testimonials (for home or testimonials page) */
export const getTestimonials = async (limit?: number): Promise<Testimonial[]> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getTestimonials(limit);
  }
  const response = await axiosInstance.get<ApiResponse<Testimonial[]>>(
    '/platform/testimonials',
    limit != null ? { params: { limit } } : undefined
  );
  return response.data.data;
};

/** Single CMS page by slug (e.g. about, contact, privacy-policy, terms-of-use) */
export const getPageContent = async (slug: string): Promise<PageContent | null> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getPageContent(slug);
  }
  try {
    const response = await axiosInstance.get<ApiResponse<PageContent>>(
      `/platform/cms-pages/${encodeURIComponent(slug)}`
    );
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

/** SEO metadata for a page (for meta tags, OG, etc.) */
export const getSeoMetadata = async (
  pageSlug: string
): Promise<SeoMetadata | null> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getSeoMetadata(pageSlug);
  }
  try {
    const response = await axiosInstance.get<ApiResponse<SeoMetadata>>(
      `/platform/seo/${encodeURIComponent(pageSlug)}`
    );
    return response.data.data;
  } catch {
    return null;
  }
};

/** Public article by slug (body + related_articles for [related id="..."] shortcodes) */
export const getArticleBySlug = async (
  slug: string
): Promise<ArticleBySlug | null> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getArticleBySlug?.(slug) ?? null;
  }
  try {
    const response = await axiosInstance.get<ApiResponse<ArticleBySlug>>(
      `/platform/articles/${encodeURIComponent(slug)}`
    );
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

export interface ArticleUpNextQueryParams {
  /** Min 3, max 10; omit for server default (6). */
  limit?: number;
}

/**
 * Suggested next reads for an article (same category → same author → latest).
 * Optional auth cookie / JWT affects `access` on premium cards.
 */
export const getArticleUpNext = async (
  slug: string,
  params: ArticleUpNextQueryParams = {}
): Promise<BlogSpotlightArticleCard[]> => {
  if (shouldUseMock()) {
    return [];
  }
  const query: Record<string, number> = {};
  if (params.limit != null) query.limit = Math.min(10, Math.max(3, params.limit));
  const response = await axiosInstance.get<ApiResponse<BlogSpotlightArticleCard[]>>(
    `/platform/articles/${encodeURIComponent(slug)}/up-next`,
    Object.keys(query).length ? { params: query } : undefined
  );
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export interface BlogSpotlightQueryParams {
  /** Scope sidebar / author to this slug (article detail); omits `hero` in response. */
  current_slug?: string;
  recent_limit?: number;
  all_limit?: number;
  author_recent_limit?: number;
  tag_limit?: number;
}

/** Hero + sidebar recent/all lists + author + tags for blog landing (premium page). */
export const getBlogSpotlightFeed = async (
  params: BlogSpotlightQueryParams = {}
): Promise<BlogSpotlightFeed> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getBlogSpotlightFeed?.() ?? {
      hero: null,
      recent_posts: [],
      all_posts: [],
      author: null,
      author_recent_articles: [],
      popular_tags: [],
    };
  }
  const query: Record<string, string | number> = {};
  if (params.current_slug?.trim()) query.current_slug = params.current_slug.trim();
  if (params.recent_limit != null) query.recent_limit = params.recent_limit;
  if (params.all_limit != null) query.all_limit = params.all_limit;
  if (params.author_recent_limit != null) query.author_recent_limit = params.author_recent_limit;
  if (params.tag_limit != null) query.tag_limit = params.tag_limit;
  const response = await axiosInstance.get<ApiResponse<BlogSpotlightFeed>>(
    '/platform/articles/blog-spotlight',
    { params: query }
  );
  return (
    response.data.data ?? {
      hero: null,
      recent_posts: [],
      all_posts: [],
      author: null,
      author_recent_articles: [],
      popular_tags: [],
    }
  );
};

/** Article listing item shape from API */
export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  cover_image_url: string | null;
  author_id: number | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
  categories: { id: number; name: string; slug: string }[];
}

export interface PaginatedArticles {
  data: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface ArticleCategoryItem {
  id: number;
  name: string;
  slug: string;
}

/** Paginated article listing with optional search / category filter */
export const getArticles = async (params: ArticleQueryParams = {}): Promise<PaginatedArticles> => {
  const { page = 1, limit = 6, search = '', category = '' } = params;
  const query: Record<string, string | number> = { page, limit };
  if (search.trim()) query.search = search.trim();
  if (category.trim()) query.category = category.trim();
  const response = await axiosInstance.get<ApiResponse<PaginatedArticles>>(
    '/platform/articles',
    { params: query }
  );
  return response.data.data;
};

/** All article categories (for blog filter tabs) */
export const getArticleCategories = async (): Promise<ArticleCategoryItem[]> => {
  const response = await axiosInstance.get<ApiResponse<ArticleCategoryItem[]>>(
    '/platform/article-categories'
  );
  return response.data.data;
};

/** All course categories (for filter tabs) */
export const getCourseCats = async (): Promise<CourseCat[]> => {
  const response = await axiosInstance.get<ApiResponse<CourseCat[]>>('/course-cats');
  return response.data.data;
};

export interface CourseQueryParams {
  category?: string | null;
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'latest' | 'newest' | 'oldest';
  price?: 'all' | 'free' | '0-500' | '500-1000' | '1000+';
}

/** Paginated course listing with optional category / search / sort / price filters */
export const getCoursesByCategory = async (params: CourseQueryParams = {}): Promise<PaginatedCourses> => {
  const { category, page = 1, limit = 9, search = '', sort = 'latest', price = 'all' } = params;
  const query: Record<string, string | number> = { page, limit, sort, price };
  if (category && category !== 'all') query.category = category;
  if (search.trim()) query.search = search.trim();
  const response = await axiosInstance.get<ApiResponse<PaginatedCourses>>(
    '/courses/by-category',
    { params: query }
  );
  return response.data.data;
};

/** Fetch a single published course by its slug */
export const getCourseBySlug = async (slug: string): Promise<CoursePublicDetail | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<CoursePublicDetail>>(
      `/courses/slug/${encodeURIComponent(slug)}`
    );
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

/** Fetch batches + sessions + recordings for a published course by slug */
export const getCourseSessionsBySlug = async (slug: string): Promise<CourseBatch[]> => {
  try {
    const response = await axiosInstance.get(
      `/courses/slug/${encodeURIComponent(slug)}/sessions`
    );
    const body = response.data;
    // Handle both wrapped { success, data: [...] } and raw array responses
    if (Array.isArray(body)) return body;
    if (body && Array.isArray(body.data)) return body.data;
    console.warn('[getCourseSessionsBySlug] Unexpected response shape:', body);
    return [];
  } catch (err) {
    console.error('[getCourseSessionsBySlug] Failed to fetch sessions for slug:', slug, err);
    return [];
  }
};

/** @deprecated Use getCourseBySlug instead */
export const getCourseById = getCourseBySlug as unknown as (id: string | number) => Promise<CoursePublicDetail | null>;

/** @deprecated Use getCourseSessionsBySlug instead */
export const getCourseSessions = getCourseSessionsBySlug as unknown as (id: string | number) => Promise<CourseBatch[]>;

/** Fetch all published courses (for trending / related sections) */
export const getPublishedCourses = async (): Promise<PublicCourse[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<PublicCourse[]>>('/courses');
    return response.data.data ?? [];
  } catch {
    return [];
  }
};

/**
 * Fetch multiple platform datasets in one go (e.g. for layout or home).
 * Use when you need home + memberships + faq on the same page.
 */
export const getPlatformData = async (options: {
  home?: boolean;
  memberships?: boolean;
  faq?: boolean;
  testimonials?: boolean;
  testimonialsLimit?: number;
}) => {
  const { home, memberships, faq, testimonials, testimonialsLimit } = options;
  const [homeData, membershipsData, faqData, testimonialsData] = await Promise.all([
    home ? getHomePageData() : Promise.resolve(null),
    memberships ? getMemberships() : Promise.resolve(null),
    faq ? getFaq() : Promise.resolve(null),
    testimonials ? getTestimonials(testimonialsLimit) : Promise.resolve(null),
  ]);
  return {
    homePageData: homeData ?? undefined,
    memberships: membershipsData ?? undefined,
    faq: faqData ?? undefined,
    testimonials: testimonialsData ?? undefined,
  };
};
