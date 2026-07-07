import axiosInstance from '@/lib/axios';
import {
  HomePageData,
  Membership,
  FAQ,
  Testimonial,
  GoogleReview,
  MediaTestimonial,
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
  FooterContent,
  SiteDisplayAds,
  Categories,
} from '@/types/models.types';
import { ApiResponse, PublicTrackingSettings } from '@/types/api.types';
import { shouldUseMock } from '@/config/app.config';
import { mockPlatformApi } from '@/mocks/api.mock';
import { normalizeSeoPayload, pathnameForSeoLookup } from '@/lib/seo/normalize';
import type { MarketingPagePublicPayload } from '@/lib/marketing/types';

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

/** Google Reviews (text + star rating) */
export const getGoogleReviews = async (): Promise<GoogleReview[]> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getGoogleReviews();
  }
  const response = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
    '/platform/google-reviews',
  );
  return (response.data.data ?? []).map(mapGoogleReview);
};

function mapGoogleReview(row: Record<string, unknown>): GoogleReview {
  return {
    id: Number(row.id ?? 0),
    name: String(row.name ?? ''),
    role: String(row.role ?? ''),
    rating: Math.min(5, Math.max(1, Number(row.rating) || 5)),
    text: String(row.text ?? ''),
    ago: row.ago != null && String(row.ago).trim() ? String(row.ago) : null,
    avatarUrl: row.avatar_url != null ? String(row.avatar_url) : null,
  };
}

/** Home page text quotes (from google_reviews) */
export const getHomeTestimonialQuotes = async (limit?: number): Promise<Testimonial[]> => {
  const reviews = await getGoogleReviews();
  const list = reviews.map((r) => ({
    id: String(r.id),
    quote: r.text,
    authorName: r.name,
    authorRole: r.role || undefined,
    avatarUrl: r.avatarUrl ?? undefined,
    order: undefined,
  }));
  return limit != null ? list.slice(0, limit) : list;
};

/** Testimonials — video/image cards (testimonials table) */
export const getTestimonials = async (): Promise<MediaTestimonial[]> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getTestimonials();
  }
  const response = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
    '/platform/testimonials',
  );
  return (response.data.data ?? []).map(mapMediaTestimonial);
};

function mapMediaTestimonial(row: Record<string, unknown>): MediaTestimonial {
  return {
    id: Number(row.id ?? 0),
    title: row.title != null ? String(row.title) : null,
    mediaType: row.media_type === 'image' ? 'image' : 'video',
    mediaUrl: String(row.media_url ?? ''),
    videoUrl: row.video_url != null ? String(row.video_url) : null,
    order: row.sort_order != null ? Number(row.sort_order) : undefined,
  };
}

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

/*-----footer data -------*/
let footerCache: FooterContent | null = null;

export const getFooterContent = async (): Promise<FooterContent | null> => {
  if (footerCache) return footerCache;

  try {
    const response = await axiosInstance.get<ApiResponse<FooterContent>>(
      `/platform/footer`
    );

    footerCache = response.data.data ?? null;
    return footerCache;
  } catch {
    return null;
  }
};

/**
 * Resolve SEO row for an app route path (`/contact`, `/blogs/foo`).
 * Matches `seo_metadata.page_slug` on the backend (supports multi-segment paths).
 */
export const fetchSeoMetadataByPath = async (
  pathInput: string
): Promise<SeoMetadata | null> => {
  const path = pathnameForSeoLookup(pathInput);

  if (shouldUseMock()) {
    return mockPlatformApi.getSeoMetadata(path);
  }

  try {
    const response = await axiosInstance.get<ApiResponse<Record<string, unknown>>>(
      '/platform/seo-metadata/by-path',
      { params: { path } }
    );
    const payload = response.data?.data as Record<string, unknown> | undefined;
    return normalizeSeoPayload(payload);
  } catch {
    return null;
  }
};

/** Legacy: slug fragment like `contact` or `/contact` — same backend lookup by path */
export const getSeoMetadata = async (pageSlug: string): Promise<SeoMetadata | null> => {
  const path = pageSlug.startsWith('/') ? pageSlug : `/${pageSlug}`;
  return fetchSeoMetadataByPath(path);
};

/** Browser fetch: same-origin `/api` rewrite + no Bearer header (avoids misconfigured cross-origin API URL and auth edge cases). */
async function fetchSiteDisplayAdsInBrowser(): Promise<SiteDisplayAds | null> {
  const paths = ['/api/platform/cms-display-placements', '/api/platform/site-ads'];
  for (const path of paths) {
    try {
      const res = await fetch(path, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) continue;
      const json = (await res.json()) as ApiResponse<SiteDisplayAds>;
      const data = json?.data ?? null;
      if (data) return data;
    } catch {
      /* try next path */
    }
  }
  return null;
}

/** Promotional placements: popup, article sidebars, in-article banners, listing sidebar */
export const getSiteDisplayAds = async (): Promise<SiteDisplayAds | null> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getSiteDisplayAds();
  }
  try {
    if (typeof window !== 'undefined') {
      return await fetchSiteDisplayAdsInBrowser();
    }
    const paths = ['/platform/cms-display-placements', '/platform/site-ads'];
    for (const p of paths) {
      try {
        const response = await axiosInstance.get<ApiResponse<SiteDisplayAds>>(p);
        const data = response.data.data ?? null;
        if (data) return data;
      } catch {
        /* try legacy path */
      }
    }
    return null;
  } catch {
    return null;
  }
};

/** Marketing snippets from Admin → Global Settings (GTM, Meta, etc.) — GET /platform/global-settings/snippets */
export const getPublicTrackingSettings = async (): Promise<PublicTrackingSettings> => {
  if (shouldUseMock()) {
    return mockPlatformApi.getPublicTrackingSettings();
  }

  const empty: PublicTrackingSettings = {
    tracking_meta_pixel: null,
    tracking_google_analytics: null,
    tracking_linkedin_pixel: null,
  };

  try {
    const response = await axiosInstance.get<ApiResponse<PublicTrackingSettings>>(
      '/platform/global-settings/snippets'
    );

    return response.data.data ?? empty;
  } catch {
    /** Table missing, gateway down, or other — page still renders without third-party scripts */
    return empty;
  }
};

/** Public article by slug (body + related_articles for [related id="..."] shortcodes) */
export const getArticleBySlug = async (
  slug: string,
  previewToken?: string | null
): Promise<ArticleBySlug | null> => {
  // if (shouldUseMock()) {
  //   return mockPlatformApi.getArticleBySlug?.(slug) ?? null;
  // }
  try {
    const params: Record<string, string> = {};
    if (previewToken) params.preview_token = previewToken;
    const response = await axiosInstance.get<ApiResponse<ArticleBySlug>>(
      `/platform/articles/${encodeURIComponent(slug)}`,
      Object.keys(params).length ? { params } : undefined
    );

    console.log(response.data,"response")
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

export interface CaseLawItem {
  id: number;
  title: string;
  appeal_number: string;
  judgement_date: string;
  assessment_year: string;
  court: string;
  slug: string;
  download_url?: string;
  access?:any;
}

export interface CaseLawResponse {
  data: CaseLawItem[];
  page: number;
  total: number;
  totalPages: number;
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

  console.log(response.data.data)
  return response.data.data;
};

/** All article categories (for blog filter tabs) */
export const getArticleCategories = async (): Promise<ArticleCategoryItem[]> => {
  const response = await axiosInstance.get<ApiResponse<ArticleCategoryItem[]>>(
    '/platform/article-categories'
  );
  return response.data.data;
};

/** Featured course categories (nav dropdown, homepage tabs — matches GET /course-cats) */
export const getCourseCats = async (): Promise<CourseCat[]> => {
  const response = await axiosInstance.get<ApiResponse<CourseCat[]>>('/course-cats');


  return response.data.data;
};


/** get all category */
export const getAllCategories = async (): Promise<Categories[]> => {
  const response = await axiosInstance.get<ApiResponse<Categories[]>>('/course-cats/all');
  return response.data.data;
};
/*---------*/



export const getAllCaseLaws = async ({
  page = 1,
  limit = 6,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await axiosInstance.get("/platform/case-laws", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data.data;
};
/** Every course category for the public catalog filters on /courses only (GET /course-cats/all) */
export const getCourseCatsForCatalog = async (): Promise<CourseCat[]> => {
  const response = await axiosInstance.get<ApiResponse<CourseCat[]>>('/course-cats/all');
  return response.data.data;
};

export interface CourseQueryParams {
  category?: string | null;
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'latest' | 'newest' | 'oldest' | 'popular';
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

export interface CoursePageSettingsPublic {
  alumni_logos: Array<{ name?: string; logo_url?: string; link?: string }>;
  featured_in_logos: Array<{ name?: string; logo_url?: string; link?: string }>;
  gallery_images: string[];
}

/** Shared course page sections (alumni, featured-in, photo gallery). */
export const getCoursePageSettingsPublic = async (): Promise<CoursePageSettingsPublic> => {
  try {
    const response = await axiosInstance.get<ApiResponse<CoursePageSettingsPublic>>(
      '/course-page-settings/public',
    );
    const data = response.data.data;
    return {
      alumni_logos: data?.alumni_logos ?? [],
      featured_in_logos: data?.featured_in_logos ?? [],
      gallery_images: data?.gallery_images ?? [],
    };
  } catch {
    return { alumni_logos: [], featured_in_logos: [], gallery_images: [] };
  }
};

/** Marketing landing page by slug (includes linked course + shared page settings). */
export const getMarketingPageBySlug = async (
  slug: string,
): Promise<MarketingPagePublicPayload | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<MarketingPagePublicPayload>>(
      `/marketing-pages/slug/${encodeURIComponent(slug)}`,
    );
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

/** Fetch a single published course by its slug, optionally bypassing the published filter with a preview token */
export const getCourseBySlug = async (slug: string, previewToken?: string | null): Promise<CoursePublicDetail | null> => {
  try {
    const params: Record<string, string> = {};
    if (previewToken) params.preview_token = previewToken;
    const response = await axiosInstance.get<ApiResponse<CoursePublicDetail>>(
      `/courses/slug/${encodeURIComponent(slug)}`,
      { params }
    );
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

/** Fetch a single published course by numeric database id, optionally bypassing the published filter with a preview token */
export const getCourseById = async (id: string | number, previewToken?: string | null): Promise<CoursePublicDetail | null> => {
  try {
    const params: Record<string, string> = {};
    if (previewToken) params.preview_token = previewToken;
    const response = await axiosInstance.get<ApiResponse<CoursePublicDetail>>(
      `/courses/${encodeURIComponent(String(id))}`,
      { params }
    );
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

/**
 * Resolve a URL segment: all digits → GET /courses/:id, otherwise → GET /courses/slug/:slug
 * Pass previewToken to allow admin preview of unpublished courses.
 */
export const getCourseBySlugOrId = async (segment: string, previewToken?: string | null): Promise<CoursePublicDetail | null> => {
  const s = String(segment || "").trim();
  if (!s) return null;
  if (/^\d+$/.test(s)) return getCourseById(s, previewToken);
  return getCourseBySlug(s, previewToken);
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

/** Sessions for marketing page — requires a slug; courses without slug return []. */
export async function getCourseSessionsForResolvedCourse(
  course: CoursePublicDetail
): Promise<CourseBatch[]> {
  const slug = course.slug?.trim();
  if (!slug) return [];
  return getCourseSessionsBySlug(slug);
}

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

/*---------MembershipSummaryType---------*/
export interface MembershipSummaryType {
  targetPlanId: number;
  code?:string;
  
}

export interface MembershipSummaryTypeResult {
  data: string;
  
}

export const getMembershipSummaryById = async (
  body: MembershipSummaryType
): Promise<any> => { 

  console.log(body,"body")
  const response = await axiosInstance.post<ApiResponse<any>>(
    "/platform/membership/upgrade-summary",
    {
      targetPlanId: body.targetPlanId,
      couponCode:body.code
    }
  );
  return response.data.data;
};




/** Result of POST /platform/newsletter/subscribe (public, no auth) */
export interface NewsletterSubscribeResult {
  subscribed: true;
  already_subscribed: boolean;
}

/**
 * Subscribe an email to the site newsletter (footer, landing pages, etc.)
 */
/** Public contact form — POST /platform/contact-us */
export interface ContactInquiryPayload {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  country_code?: string;
  subject?: string;
  message: string;
}

export interface ContactInquiryResult {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  country_code?: string;
  subject?: string | null;
  message: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const submitContactInquiry = async (
  body: ContactInquiryPayload
): Promise<ContactInquiryResult> => {
  if (shouldUseMock()) {
    return mockPlatformApi.submitContactInquiry(body);
  }
  const response = await axiosInstance.post<ApiResponse<ContactInquiryResult>>(
    "/platform/contact-us",
    {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      mobile_number: body.mobile_number,
      country_code: body.country_code ?? "IN",
      subject: body.subject,
      message: body.message,
    }
  );
  return response.data.data;
};

export const subscribeNewsletter = async (email: string): Promise<NewsletterSubscribeResult> => {
  const trimmed = email.trim();
  if (!trimmed) {
    throw new Error('Email is required');
  }
  if (shouldUseMock()) {
    return mockPlatformApi.subscribeNewsletter(trimmed);
  }
  const response = await axiosInstance.post<ApiResponse<NewsletterSubscribeResult>>(
    '/platform/newsletter/subscribe',
    { email: trimmed }
  );
  return response.data.data;
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
    testimonials ? getHomeTestimonialQuotes(testimonialsLimit) : Promise.resolve(null),
  ]);
  return {
    homePageData: homeData ?? undefined,
    memberships: membershipsData ?? undefined,
    faq: faqData ?? undefined,
    testimonials: testimonialsData ?? undefined,
  };
};
