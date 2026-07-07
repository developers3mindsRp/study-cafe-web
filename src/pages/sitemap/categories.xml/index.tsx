import type { GetServerSideProps } from 'next';
import { buildCategorySitemapEntries } from '@/lib/sitemap/server';
import { respondXml } from '@/lib/sitemap/respondXml';
import { buildUrlSet } from '@/lib/sitemap/xml';

export default function CategoriesSitemapPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const entries = await buildCategorySitemapEntries();
    return respondXml(res, buildUrlSet(entries));
  } catch (error) {
    console.error('[sitemap] categories.xml failed:', error);
    return respondXml(res, buildUrlSet([]));
  }
};
