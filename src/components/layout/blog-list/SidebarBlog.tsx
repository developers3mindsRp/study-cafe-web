import Link from "next/link";
import Image from "next/image";
import type {
  BlogSpotlightArticleCard,
  BlogSpotlightTag,
  SiteAdsSlot,
} from "@/types/models.types";
import SiteAdBanner from "@/components/ads/SiteAdBanner";
import { slotHasContent } from "@/lib/siteDisplayAds";
import { cardThumb } from "./blogImage";
import { isUnoptimizedImageSrc } from "@/utils/mediaUrl";

import { articleHref } from "@/lib/articlePaths";

function postHref(slug: string | null | undefined, id?: number | null) {
  const s = slug?.trim();
  if (!s && (id == null || !Number.isFinite(Number(id)))) return "/blogs";
  return articleHref(s || "article", id ?? null);
}

type Props = {
  recentPosts?: BlogSpotlightArticleCard[];
  allPosts?: BlogSpotlightArticleCard[];
  popularTags?: BlogSpotlightTag[];
  /** Up to two banners above “Recent Posts” (article detail sidebar). */
  detailSidebarAds?: SiteAdsSlot[] | null;
};

export default function SidebarBlog({
  recentPosts = [],
  allPosts = [],
  popularTags = [],
  detailSidebarAds,
}: Props) {
  const sidebarTop = detailSidebarAds?.slice(0, 2).filter(slotHasContent) ?? [];

  return (
    <div className="space-y-5 sticky top-24">
      {sidebarTop.length > 0 ? (
        <div className="space-y-4">
          {sidebarTop.map((slot, idx) => (
            <SiteAdBanner key={`top-ad-${idx}`} slot={slot} />
          ))}
        </div>
      ) : null}

      <div className="bg-[#F9F9FB] space-y-3">
        <p className="font-bold text-[26px] bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none text-white p-3 md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto mb-6 md:mb-0">
          Recent Posts
        </p>

        <div className="flex md:block gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide">
          {recentPosts.length === 0 ? (
            <p className="text-sm text-[#6C6C6C] px-3 py-2">No recent posts.</p>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="snap-start min-w-[80%] md:min-w-full bg-white md:mb-8 md:p-0">
                <Link href={postHref(post.slug, post.id)} className="block">
                  {/* Resized WebP rather than the raw upload. `src` resolves to the same URL on
                      server and client (resolveApiAssetUrl reads build-time env only), so
                      next/image's srcset hydrates cleanly. Mobile: 80%-wide swipe cards;
                      md: full-width list; lg+: the one-third sidebar column. */}
                  <Image
                    src={cardThumb(post.thumbnail_url || post.cover_image_url)}
                    alt=""
                    width={500}
                    height={300}
                    unoptimized={isUnoptimizedImageSrc(cardThumb(post.thumbnail_url || post.cover_image_url))}
                    sizes="(max-width: 767px) 80vw, (max-width: 1023px) 100vw, 33vw"
                    className="rounded w-full object-cover aspect-[5/3]"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-[16px] font-medium mt-2 xl:text-[20px] line-clamp-2 flex flex-wrap items-center gap-2">
                    {post.title}
                    {post.blog_access_tier === "premium" && (
                      <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                        Premium
                      </span>
                    )}
                  </p>
                </Link>
                <div className="hidden md:block border-b border-[#AFAFAF] p-2 w-full" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-[#F9F9FB] md:px-5 space-y-3">
        <p className="font-bold text-[26px] bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none text-white p-3 md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto mb-6 md:mb-0">
          All Posts
        </p>

        <div className="flex md:block gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide">
          {allPosts.length === 0 ? (
            <p className="text-sm text-[#6C6C6C] px-3 py-2">No additional posts.</p>
          ) : (
            allPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="snap-start min-w-[80%] md:min-w-full bg-white md:mb-8 md:p-0">
                <Link href={postHref(post.slug, post.id)} className="block">
                  {/* Resized WebP rather than the raw upload. `src` resolves to the same URL on
                      server and client (resolveApiAssetUrl reads build-time env only), so
                      next/image's srcset hydrates cleanly. Mobile: 80%-wide swipe cards;
                      md: full-width list; lg+: the one-third sidebar column. */}
                  <Image
                    src={cardThumb(post.thumbnail_url || post.cover_image_url)}
                    alt=""
                    width={500}
                    height={300}
                    unoptimized={isUnoptimizedImageSrc(cardThumb(post.thumbnail_url || post.cover_image_url))}
                    sizes="(max-width: 767px) 80vw, (max-width: 1023px) 100vw, 33vw"
                    className="rounded w-full object-cover aspect-[5/3]"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-[15px] font-medium mt-2 md:text-[20px] line-clamp-2 flex flex-wrap items-center gap-2">
                    {post.title}
                    {/* {post.blog_access_tier === "premium" && (
                      <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                        Premium
                      </span>
                    )} */}
                  </p>
                </Link>
                <div className="hidden md:block border-b border-[#AFAFAF] p-2 w-full" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Link
          href="/blogs"
          className="inline-flex w-full items-center justify-center rounded-[10px] border border-[#09339B] p-2 text-center text-[20px] font-medium text-[#09339B] hover:bg-[#09339B] hover:text-white"
        >
          View All
        </Link>
      </div>

      <div className="bg-white px-5 space-y-6 md:space-y-3">
        <h4 className="text-[20px] font-medium mb-4 bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none text-white p-3 md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto md:mb-0">
          Tags
        </h4>
        {popularTags.length === 0 ? (
          <p className="text-sm text-[#6C6C6C]">No tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2 text-[18px]">
            {popularTags.map((t) => (
              <Link
                key={t.id}
                href={{ pathname: "/blogs", query: { search: t.name } }}
                className="bg-white rounded-[14px] border border-black px-4 md:border-[#AFAFAF] hover:border-[#09339B] text-[15px]"
              >
                {t.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <hr />

      <div className="rounded xl:px-5 space-y-4">
        <div className="bg-[#09339B] shadow rounded p-5 space-y-3 md:space-y-6 text-white text-center">
          <h2 className="text-[20px] font-bold">StudyCafe Membership</h2>
          <p className="xl:text-[18px]">For More details about Membership Click Join Membership Button</p>
          <Link href="/plans">
            <button type="button" className="pl-10 pr-10 p-2 bg-white text-[#09339B] text-[20px] rounded mt-6">
              View Membership
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
