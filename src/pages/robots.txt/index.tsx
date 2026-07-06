import type { GetServerSideProps } from 'next';
import { getSiteUrl } from '@/config/env';
import { respondXml } from '@/lib/sitemap/respondXml';

export default function RobotsTxtPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = getSiteUrl();
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /account',
    'Disallow: /dashboard',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /payment',
    'Disallow: /payment-success',
    'Disallow: /payment-detail',
    'Disallow: /upgrade-plan',
    'Disallow: /reset-password',
    'Disallow: /forget-password',
    'Disallow: /verify-email',
    'Disallow: /learn/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.write(body);
  res.end();
  return { props: {} };
};
