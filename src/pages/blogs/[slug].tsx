import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { PublicLayout } from '@/components/layout';
import Breadcrumbs from '@/components/Breadcrumb';
import type { ArticleBySlug, BlogSpotlightFeed, SiteDisplayAds } from '@/types/models.types';
import { appConfig } from '@/config/app.config';
import {
  bearerFromCookieHeader,
  fetchArticleBySlugSSR,
  fetchBlogSpotlightSSR,
  fetchSiteDisplayAdsSSR,
} from '@/lib/serverArticle';

const BlogArticlePremiumLayout = dynamic(
  () => import('@/components/layout/blog/BlogArticlePremiumLayout'),
  { ssr: false },
);

interface BlogDetailProps {
  slug: string;
  article: ArticleBySlug;
  spotlight: BlogSpotlightFeed;
  siteAds: SiteDisplayAds | null;
}

export default function BlogDetail({ slug, article, spotlight, siteAds }: BlogDetailProps) {
  return (
    <PublicLayout>
      {/* SEO: AppRouteSeo + middleware use /api/platform/seo-metadata/by-path for this pathname */}

      {/* Breadcrumbs */}
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4">
        <Breadcrumbs />
      </div>

      {/* Unified dynamic layout — adapts based on API access flags */}
      <BlogArticlePremiumLayout
        slug={slug}
        initialArticle={article}
        initialSpotlight={spotlight}
        siteAds={siteAds}
      />
    </PublicLayout>
  );
}

/**
 * Server-Side Rendering (SSR)
 * Forwards the viewer's `auth_token` cookie so the article body + access flags
 * reflect the logged-in user's membership on first paint (no locked-content flash
 * for paying members).
 */
export const getServerSideProps: GetServerSideProps<BlogDetailProps> = async ({ params, req }) => {
  const slug = String(params?.slug || '');
  if (!slug) return { notFound: true };

  const baseUrl = appConfig.apiBaseUrl;
  const token = bearerFromCookieHeader(req.headers.cookie);

  const [article, spotlight, siteAds] = await Promise.all([
    fetchArticleBySlugSSR(slug, { baseUrl, token }),
    fetchBlogSpotlightSSR({ baseUrl, token, currentSlug: slug }),
    fetchSiteDisplayAdsSSR({ baseUrl }),
  ]);

  if (!article) return { notFound: true };

  return {
    props: {
      slug,
      article,
      spotlight,
      siteAds,
    },
  };
};
