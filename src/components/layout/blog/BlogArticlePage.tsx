"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { getArticleBySlug } from "@/services/platform.service";
import { queryKeys } from "@/lib/react-query";
import type { ArticleBySlug } from "@/types/models.types";
import { buildArticlePublicPath } from "@/lib/articlePaths";

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogArticlePage({
  slug,
  initialArticle,
}: {
  slug: string;
  initialArticle: ArticleBySlug;
}) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const { data, refetch } = useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: async () => {
      const a = await getArticleBySlug(slug);
      if (!a) throw new Error("Article not found");
      return a;
    },
    initialData: initialArticle,
    initialDataUpdatedAt: () => Date.now(),
    staleTime: 60 * 1000,
    refetchOnMount: false,
  });
  const article = data ?? initialArticle;

  useEffect(() => {
    if (authLoading) return;
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

  const access = article.access;
  const showCta = access?.show_read_more_cta && !access?.can_read_full;

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        {article.blog_access_tier === "premium" && (
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            Premium
          </span>
        )}
        <h1 className="text-3xl font-semibold text-[#252525] md:text-4xl">{article.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#696969]">
          <span>{article.author_name ?? "Editor"}</span>
          <span>{formatDate(article.published_at)}</span>
        </div>
        {(article.cover_image_url || article.thumbnail_url) && (
          <img
            src={String(article.cover_image_url || article.thumbnail_url)}
            alt=""
            className="w-full max-h-[420px] rounded-lg object-cover"
            referrerPolicy="no-referrer"
          />
        )}
      </header>

      <div
        className="article-rich-text max-w-none text-[16px] text-[#454545]"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      {showCta && (
        <div className="rounded-xl border border-[#09339B]/30 bg-[#F4F7FF] p-6 text-center">
          <p className="mb-4 text-[#252525]">
            Unlock the full article with an active StudyCafe membership.
            {isAuthenticated && user?.hasActiveMembership && (
              <span className="block mt-1 text-red-500 font-medium text-sm">
                Your current plan does not grant access to this article.
              </span>
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {!isAuthenticated && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const currentPath = window.location.pathname;
                  window.location.href = `/login?next=${encodeURIComponent(currentPath)}`;
                }}
                className="rounded-md bg-[#09339B] px-5 py-2 text-sm font-medium text-white hover:bg-blue-800 transition"
              >
                Log in
              </button>
            )}
            <Link
              href="/plans"
              className="rounded-md border border-[#09339B] px-5 py-2 text-sm font-medium text-[#09339B] hover:bg-white transition"
            >
              {isAuthenticated && user?.hasActiveMembership ? "View Membership Plans" : "View memberships"}
            </Link>
          </div>
        </div>
      )}

      {article.related_articles && article.related_articles.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold tracking-tight text-[#252525] md:text-xl">Also Read</h2>
          <div className="space-y-4">
            {article.related_articles.map((r) => (
              <Link
                key={r.id}
                href={buildArticlePublicPath(r.slug, r.id)}
                className="block text-[15px] font-normal leading-snug text-[#09339B] no-underline hover:underline md:text-[16px]"
              >
                {r.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
