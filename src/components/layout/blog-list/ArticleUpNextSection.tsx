"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import { getArticleUpNext } from "@/services/platform.service";
import { cardThumb, resolveBlogImageSrc } from "@/components/layout/blog-list/blogImage";
import { articleTeaserPlain, sanitizeTeaserPlain } from "@/components/layout/blog-list/articleTeaserPlain";
import type { BlogSpotlightArticleCard } from "@/types/models.types";
import { articleHref } from "@/lib/articlePaths";

type Props = {
  slug: string;
  /** Min 3, max 10; omit for server default (6). */
  limit?: number;
};

/** Split teaser into two paragraphs like `BlogDesc` (main blurb + follow-up line). */
function twoParagraphsFromTeaser(teaser: string) {
  const t = teaser.trim();
  if (!t) return { first: "", second: "" };
  if (t.length < 140) return { first: t, second: "" };
  const cut = t.indexOf(". ", 100);
  if (cut === -1) return { first: t, second: "" };
  return {
    first: t.slice(0, cut + 1).trim(),
    second: t.slice(cut + 2).trim(),
  };
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Social row — matches `BlogDesc.tsx` buttons. */
function UpNextSocialRow() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center pt-2 gap-4">
      <button
        type="button"
        className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#34C759] px-6 xl:px-12 py-2 rounded-[10px] text-[#34C759] font-medium hover:bg-[#34C759] hover:text-white transition"
      >
        <img src="/images/whatsapp.png" alt="" className="w-4 h-4" />
        <span>Join WhatsApp Group</span>
      </button>
      <button
        type="button"
        className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#039BE5] px-6 xl:px-12 py-2 rounded-[10px] text-[#039BE5] font-medium hover:bg-[#039BE5] hover:text-white transition"
      >
        <img src="/images/telegram-round.png" alt="" className="w-4 h-4" />
        <span>Join Telegram Group</span>
      </button>
      <button
        type="button"
        className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#252525] px-6 xl:px-12 py-2 rounded-[10px] text-[#252525] font-medium hover:bg-[#252525] hover:text-white transition"
      >
        <img src="/images/google.png" alt="" className="w-4 h-4" />
        <span>Follow On Google News</span>
      </button>
    </div>
  );
}

function UpNextArticleBlock({ post }: { post: BlogSpotlightArticleCard }) {
  const href = articleHref(post.slug, post.id);
  const banner = resolveBlogImageSrc(cardThumb(post.thumbnail_url || post.cover_image_url)) || "/images/s-court.png";
  const serverPreview = post.description_preview?.trim();
  const teaser =
    serverPreview && serverPreview.length >= 20
      ? sanitizeTeaserPlain(serverPreview)
      : articleTeaserPlain(
          {
            title: post.title,
            excerpt: post.excerpt,
            sub_heading: post.sub_heading,
            meta_description: post.meta_description,
            body: undefined,
          },
          400,
        );
  const { first, second } = twoParagraphsFromTeaser(teaser);

  return (
    <article className="space-y-4">
      <div className="flex flex-wrap items-start gap-2 gap-y-1">
        <h3 className="text-[30px] font-medium text-[#252525]">{post.title}</h3>
        {post.blog_access_tier === "premium" ? (
          <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full shrink-0 self-center">
            Premium
          </span>
        ) : null}
      </div>

      {first ? (
        <p className="text-[#6C6C6C] text-[16px] leading-relaxed">{first}</p>
      ) : null}
      {second ? (
        <p className="text-[#6C6C6C] text-[16px] leading-relaxed">{second}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 text-[16px] text-[#AFAFAF] mb-3">
        <span className="flex items-center gap-2">
          <img src="/images/user.svg" alt="" width={20} height={20} />
          {post.author_name?.trim() || "Editor"}
        </span>
        <span className="flex items-center gap-2">
          <img src="/images/calendar.svg" alt="" width={20} height={20} />
          {formatDate(post.published_at)}
        </span>
      </div>

      <div className="rounded-[10px] overflow-hidden shadow">
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS URLs */}
        <img
          src={banner}
          alt=""
          width={1200}
          height={600}
          className="w-full h-auto object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-4 border border-[#AFAFAF] shadow-md rounded-[10px] px-4 py-4">
        {first ? (
          <p className="text-[#6C6C6C] text-[17px] leading-[32px] font-light">{first}</p>
        ) : null}
        {second ? (
          <p className="text-[#6C6C6C] text-[17px] leading-[32px] font-light">{second}</p>
        ) : null}
        <div className="flex justify-center pt-2">
          <Link
            href={href}
            className="w-full sm:w-auto border border-[#09339B] px-6 sm:px-32 py-2 rounded-[10px] text-[#09339B] font-medium hover:bg-[#09339B] hover:text-white transition text-center"
          >
            Read More
          </Link>
        </div>
        <UpNextSocialRow />
      </div>
    </article>
  );
}

/**
 * Suggested next reads — layout aligned with `BlogDesc.tsx` (title, excerpt, author/date, hero image, card + Read More + socials).
 */
export default function ArticleUpNextSection({ slug, limit }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.articles.upNext(slug, limit),
    queryFn: () => getArticleUpNext(slug, limit != null ? { limit } : {}),
    staleTime: 5 * 60 * 1000,
  });

  const items = data ?? [];
  if (isError || (!isLoading && items.length < 3)) return null;

  return (
    <section className="w-full bg-white py-2 container mx-auto px-4" aria-label="Up next articles">
      <div className="space-y-6">
        <div className="flex items-center gap-4 my-6">
          <span className="flex-1 h-px bg-[#000000]" />
          <span className="text-[#09339B] text-[20px] font-medium whitespace-nowrap">Up Next</span>
          <span className="flex-1 h-px bg-[#000000]" />
        </div>

        {isLoading && items.length === 0 ? (
          <p className="text-sm text-[#6C6C6C] py-2">Loading suggestions…</p>
        ) : (
          items.map((post) => <UpNextArticleBlock key={post.id} post={post} />)
        )}
      </div>
    </section>
  );
}
