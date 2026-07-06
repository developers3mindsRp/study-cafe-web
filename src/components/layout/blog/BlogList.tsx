import Link from "next/link";
import React, {useEffect} from "react";
import type { SiteAdsSlot } from "@/types/models.types";
import SiteAdBanner from "@/components/ads/SiteAdBanner";
import { ArticleListItem, ArticleCategoryItem } from "@/services/platform.service";
import { articleHref } from "@/lib/articlePaths";
import { useRouter } from "next/router";


type PaginationMode = 'query' | 'path';

interface BlogListProps {
  articles: ArticleListItem[];
  categories: ArticleCategoryItem[];
  activeCategory: string;
  currentPage: number;
  totalPages: number;
  onCategoryChange: (slug: string) => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  /** Desktop right column + mobile block above listing */
  listingSidebarAd?: SiteAdsSlot | null;
  /** How pagination/category URLs are built for crawlers */
  paginationMode?: PaginationMode;
}

export default function Blog_list({
  articles,
  categories,
  activeCategory,
  currentPage,
  totalPages,
  onCategoryChange,
  onPageChange,
  isLoading = false,
  listingSidebarAd,
  paginationMode = 'query',
}: BlogListProps) {

  const router = useRouter();

  const allCategories = [{ id: 0, name: "All", slug: "all" }, ...categories];
  const hasListingAd = Boolean(listingSidebarAd?.image_url?.trim());

  const buildCategoryHref = (slug: string) => {
    if (paginationMode === 'path') {
      return `/category/${slug === 'all' ? 'all' : slug}`;
    }
    if (slug === 'all') return '/blogs';
    return `/blogs?category=${encodeURIComponent(slug)}`;
  };

  const buildPageHref = (page: number) => {
    if (paginationMode === 'path') {
      const cat = activeCategory || 'all';
      if (page <= 1) return `/category/${cat}`;
      return `/category/${cat}/page/${page}`;
    }
    if (page <= 1 && !activeCategory) return '/blogs';
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (activeCategory && activeCategory !== 'all') {
      params.set('category', activeCategory);
    }
    const qs = params.toString();
    return qs ? `/blogs?${qs}` : '/blogs';
  };

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  useEffect(() => {
    const handleRouteComplete = () => {
      window.scrollTo({
        top: 600, // or your offset value
        behavior: "smooth",
      });
    };
  
    router.events.on("routeChangeComplete", handleRouteComplete);
  
    return () => {
      router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, [router.events]);

  const articlesGridBlock = (
    <>
      {!isLoading && hasListingAd && listingSidebarAd ? (
        <div className="mb-6 text-left lg:hidden">
          <SiteAdBanner slot={listingSidebarAd} />
        </div>
      ) : null}
      {isLoading ? (
        <div className={`grid grid-cols-1 gap-6 ${hasListingAd ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border bg-white shadow-md animate-pulse">
              <div className="w-full h-[243px] bg-gray-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-6 w-full rounded bg-gray-200" />
                <div className="h-8 w-1/3 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center md:py-20">
          <h3 className="mb-2 text-2xl font-semibold text-gray-600">No Blog Found</h3>
          <p className="text-gray-400">There are no blogs available in this category.</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-6 ${hasListingAd ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {articles.map((b) => (
          <Link href={articleHref(b.slug, b.id)}>
            <div
              key={b.id}
              className="overflow-hidden rounded-xl border bg-white text-left shadow-md"
            >
            
              <div className="relative w-full xl:h-[243px]">
                <img
                  src={b.cover_image_url || b.thumbnail_url || "/images/b1.jpg"}
                  alt={b.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {b.categories && b.categories.length > 0 && (
                  <span className="absolute left-4 top-4 rounded-[14px] bg-white px-2 py-1 text-[14px] font-normal text-[#252525]">
                    {b.categories[0].name}
                  </span>
                )}
              </div>
             

              <div className="p-3 xl:p-4">
                <div className="mb-3 flex items-center gap-2 text-[#6a6969] md:gap-2 xl:text-[16px]">
                  <span className="flex gap-1">
                    <img src="/images/user-black.svg" alt="" width="20" height="20" />
                    {b.author_name || "Admin"}
                  </span>
                  <span className="flex gap-2">
                    <img src="/images/calendar-black.svg" alt="" width="20" height="10" />
                    {formatDate(b.published_at)}
                  </span>
                </div>
              
                  <h3 className="mb-4 line-clamp-2 text-[16px] font-medium leading-tight text-[#252525] md:text-[20px] xl:text-[26px]">
                    {b.title}
                  </h3>
               

            
                  <button className="flex items-center gap-2 rounded-md bg-[#09339B] px-4 py-2 text-sm text-white hover:bg-blue-700">
                    Read More
                    <img src="/images/arrow-left.svg" alt="" />
                  </button>
               
              </div>
               
            </div>
          </Link>
          ))}
        </div>
      )}
    </>
  );

  return (
    <section className="w-full py-6 md:py-12 px-2 md:px-6 text-center">
      {/* Category Filter */}
      <div className="container mx-auto px-4">
        <div className="flex md:flex-wrap gap-3 overflow-x-auto md:overflow-visible no-scrollbar">
          {allCategories.map((cat) => {
            const isActive =
              activeCategory === cat.slug || (activeCategory === "" && cat.slug === "all");
            return (
              <Link
                key={cat.id}
                href={buildCategoryHref(cat.slug)}
                className={`flex-shrink-0 px-5 py-2 rounded-md whitespace-nowrap transition border ${isActive
                  ? "bg-[#09339B] text-white"
                  : "bg-transparent text-[#767676]"
                  }`}
                onClick={() => onCategoryChange(cat.slug)}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 md:mt-10 mx-auto container px-4">
        {hasListingAd ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="space-y-8 lg:col-span-2 text-left">{articlesGridBlock}</div>
            <aside className="hidden text-left lg:col-span-1 lg:block lg:self-start lg:sticky lg:top-24">
              {listingSidebarAd ? <SiteAdBanner slot={listingSidebarAd} /> : null}
            </aside>
          </div>
        ) : (
          articlesGridBlock
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2 mb-6">
          {/* Left Arrow */}
          {currentPage > 1 ? (
            <Link
              href={buildPageHref(currentPage - 1)}
              onClick={() => handlePageClick(currentPage - 1)}
              className="w-9 h-9 rounded border bg-white hover:bg-gray-100 rounded-full flex items-center justify-center"
              aria-label="Previous page"
            >
              <img src="/images/f-left.svg" alt="" className="ml-1" />
            </Link>
          ) : (
            <span
              className="w-9 h-9 rounded border bg-gray-100 text-gray-400 cursor-not-allowed rounded-full flex items-center justify-center"
              aria-hidden
            >
              <img src="/images/f-left.svg" alt="" className="ml-1" />
            </span>
          )}

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = currentPage - 2 + i;
            // Adjust bounds if we are near the start or end
            if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;

            // Ensure we don't go out of bounds (can happen if totalPages < 5)
            if (pageNum < 1 || pageNum > totalPages) return null;

            return (
              <Link
                key={pageNum}
                href={buildPageHref(pageNum)}
                onClick={() => handlePageClick(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded border text-sm shadow-sm ${currentPage === pageNum
                    ? "bg-[#09339B] text-white rounded-full"
                    : "bg-white hover:bg-gray-100 rounded-full text-gray-700"
                  }`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </Link>
            );
          })}

          {/* Right Arrow */}
          {currentPage < totalPages ? (
            <Link
              href={buildPageHref(currentPage + 1)}
              onClick={() => handlePageClick(currentPage + 1)}
              className="w-9 h-9 rounded border bg-white hover:bg-gray-100 rounded-full flex items-center justify-center"
              aria-label="Next page"
            >
              <img src="/images/f-right.svg" alt="" className="ml-1" />
            </Link>
          ) : (
            <span
              className="w-9 h-9 rounded border bg-gray-100 text-gray-400 cursor-not-allowed rounded-full flex items-center justify-center"
              aria-hidden
            >
              <img src="/images/f-right.svg" alt="" className="ml-1" />
            </span>
          )}
        </div>
      )}

    </section>
  );
}