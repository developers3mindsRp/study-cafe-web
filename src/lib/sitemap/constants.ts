/** Max article URLs per sitemap part (Google limit is 50,000). */
export const ARTICLES_PER_SITEMAP = 2000;

export const STATIC_SITEMAP_PATHS = [
  '/',
  '/about-us',
  '/contact',
  '/courses',
  '/blogs',
  '/downloads',
  '/plans',
  '/privacy-policy',
  '/terms-of-use',
  '/disclaimer',
  '/refund-policy',
  '/ethics-policy',
  '/category/all',
  '/course_cats/all',
  '/verify-certificate',
] as const;
