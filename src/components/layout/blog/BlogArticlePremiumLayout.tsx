"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { queryKeys } from "@/lib/react-query";
import { getArticleBySlug, getBlogSpotlightFeed } from "@/services/platform.service";
import type { ArticleBySlug, BlogSpotlightFeed, SiteDisplayAds } from "@/types/models.types";
import HeroSection_blog from "@/components/layout/blog-list/HeroSection-blog";
import SidebarBlog from "@/components/layout/blog-list/SidebarBlog";
import Premium_user from "@/components/layout/blog-list/PremiumUser";
import ArticleUpNextSection from "@/components/layout/blog-list/ArticleUpNextSection";
import { cardThumb } from "@/components/layout/blog-list/blogImage";
import { articleTeaserPlain } from "@/components/layout/blog-list/articleTeaserPlain";

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type Props = {
  slug: string;
  initialArticle: ArticleBySlug;
  initialSpotlight: BlogSpotlightFeed;
  /** From SSR — article detail sidebar slots */
  siteAds?: SiteDisplayAds | null;
};

/**
 * Two-column blog article layout (premium tier) — matches `/blogs/premium-blog` styling;
 * sidebar + author lists are scoped to this slug via `blog-spotlight?current_slug=`.
 */
export default function BlogArticlePremiumLayout({
  slug,
  initialArticle,
  initialSpotlight,
  siteAds,
}: Props) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const { data: article = initialArticle, refetch } = useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: async () => {
      const a = await getArticleBySlug(slug);
      if (!a) throw new Error("Article not found");
      return a;
    },
    initialData: initialArticle,
    // Treat the server-rendered payload as fresh: a premature client-side auto-fetch
    // would fire before the auth cookie hydrates and overwrite the access flags.
    initialDataUpdatedAt: () => Date.now(),
    staleTime: 60 * 1000,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (authLoading) return;
    // Any active membership (or admin role) should unlock the full article.
    // Refetch with the now-hydrated bearer token so premium-locked SSR payloads
    // get replaced with the unlocked body.
    const shouldUnlock =
      isAuthenticated &&
      (user?.hasActiveMembership || ["admin", "super_admin"].includes(user?.role ?? ""));
    if (shouldUnlock && !article.access?.can_read_full) {
      refetch();
    }
  }, [
    authLoading,
    isAuthenticated,
    user?.hasActiveMembership,
    user?.role,
    article.access?.can_read_full,
    refetch,
  ]);

  const { data: spotlight = initialSpotlight } = useQuery({
    queryKey: queryKeys.articles.spotlight({ current_slug: slug }),
    queryFn: () => getBlogSpotlightFeed({ current_slug: slug }),
    initialData: initialSpotlight,
    staleTime: 5 * 60 * 1000,
  });
  const citation = initialArticle?.citation;
  const whatsapp_link = initialArticle?.whatsapp_link
  const telegram_link = initialArticle?.telegram_link

  const google_news_url = initialArticle?.google_news_url

  // Map the article's own tags (from API) to the BlogSpotlightTag shape used by SidebarBlog
  const articleTags: import("@/types/models.types").BlogSpotlightTag[] =
    (article.tags ?? []).map((t) => ({ id: t.id, name: t.name, article_count: 0 }));


  console.log(initialArticle,"initialArticle")

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-10 mt-6">
      <div className="lg:col-span-2 space-y-10">
        <div className="space-y-10">
          {
            article &&
             <HeroSection_blog
              title={article.title}
              subtitle={article.sub_heading || ""}
              description={articleTeaserPlain(article, 560)}
              author={String(article.author_name ?? "Editor")}
              date={formatDate(article.published_at)}
              update={formatDate(article.updated_at)}
              image={cardThumb(article.thumbnail_url || article.cover_image_url)}
              toc={article.toc}
              tags={article.tags}
            />
          }
         

          {
            article &&
            <Premium_user
              article={article}
              betweenArticleAds={siteAds?.between_article ?? null}
              authorSpotlight={spotlight?.author ?? null}
              authorRecent={spotlight?.author_recent_articles ?? []}
              recentPosts={spotlight?.recent_posts ?? []}
              allPosts={spotlight?.all_posts ?? []}
              popularTags={spotlight?.popular_tags ?? []}
              whatsapp_link={whatsapp_link}
              telegram_link={telegram_link}
              google_news_url={google_news_url}


            />

          }

          
      {
        citation &&
              <div className="w-full bg-white container mx-auto px-4">
          <div className="border border-[#d4d4d4] rounded-xl p-6 bg-white shadow-sm">
            
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">
              Citation Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {citation?.appeal_number && (
                <div>
                  <p className="text-[16px] font-medium text-[#111827]  mb-1">
                    Appeal Number
                  </p>
                  <p className="text-[#6a6969] text-sm">
                    {citation?.appeal_number}
                  </p>
                </div>
              )}

              {citation?.assessment_year && (
                <div>
                  <p className="mb-1 text-[16px] font-medium text-[#111827]">
                    Assessment Year
                  </p>
                  <p className="text-sm text-[#6a6969] ">
                    {citation?.assessment_year}
                  </p>
                </div>
              )}

              {citation?.case_citation && (
                <div>
                  <p className=" mb-1 text-[16px] font-medium text-[#111827]">
                    Case Citation
                  </p>
                  <p className="text-sm text-[#6a6969] break-words">
                    {citation?.case_citation}
                  </p>
                </div>
              )}

              {citation?.case_name && (
                <div>
                  <p className="text-[16px] font-medium text-[#111827] mb-1">
                    Case Name
                  </p>
                  <p className="text-sm text-[#6a6969]  break-words">
                    {citation?.case_name}
                  </p>
                </div>
              )}

              {citation?.court && (
                <div>
                  <p className=" mb-1 text-[16px] font-medium text-[#111827]">
                    Court
                  </p>
                  <p className="text-sm text-[#6a6969]">
                    {citation?.court}
                  </p>
                </div>
              )}

              {citation?.judgement_date && (
                <div>
                  <p className=" mb-1 text-[16px] font-medium text-[#111827]">
                    Judgement Date
                  </p>
                  <p className="text-sm text-[#6a6969]">
                    {citation?.judgement_date}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      }

         
          
      {
        slug &&
          <ArticleUpNextSection slug={slug} />
      }

        {
          spotlight &&
          <div className="block lg:hidden">
            <SidebarBlog
              recentPosts={spotlight?.recent_posts}
              allPosts={spotlight?.all_posts}
              popularTags={articleTags}
              detailSidebarAds={siteAds?.article_detail_sidebar}
            />
          </div>
        }

          
        </div>
      </div>

      <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
        {
          spotlight &&
           <SidebarBlog
            recentPosts={spotlight?.recent_posts}
            allPosts={spotlight?.all_posts}
            popularTags={articleTags}
            detailSidebarAds={siteAds?.article_detail_sidebar}
          />
        }
       
      </div>
    </div>
  );
}
