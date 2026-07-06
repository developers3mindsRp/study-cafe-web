import type { GetServerSideProps } from 'next';
import { STATIC_SITEMAP_PATHS } from '@/lib/sitemap/constants';
import {
  absoluteSiteUrl,
  getArticleSitemapPartCount,
  getPublishedArticleTotal,
} from '@/lib/sitemap/server';
import { respondXml } from '@/lib/sitemap/respondXml';
import { buildSitemapIndex } from '@/lib/sitemap/xml';

export default function SitemapIndexPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemapUrls = [
    absoluteSiteUrl('/sitemap/static.xml'),
    absoluteSiteUrl('/sitemap/categories.xml'),
    absoluteSiteUrl('/sitemap/courses.xml'),
  ];

  try {
    const totalArticles = await getPublishedArticleTotal();
    const partCount = getArticleSitemapPartCount(totalArticles);
    for (let part = 1; part <= partCount; part += 1) {
      sitemapUrls.push(absoluteSiteUrl(`/sitemap/articles/${part}.xml`));
    }
  } catch (error) {
    console.error('[sitemap] Failed to count articles for index:', error);
  }

  const xml = buildSitemapIndex(sitemapUrls);
  return respondXml(res, xml);
};
