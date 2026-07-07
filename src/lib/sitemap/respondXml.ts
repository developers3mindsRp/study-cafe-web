import type { GetServerSidePropsResult } from 'next';
import type { ServerResponse } from 'http';

export function respondXml(res: ServerResponse, xml: string): GetServerSidePropsResult<Record<string, never>> {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();
  return { props: {} };
}
