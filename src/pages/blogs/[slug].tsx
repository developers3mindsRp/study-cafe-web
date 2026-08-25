import { GetServerSideProps } from 'next';
import { PublicLayout } from '@/components/layout';
import Breadcrumbs from '@/components/Breadcrumb';
import BlogArticlePremiumLayout from '@/components/layout/blog/BlogArticlePremiumLayout';
import type { ArticleBySlug, BlogSpotlightFeed, SiteDisplayAds, SeoMetadata } from '@/types/models.types';
import { appConfig } from '@/config/app.config';
import { buildArticlePublicPath } from '@/lib/articlePaths';
import { readMiddlewareSeoHeader } from '@/lib/seo/normalize';
import { viewerSeesAds } from '@/lib/adPolicy';
import Script from "next/script";
import {
  bearerFromCookieHeader,
  fetchArticleBySlugSSR,
  fetchBlogSpotlightSSR,
  fetchSiteDisplayAdsSSR,
  fetchViewerSubscriptionSSR,
} from '@/lib/serverArticle';

interface BlogDetailProps {
  slug: string;
  article: ArticleBySlug;
  spotlight: BlogSpotlightFeed;
  siteAds: SiteDisplayAds | null;
  /** Decided from the request cookie, so a premium member never gets a first paint with banners. */
  adsAllowed: boolean;
  isPreview?: boolean;
  pageSeo: SeoMetadata | null;
  seoPathname: string;
}

export default function BlogDetail({ slug, article, spotlight, siteAds, adsAllowed, isPreview }: BlogDetailProps) {
// console.log(article?.embed_scripts[0],"article")

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
        adsAllowed={adsAllowed}
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

  // console.log(baseUrl,"baseUrl")
  const [article, spotlight, siteAds, subscription] = await Promise.all([
    fetchArticleBySlugSSR(slug, { baseUrl, token, previewToken }),
    fetchBlogSpotlightSSR({ baseUrl, token, currentSlug: slug }),
    fetchSiteDisplayAdsSSR({ baseUrl }),
    fetchViewerSubscriptionSSR({ baseUrl, token }),
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
      // No cookie means a logged-out reader, who gets ads. A cookie whose plan
      // lookup came back empty is a *failed* lookup, not a free reader: withhold
      // the banners and let the client's own check add them a moment later. The
      // cost is a short delay for free members; the alternative is a first paint
      // full of ads for someone who paid to be rid of them.
      adsAllowed: token ? Boolean(subscription) && viewerSeesAds(subscription) : true,
      isPreview: !!previewToken,
      pageSeo,
      seoPathname,
    },
  };
};
