/** Max article URLs per sitemap part (Google limit is 50,000). */
export const ARTICLES_PER_SITEMAP = 2000;

/** Google News sitemaps should only list very recent articles — keep this small. */
export const NEWS_SITEMAP_ARTICLE_COUNT = 30;

/** `<news:name>` — must match the publication name registered in Google Publisher Center. */
export const NEWS_SITEMAP_PUBLICATION_NAME = 'StudyCafe';

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
