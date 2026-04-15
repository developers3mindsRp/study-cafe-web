import { GetServerSideProps } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { PublicLayout } from '@/components/layout';
import Breadcrumbs from '@/components/Breadcrumb';
import type { ArticleBySlug, BlogSpotlightFeed } from '@/types/models.types';
import {
  getArticleBySlug,
  getBlogSpotlightFeed,
} from '@/services/platform.service';

const BlogArticlePremiumLayout = dynamic(
  () => import('@/components/layout/blog/BlogArticlePremiumLayout'),
  { ssr: false },
);

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
 * Fetches the article and sidebar data using platform service methods.
 */
export const getServerSideProps: GetServerSideProps<BlogDetailProps> = async ({ params }) => {
  const slug = String(params?.slug || '');
  if (!slug) return { notFound: true };

  const [article, spotlight] = await Promise.all([
    getArticleBySlug(slug),
    getBlogSpotlightFeed({ current_slug: slug }),
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
