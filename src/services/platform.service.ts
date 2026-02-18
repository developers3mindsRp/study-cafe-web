import axiosInstance from '@/lib/axios';
import {
  HomePageData,
  Membership,
  FAQ,
  Testimonial,
  PageContent,
  SeoMetadata,
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
