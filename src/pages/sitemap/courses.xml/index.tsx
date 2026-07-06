import type { GetServerSideProps } from 'next';
import { buildCourseSitemapEntries } from '@/lib/sitemap/server';
import { respondXml } from '@/lib/sitemap/respondXml';
import { buildUrlSet } from '@/lib/sitemap/xml';

export default function CoursesSitemapPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const entries = await buildCourseSitemapEntries();
    return respondXml(res, buildUrlSet(entries));
  } catch (error) {
    console.error('[sitemap] courses.xml failed:', error);
    return respondXml(res, buildUrlSet([]));
  }
};
