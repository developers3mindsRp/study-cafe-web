import type { GetServerSideProps } from 'next';
import { buildNewsSitemapEntries } from '@/lib/sitemap/server';
import { respondXml } from '@/lib/sitemap/respondXml';
import { buildNewsUrlSet } from '@/lib/sitemap/xml';
import { NEWS_SITEMAP_PUBLICATION_NAME } from '@/lib/sitemap/constants';

export default function NewsSitemapPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const entries = await buildNewsSitemapEntries();
    return respondXml(res, buildNewsUrlSet(entries, NEWS_SITEMAP_PUBLICATION_NAME));
  } catch (error) {
    console.error('[sitemap] news.xml failed:', error);
    return respondXml(res, buildNewsUrlSet([], NEWS_SITEMAP_PUBLICATION_NAME));
  }
};
