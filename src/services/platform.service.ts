import axiosInstance from '@/lib/axios';
import {
  HomePageData,
  Membership,
  FAQ,
  Testimonial,
  PageContent,
  SeoMetadata,
  ArticleBySlug,
  CourseCat,
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
export const getPageContent = async (slug: string): Promise<PageContent> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getPageContent(slug);
  }
  const response = await axiosInstance.get<ApiResponse<PageContent>>(
    `/platform/page/${encodeURIComponent(slug)}`
  );
  return response.data.data;
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
export const getPublishedCourses = async (): Promise<Course[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Course[]>>('/courses');
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
