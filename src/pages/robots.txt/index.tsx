import type { GetServerSideProps } from 'next';
import { getSiteUrl } from '@/config/env';
import { buildRobotsTxt } from '@/lib/robots/buildRobotsTxt';

export default function RobotsTxtPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const body = buildRobotsTxt(getSiteUrl());

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.write(body);
  res.end();
  return { props: {} };
};
