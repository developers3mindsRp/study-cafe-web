import type { GetServerSideProps } from 'next';
import { buildArticleSitemapEntries } from '@/lib/sitemap/server';
import { respondXml } from '@/lib/sitemap/respondXml';
import { buildUrlSet } from '@/lib/sitemap/xml';

export default function ArticlesSitemapPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  const rawPage = params?.page;
  const page = Math.max(1, parseInt(Array.isArray(rawPage) ? rawPage[0] : String(rawPage || '1'), 10) || 1);

  try {
    const entries = await buildArticleSitemapEntries(page);
    return respondXml(res, buildUrlSet(entries));
  } catch (error) {
    console.error(`[sitemap] articles/${page}.xml failed:`, error);
    return respondXml(res, buildUrlSet([]));
  }
};
