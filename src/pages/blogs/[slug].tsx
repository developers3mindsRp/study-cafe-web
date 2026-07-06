import { GetServerSideProps } from 'next';
import { PublicLayout } from '@/components/layout';
import Breadcrumbs from '@/components/Breadcrumb';
import BlogArticlePremiumLayout from '@/components/layout/blog/BlogArticlePremiumLayout';
import type { ArticleBySlug, BlogSpotlightFeed, SiteDisplayAds, SeoMetadata } from '@/types/models.types';
import { appConfig } from '@/config/app.config';
import { buildArticlePublicPath } from '@/lib/articlePaths';
import { readMiddlewareSeoHeader } from '@/lib/seo/normalize';
import Script from "next/script";
import {
  bearerFromCookieHeader,
  fetchArticleBySlugSSR,
  fetchBlogSpotlightSSR,
  fetchSiteDisplayAdsSSR,
} from '@/lib/serverArticle';

interface BlogDetailProps {
  slug: string;
  article: ArticleBySlug;
  spotlight: BlogSpotlightFeed;
  siteAds: SiteDisplayAds | null;
  isPreview?: boolean;
  pageSeo: SeoMetadata | null;
  seoPathname: string;
}

export default function BlogDetail({ slug, article, spotlight, siteAds, isPreview }: BlogDetailProps) {
console.log(article?.embed_scripts[0],"article")

  return (
    <PublicLayout>

      {article?.embed_scripts?.map((script:any, index:any) => (
        <Script
          key={index}
          src={script}
          strategy="afterInteractive"
        />
      ))}
      {/* SEO: AppRouteSeo + middleware use /api/platform/seo-metadata/by-path for this pathname */}

      {isPreview && (
        <div className="w-full bg-yellow-400 text-yellow-900 text-center text-sm font-semibold py-2 px-4">
          Preview — This is preview link.
        </div>
      )}

      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4">
        <Breadcrumbs
          content={[
            { label: 'Blogs', href: '/blogs' },
            { label: article.title?.trim() || 'Article' },
          ]}
        />
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
export const getServerSideProps: GetServerSideProps<BlogDetailProps> = async (ctx) => {
  const slug = String(ctx.params?.slug || '');
  if (!slug) return { notFound: true };

  const baseUrl = appConfig.apiBaseUrl;
  const token = bearerFromCookieHeader(ctx.req.headers.cookie);
  const previewToken = typeof ctx.query.preview_token === 'string' ? ctx.query.preview_token : null;

  console.log(baseUrl,"baseUrl")
  const [article, spotlight, siteAds] = await Promise.all([
    fetchArticleBySlugSSR(slug, { baseUrl, token, previewToken }),
    fetchBlogSpotlightSSR({ baseUrl, token, currentSlug: slug }),
    fetchSiteDisplayAdsSSR({ baseUrl }),
  ]);
  // Skip canonical redirect when previewing a draft — it may not have a canonical URL yet

  // console.log(article,slug,"article.slug")
  if (!article) return { notFound: true };

  const rawPublicPath = ctx.req.headers['x-studycafe-public-path'];
  const publicPathHeader = Array.isArray(rawPublicPath) ? rawPublicPath[0] : rawPublicPath;
  const seoPathname =
    (typeof publicPathHeader === 'string' && publicPathHeader)
    || buildArticlePublicPath(article.slug, article.id)
    || `/blogs/${slug}`;
  const pageSeo = readMiddlewareSeoHeader(ctx.req.headers['x-studycafe-seo-json']);

  // Skip canonical redirect when previewing a draft — it may not have a canonical URL yet

  // console.log(article.slug,"article.slug")
  if (!previewToken) {
    const canonicalPath = buildArticlePublicPath(article.slug, article.id);
    const requestPath = (
      typeof publicPathHeader === 'string' && publicPathHeader
        ? publicPathHeader
        : (ctx.resolvedUrl || ctx.req.url || '')
    )
      .split('?')[0] || '';
    const isDocumentRequest = !ctx.req.headers['x-nextjs-data'];

    // Redirect legacy /blogs/... URLs only — not .html (rewritten internally to /blogs/[slug])
    if (
      canonicalPath &&
      isDocumentRequest &&
      requestPath.startsWith('/blogs/') &&
      requestPath !== canonicalPath
    ) {
      return {
        redirect: {
          destination: canonicalPath,
          permanent: true,
        },
      };
    }
  }

  return {
    props: {
      slug,
      article,
      spotlight,
      siteAds,
      isPreview: !!previewToken,
      pageSeo,
      seoPathname,
    },
  };
};
