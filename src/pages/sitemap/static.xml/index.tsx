import type { GetServerSideProps } from 'next';
import { STATIC_SITEMAP_PATHS } from '@/lib/sitemap/constants';
import { absoluteSiteUrl } from '@/lib/sitemap/server';
import { respondXml } from '@/lib/sitemap/respondXml';
import { buildUrlSet } from '@/lib/sitemap/xml';

export default function StaticSitemapPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const entries = STATIC_SITEMAP_PATHS.map((path) => ({
    loc: absoluteSiteUrl(path),
    changefreq: path === '/' ? ('daily' as const) : ('weekly' as const),
    priority: path === '/' ? 1 : 0.8,
  }));

  return respondXml(res, buildUrlSet(entries));
};
