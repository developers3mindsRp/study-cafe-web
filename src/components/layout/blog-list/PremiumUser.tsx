"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type {
  ArticleBySlug,
  BlogSpotlightArticleCard,
  BlogSpotlightAuthor,
  RelatedArticle,
} from "@/types/models.types";
import { resolveBlogImageSrc } from "./blogImage";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function authorLocation(a: BlogSpotlightAuthor) {
  const parts = [a.city, a.state, a.country].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function authorHeadline(a: BlogSpotlightAuthor) {
  return a.designation?.trim() || a.profession?.trim() || "Author";
}

/* ─── Social Buttons ────────────────────────────────────────────── */
function SocialButtons() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center pt-2 gap-4">
      <button
        type="button"
        className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#34C759] px-6 md:px-6 py-2 rounded-[10px] text-[#34C759] font-medium hover:bg-[#34C759] hover:text-white transition"
      >
        <img src="/images/whatsapp.png" alt="" className="w-4 h-4" />
        <span>Join WhatsApp Group</span>
      </button>
      <button
        type="button"
        className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#039BE5] px-6 md:px-6 py-2 rounded-[10px] text-[#039BE5] font-medium hover:bg-[#039BE5] hover:text-white transition"
      >
        <img src="/images/telegram-round.png" alt="" className="w-4 h-4" />
        <span>Join Telegram Group</span>
      </button>
      <button
        type="button"
        className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#252525] px-6 md:px-6 py-2 rounded-[10px] text-[#252525] font-medium hover:bg-[#252525] hover:text-white transition"
      >
        <img src="/images/google.png" alt="" className="w-4 h-4" />
        <span>Follow On Google News</span>
      </button>
    </div>
  );
}

/* ─── Also Read (sidebar / reference layout) ───────────────────── */
function AlsoReadBlock({ related }: { related: RelatedArticle[] }) {
  if (!related?.length) return null;
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-lg font-bold tracking-tight text-[#252525] md:text-xl">
        Also Read
      </h3>
      <div className="space-y-4">
        {related.map((r) => (
          <Link
            key={r.id}
            href={`/blogs/${encodeURIComponent(r.slug)}`}
            className="block text-[15px] font-normal leading-snug text-[#09339B] no-underline hover:underline md:text-[16px]"
          >
            {r.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Premium Modal ─────────────────────────────────────────────── */
type PremiumModalProps = {
  onClose: () => void;
  title?: string;
  description?: string;
};

function PremiumModal({
  onClose,
  title = "Unlock The Full Article",
  description = "This article is available exclusively for",
}: PremiumModalProps) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white md:max-w-xl w-full rounded-lg p-12 relative shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/images/lock1.png" alt="Premium Content" className="w-6 h-6" />
          <h4 className="text-[#929292] text-center text-sm font-medium">
            Premium Content
          </h4>
        </div>

        <h2 className="text-[40px] font-semibold text-[#252525] mb-4 text-center">
          {title}
        </h2>

        <p className="text-[#929292] leading-7 text-center text-[16px]">
          {description} <strong className="text-black">Premium Members</strong>.
        </p>

        <div className="flex flex-col mx-auto md:px-32 gap-4 mt-6">
          <button
            onClick={() => { onClose(); router.push("/login"); }}
            className="border border-[#09339B] text-[#09339B] bg-white px-6 py-2 rounded-md hover:bg-[#09339B] hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => { onClose(); router.push("/payment"); }}
            className="bg-[#09339B] text-white px-6 py-2 rounded-md"
          >
            Upgrade to Premium
          </button>
          <button
            onClick={onClose}
            className="text-[#09339B] border border-[#09339B] bg-white px-6 py-2 rounded-md"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Download Button ────────────────────────────────────────────── */
function DownloadButton({
  downloadUrl,
  canDownload,
  onGated,
}: {
  downloadUrl: string;
  canDownload: boolean;
  onGated: () => void;
}) {
  const resolvedUrl = resolveApiAssetUrl(downloadUrl);

  const handleClick = () => {
    if (!canDownload) {
      onGated();
      return;
    }
    window.open(resolvedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex justify-center pt-2">
      <button
        type="button"
        onClick={handleClick}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#09339B] text-white px-6 sm:px-10 py-2.5 rounded-[10px] font-medium hover:bg-[#07287a] transition"
      >
        {/* PDF icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
        To Read Full Judgment, Download PDF Given Below
      </button>
    </div>
  );
}

/* ─── Inline Recent / All Posts ─────────────────────────────────── */
function PostListBlock({
  title,
  posts,
  emptyText,
}: {
  title: string;
  posts: BlogSpotlightArticleCard[];
  emptyText?: string;
}) {
  return (
    <div className="mt-8">
      <h3 className="font-medium text-[20px] md:text-[26px] mb-4 bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none text-white p-3 md:text-gray-900 md:px-0 md:py-0">
        {title}
      </h3>
      {posts.length === 0 ? (
        <p className="text-sm text-[#6C6C6C] py-2">{emptyText ?? "No posts available."}</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="border border-[#AFAFAF] rounded-[10px] p-3">
              <Link
                href={`/blogs/${encodeURIComponent(post.slug)}`}
                className="inline-flex flex-wrap items-center gap-2 text-[#09339B] text-[15px] md:text-[17px] font-medium hover:underline"
              >
                {post.title}
                {post.blog_access_tier === "premium" && (
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                    Premium
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Inline Tags ────────────────────────────────────────────────── */
function TagsBlock({ tags }: { tags: import("@/types/models.types").BlogSpotlightTag[] }) {
  return (
    <div className="mt-8">
      <h3 className="font-medium text-[20px] md:text-[26px] mb-4 bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none text-white p-3 md:text-gray-900 md:px-0 md:py-0">
        Tags
      </h3>
      {tags.length === 0 ? (
        <p className="text-sm text-[#6C6C6C] py-2">No tags yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Link
              key={t.id}
              href={{ pathname: "/blogs", query: { search: t.name } }}
              className="bg-white rounded-[14px] border border-[#AFAFAF] hover:border-[#09339B] text-[#252525] hover:text-[#09339B] text-[14px] px-4 py-1.5 transition"
            >
              {t.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

type Props = {
  article: ArticleBySlug | null;
  authorSpotlight: BlogSpotlightAuthor | null;
  authorRecent: BlogSpotlightArticleCard[];
  recentPosts?: BlogSpotlightArticleCard[];
  allPosts?: BlogSpotlightArticleCard[];
  popularTags?: import("@/types/models.types").BlogSpotlightTag[];
};

export default function Premium_user({
  article,
  authorSpotlight,
  authorRecent,
  recentPosts = [],
  allPosts = [],
  popularTags = [],
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const access = article?.access;
  const canReadFull = access?.can_read_full;
  const canDownload = access?.can_download ?? false;
  const downloadUrl = article?.download_url ?? null;

  // Fallback author name from the article itself when a full profile isn't available
  const fallbackAuthorName =
    authorSpotlight?.display_name ||
    authorSpotlight?.name ||
    (article?.author_name != null ? String(article.author_name) : null);

  return (
    <section className="w-full bg-white py-2 container mx-auto px-4">
      <div className="space-y-6">
        {article ? (
          <>
            {/* ──────────── LOCKED STATE (Premium preview) ──────────── */}
            {!canReadFull ? (
              <>
                {/* Article preview card — matches original BlogHighlightCard */}
                <div className="space-y-4 border border-[#AFAFAF] shadow-md rounded-[10px] px-4 py-4">
                  {article.blog_access_tier === "premium" && (
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                      Premium
                    </span>
                  )}
                  <h2 className="text-[15px] md:text-[20px] font-bold text-[#252525]">{article.title}</h2>

                  <div
                    className="article-rich-text max-w-none text-[16px] text-[#454545] md:text-[17px]"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: article.body }}
                  />

                  {/* Read More button → Premium modal */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setIsOpen(true)}
                      className="w-full sm:w-auto border border-[#09339B] px-6 sm:px-32 py-2 rounded-[10px] text-[#09339B] font-medium hover:bg-[#09339B] hover:text-white transition"
                    >
                      Read More
                    </button>
                  </div>

                  {/* Download PDF — always premium-gated */}
                  {downloadUrl && (
                    <DownloadButton
                      downloadUrl={downloadUrl}
                      canDownload={canDownload}
                      onGated={() => setIsDownloadModalOpen(true)}
                    />
                  )}

                  <SocialButtons />
                </div>

                {article.related_articles && article.related_articles.length > 0 && (
                  <AlsoReadBlock related={article.related_articles} />
                )}
              </>
            ) : (
              /* ──────────── UNLOCKED STATE (Full content) ──────────── */
              <>
                <div className="space-y-4 border border-[#AFAFAF] shadow-md rounded-[10px] px-4 py-4">
                  {article.blog_access_tier === "premium" && (
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                      Premium
                    </span>
                  )}
                  <h2 className="text-[20px] font-bold text-[#252525]">{article.title}</h2>
                  <div
                    className="article-rich-text max-w-none text-[16px] text-[#454545]"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: article.body }}
                  />

                  {/* Download PDF — always premium-gated */}
                  {downloadUrl && (
                    <DownloadButton
                      downloadUrl={downloadUrl}
                      canDownload={canDownload}
                      onGated={() => setIsDownloadModalOpen(true)}
                    />
                  )}

                  {article.related_articles && article.related_articles.length > 0 && (
                    <AlsoReadBlock related={article.related_articles} />
                  )}

                  <SocialButtons />
                </div>
              </>
            )}
          </>
        ) : (
          <p className="text-center text-[#6C6C6C] py-8">Article content is not available.</p>
        )}
      </div>

      {/* Modals — rendered at section level so they work in both locked and unlocked states */}
      {isOpen && <PremiumModal onClose={() => setIsOpen(false)} />}
      {isDownloadModalOpen && (
        <PremiumModal
          onClose={() => setIsDownloadModalOpen(false)}
          title="Unlock to Download Judgment"
          description="PDF downloads are available exclusively for"
        />
      )}

      {/* ──────────── About Author ──────────── */}
      {fallbackAuthorName && (
        <div className="container mx-auto mt-10">
          <h2 className="text-[20px] md:text-[30px] font-medium mb-6 bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none text-white p-3 md:text-gray-900 md:px-0 py-3 md:py-0 mx-auto md:mx-0 md:w-auto md:mb-4">
            About Author
          </h2>

          <div className="flex items-start gap-4">
            <div className="rounded-[10px] p-2 md:p-3 bg-[#F9F9FB] w-full">
              <div className="flex flex-row items-center gap-6 md:gap-4 ml-6 pb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    resolveBlogImageSrc(authorSpotlight?.profile_pic_url?.trim()) || "/images/author.png"
                  }
                  width={54}
                  height={54}
                  alt=""
                  className="rounded-full object-cover w-[54px] h-[54px]"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <h3 className="font-semibold text-[18px] md:text-[20px] text-[#252525]">
                    {fallbackAuthorName}
                  </h3>
                  {authorSpotlight && (
                    <h3 className="text-[#09339B] text-[16px] md:text-[20px]">{authorHeadline(authorSpotlight)}</h3>
                  )}
                </div>
              </div>
              {authorSpotlight && (
                <div className="flex flex-wrap items-center gap-3 mt-4 ml-6 pb-4">
                  {authorSpotlight.company ? (
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 bg-[#0C479C] text-white rounded-[10px]">
                      <img src="/images/building.png" alt="" className="w-3 md:w-5 h-3 md:h-5" />
                      <span className="text-[12px] md:text-[16px] font-medium">{authorSpotlight.company}</span>
                    </div>
                  ) : null}
                  {authorLocation(authorSpotlight) ? (
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 bg-[#0C479C] text-white rounded-[10px]">
                      <img src="/images/location-w.png" alt="" className="w-3 md:w-5 h-3 md:h-5" />
                      <span className="text-[12px] md:text-[16px] font-medium">{authorLocation(authorSpotlight)}</span>
                    </div>
                  ) : null}
                  {typeof authorSpotlight.published_article_count === "number" ? (
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 bg-[#0C479C] text-white rounded-[10px]">
                      <img src="/images/file.png" alt="" className="w-3 md:w-5 h-3 md:h-5" />
                      <span className="text-[12px] md:text-[16px] font-medium">
                        {authorSpotlight.published_article_count}
                      </span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────── My Recent Articles ──────────── */}
      {authorRecent.length > 0 && (
        <div>
          <h3 className="font-medium text-[20px] md:text-[30px] mb-6 mt-10 bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none text-white p-3 md:text-gray-900 md:px-0 py-3 md:py-0 mx-auto md:mx-0 md:w-auto md:mb-4">
            My Recent Articles
          </h3>

          <ul className="space-y-4 text-[#09339B] text-[15px] md:text-[20px] font-medium">
            {authorRecent.map((row) => (
              <li key={row.id} className="border border-[#AFAFAF] p-3 rounded-[10px]">
                <Link href={`/blogs/${row.slug}`} className="inline-flex flex-wrap items-center gap-2">
                  {row.title}
                  {row.blog_access_tier === "premium" && (
                    <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/blogs">
            <button
              type="button"
              className="text-sm bg-[#09339B] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 mt-6 w-full md:w-auto justify-center"
            >
              View All Posts
              <img src="/images/arrow-left.svg" alt="" />
            </button>
          </Link>
        </div>
      )}
    </section>
  );
}

export { formatDate };
