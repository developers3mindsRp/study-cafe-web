"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import { getArticleBySlug, getBlogSpotlightFeed } from "@/services/platform.service";
import type { ArticleBySlug, BlogSpotlightFeed } from "@/types/models.types";
import HeroSection_blog from "@/components/layout/blog-list/HeroSection-blog";
import SidebarBlog from "@/components/layout/blog-list/SidebarBlog";
import Premium_user from "@/components/layout/blog-list/PremiumUser";
import { cardThumb } from "@/components/layout/blog-list/blogImage";

function stripTags(html: string) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptionPreview(article: ArticleBySlug) {
  const ex = stripTags(article.excerpt || "");
  if (ex) return ex.slice(0, 560);
  return stripTags(article.body || "").slice(0, 560);
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type Props = {
  slug: string;
  initialArticle: ArticleBySlug;
  initialSpotlight: BlogSpotlightFeed;
};

/**
 * Two-column blog article layout (premium tier) — matches `/blogs/premium-blog` styling;
 * sidebar + author lists are scoped to this slug via `blog-spotlight?current_slug=`.
 */
export default function BlogArticlePremiumLayout({ slug, initialArticle, initialSpotlight }: Props) {
  const { data: article = initialArticle } = useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: async () => {
      const a = await getArticleBySlug(slug);
      if (!a) throw new Error("Article not found");
      return a;
    },
    initialData: initialArticle,
    staleTime: 60 * 1000,
  });

  const { data: spotlight = initialSpotlight } = useQuery({
    queryKey: queryKeys.articles.spotlight({ current_slug: slug }),
    queryFn: () => getBlogSpotlightFeed({ current_slug: slug }),
    initialData: initialSpotlight,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-10 mt-6">
      <div className="lg:col-span-2 space-y-10">
        <div className="space-y-10">
          <HeroSection_blog
            title={article.title}
            subtitle={article.sub_heading || ""}
            description={descriptionPreview(article)}
            author={String(article.author_name ?? "Editor")}
            date={formatDate(article.published_at)}
            update={formatDate(article.updated_at)}
            image={cardThumb(article.thumbnail_url || article.cover_image_url)}
          />

          <Premium_user
            article={article}
            authorSpotlight={spotlight?.author ?? null}
            authorRecent={spotlight?.author_recent_articles ?? []}
            recentPosts={spotlight?.recent_posts ?? []}
            allPosts={spotlight?.all_posts ?? []}
            popularTags={spotlight?.popular_tags ?? []}
          />

          <div className="block lg:hidden">
            <SidebarBlog
              recentPosts={spotlight?.recent_posts}
              allPosts={spotlight?.all_posts}
              popularTags={spotlight?.popular_tags}
            />
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
        <SidebarBlog
          recentPosts={spotlight?.recent_posts}
          allPosts={spotlight?.all_posts}
          popularTags={spotlight?.popular_tags}
        />
      </div>
    </div>
  );
}
