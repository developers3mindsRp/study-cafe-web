import Link from "next/link";
import React from "react";
import { ArticleListItem, ArticleCategoryItem } from "@/services/platform.service";

interface BlogListProps {
  articles: ArticleListItem[];
  categories: ArticleCategoryItem[];
  activeCategory: string;
  currentPage: number;
  totalPages: number;
  onCategoryChange: (slug: string) => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
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
}: BlogListProps) {

  const allCategories = [{ id: 0, name: "All", slug: "" }, ...categories];

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section className="w-full py-6 md:py-12 px-2 md:px-6 text-center">
      {/* Category Filter */}
      <div className="container mx-auto px-4">
        <div className="flex md:flex-wrap gap-3 overflow-x-auto md:overflow-visible no-scrollbar">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              className={`flex-shrink-0 px-5 py-2 rounded-md whitespace-nowrap transition border ${(activeCategory === cat.slug || (activeCategory === "" && cat.slug === ""))
                ? "bg-[#09339B] text-white"
                : "bg-transparent text-[#767676]"
                }`}
              onClick={() => onCategoryChange(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 md:mt-10 mx-auto container px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl shadow-md border bg-white overflow-hidden animate-pulse">
                <div className="w-full h-[243px] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-full" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center md:py-20">
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No Blog Found
            </h3>
            <p className="text-gray-400">
              There are no blogs available in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((b) => (
              <div
                key={b.id}
                className="rounded-xl shadow-md border bg-white overflow-hidden text-left"
              >
                <div className="relative w-full xl:h-[243px]">
                  <img
                    src={b.cover_image_url || b.thumbnail_url || "/images/b1.jpg"}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {b.categories && b.categories.length > 0 && (
                    <span className="absolute top-4 left-4 bg-white text-[#252525] text-[14px] font-normal px-2 py-1 rounded-[14px]">
                      {b.categories[0].name}
                    </span>
                  )}
                </div>

                <div className="p-3 xl:p-4">
                  <div className="flex items-center gap-2 md:gap-2 xl:text-[16px] text-[#AFAFAF] mb-3">
                    <span className="flex gap-1">
                      <img src="/images/user.svg" alt="" width="20" height="20" />
                      {b.author_name || "Admin"}
                    </span>
                    <span className="flex gap-2">
                      <img src="/images/calendar.svg" alt="" width="20" height="10" />
                      {formatDate(b.published_at)}
                    </span>
                  </div>

                  <h3 className="font-medium text-[16px] text-[20px] xl:text-[26px] text-[#252525] leading-tight mb-4 line-clamp-2">
                    {b.title}
                  </h3>

                  <Link href={`/blogs/${b.slug}`}>
                    <button className="text-sm bg-[#09339B] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      Read More
                      <img src="/images/arrow-left.svg" alt="" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2 mb-6">
          {/* Left Arrow */}
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-9 h-9 rounded border  ${currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed rounded-full"
              : "bg-white hover:bg-gray-100 rounded-full"
              }`}
          >
            <img src="/images/f-left.svg" alt="" className='ml-1' />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = currentPage - 2 + i;
            // Adjust bounds if we are near the start or end
            if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;

            // Ensure we don't go out of bounds (can happen if totalPages < 5)
            if (pageNum < 1 || pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded border text-sm shadow-sm ${currentPage === pageNum
                    ? "bg-[#09339B] text-white rounded-full"
                    : "bg-white hover:bg-gray-100 rounded-full text-gray-700"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Right Arrow */}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-9 h-9 rounded border ${currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed rounded-full "
              : "bg-white hover:bg-gray-100 rounded-full"
              }`}
          >
            <img src="/images/f-right.svg" alt="" className='ml-1' />
          </button>
        </div>
      )}

    </section>
  );
}