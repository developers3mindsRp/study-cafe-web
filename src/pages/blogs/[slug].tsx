import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { PublicLayout } from '@/components/layout';
import Breadcrumbs from '@/components/Breadcrumb';
import BlogArticlePremiumLayout from '@/components/layout/blog/BlogArticlePremiumLayout';
import type { ArticleBySlug, BlogSpotlightFeed } from '@/types/models.types';
import {
  fetchArticleBySlugSSR,
  fetchBlogSpotlightSSR,
  bearerFromCookieHeader,
} from '@/lib/serverArticle';

interface BlogDetailProps {
  slug: string;
  article: ArticleBySlug;
  spotlight: BlogSpotlightFeed;
}

export default function BlogDetail({ slug, article, spotlight }: BlogDetailProps) {
  return (
    <PublicLayout>
      <Head>
        <title>{`${String(article.meta_title || article.title || 'Article').trim()} | StudyCafe`}</title>
        {article.meta_description ? (
          <meta name="description" content={String(article.meta_description)} />
        ) : null}
      </Head>

      {/* Breadcrumbs */}
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4">
        <Breadcrumbs />
      </div>

      {/* Unified dynamic layout — adapts based on API access flags */}
      <BlogArticlePremiumLayout
        slug={slug}
        initialArticle={article}
        initialSpotlight={spotlight}
      />
    </PublicLayout>
  );
}

/**
 * Server-Side Rendering (SSR)
 * Fetches the article (full or preview based on membership) and sidebar data.
 * The auth_token cookie is forwarded to the API so the backend can determine
 * whether the viewer has an active membership.
 */
export const getServerSideProps: GetServerSideProps<BlogDetailProps> = async ({ params, req }) => {
  const slug = String(params?.slug || '');
  if (!slug) return { notFound: true };

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  const token = bearerFromCookieHeader(req.headers.cookie);

  const [article, spotlight] = await Promise.all([
    fetchArticleBySlugSSR(slug, { baseUrl, token }),
    fetchBlogSpotlightSSR({ baseUrl, token, currentSlug: slug }),
  ]);

  if (!article) return { notFound: true };

  return {
    props: {
      slug,
      article,
      spotlight,
    },
  };
};
