import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { CourseCat, PublicCourse, PaginatedCourses } from "@/types/models.types";
import type { CourseQueryParams } from "@/services/platform.service";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatPrice(val?: string | number | null) {
  if (val == null) return null;
  const n = Number(val);
  if (!Number.isFinite(n)) return String(val);
  return `₹ ${n.toLocaleString("en-IN")}`;
}

// ─── course card ─────────────────────────────────────────────────────────────

function CourseCard({ c }: { c: PublicCourse }) {
  const href = c.slug ? `/course/${c.slug}` : `/course/${c.id}`;
  const thumbnail = c.thumbnail_url || "/images/home/f1.jpg";
  const rating = c.ratings ? Number(c.ratings).toFixed(1) : null;
  const enrolled = c.enrolled_count ? c.enrolled_count.toLocaleString("en-IN") : null;
  const oldPrice = formatPrice(c.price);
  const newPrice = formatPrice(c.sale_price);

  return (
  <Link href={href}>
    <div className="bg-white shadow-md rounded-md overflow-hidden">
     <div className="relative w-full h-[200px] xl:h-[243px]">
        <Image src={thumbnail} alt={c.title} fill className="object-cover" />
        {rating && (
          <span className="absolute flex gap-1 top-2 right-4 bg-white px-2 py-1 rounded-full text-sm shadow font-normal mt-2">
            <img src="/images/icons/star.svg" alt="" className="w-4 h-4 mt-1" /> {rating}
          </span>
        )}
      </div>
      <div className="p-3">
        {c.language && (
          <div className="flex items-center gap-4 text-[#6a6969] text-[14px] md:text-[16px]">
            <span className="flex items-center gap-1">
              <img src="/images/eng-dark.svg" alt="" width="20" height="20" />
              {Array.isArray(c.language) ? c.language.join(", ") : c.language}
            </span>
          </div>
        )}
         <h3 className="text-[16px] xl:text-[26px] font-normal text-[#252525] mt-2 mb-2 line-clamp-2">
          {c.title}
        </h3>
        {enrolled && (
          <div className="flex items-center gap-2 text-[#6a6969] text-[14px] md:text-[16px]">
            <img src="/images/user-dark.svg" alt="" width="20" height="20" />
            {enrolled} students
          </div>
        )}
        <div className="flex justify-between items-center mt-2 md:mt-4">
          <div>
            {newPrice && (
              <span className="line-through text-gray-400 xl:text-[26px]">{oldPrice}</span>
            )}
            <span className="text-[#252525] font-normal text-[16px] xl:text-[26px] ml-2">
              {newPrice ?? oldPrice}
            </span>
          </div>
        
            <button className="bg-[#09339B] text-white p-4 md:px-2 xl:px-4 py-2 rounded-md">View Course</button>
         
        </div>
      </div>
    
    </div>
  </Link> 
  );
}

// ─── skeleton loader ─────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-10 container mx-auto px-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-gray-100 animate-pulse rounded-md h-[360px]" />
      ))}
    </div>
  );
}

// ─── sort label ↔ API value mapping ──────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  // { label: "Most Enrolled", value: "latest" },
  // { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
] as const;

const PRICE_OPTIONS = [
  { label: "All Prices", value: "all" },
  { label: "Free", value: "free" },
  { label: "₹0 - ₹500", value: "0-500" },
  { label: "₹500 - ₹1000", value: "500-1000" },
  { label: "₹1000+", value: "1000+" },
] as const;

// ─── props ───────────────────────────────────────────────────────────────────

interface Props {
  cats: CourseCat[];
  initialCourses: PaginatedCourses;
  initialQuery: CourseQueryParams;
}

const ALL_CAT: CourseCat = { id: 0, name: "All Categories", slug: "all" };

// ─── main component ──────────────────────────────────────────────────────────

export default function CoursesPage({ cats = [], initialCourses, initialQuery }: Props) {

  console.log(cats,"cats")
  const router = useRouter();

  // ── local state ──
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const start = () => setNavigating(true);
    const end = () => setNavigating(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router.events]);

  // ── build URL query from current filters ──
  const buildQuery = (overrides: Partial<CourseQueryParams> & { q?: string } = {}) => {
    const base: Record<string, string> = {};
    const cat = overrides.category ?? initialQuery.category;
    const pg = overrides.page ?? initialQuery.page ?? 1;
    const search = overrides.q ?? initialQuery.search ?? "";
    const sort = overrides.sort ?? initialQuery.sort ?? "latest";
    const price = overrides.price ?? initialQuery.price ?? "all";

    if (cat && cat !== "all") base.category = cat;
    if (pg > 1) base.page = String(pg);
    if (search.trim()) base.q = search.trim();
    if (sort !== "latest") base.sort = sort;
    if (price !== "all") base.price = price;
    return base;
  };

  const navigate = (overrides: Parameters<typeof buildQuery>[0]) => {
    router.push(
      { pathname: "/courses", query: buildQuery(overrides) },
      undefined,
      { shallow: false }
    );
  };

  // ── derived values from SSR data ──
  const allCats = [ALL_CAT, ...cats];
  const activeCategory = initialQuery.category ?? "all";
  const activeCatName = allCats.find((c) => c.slug === activeCategory)?.name ?? "All Categories";
  const sortLabel = SORT_OPTIONS.find((o) => o.value === initialQuery.sort)?.label ?? "Latest";
  const priceLabel = PRICE_OPTIONS.find((o) => o.value === initialQuery.price)?.label ?? "All Prices";
  const currentPage = initialQuery.page ?? 1;

  const { data: courses, total, pageCount } = initialCourses;

  const hasActiveFilters =
    (initialQuery.search ?? "").trim() !== "" ||
    activeCategory !== "all" ||
    (initialQuery.price ?? "all") !== "all" ||
    (initialQuery.sort ?? "latest") !== "latest";

  // ─── render ───────────────────────────────────────────────────────────────


  console.log(courses,"courses")

  return (
    <div className="container px-4 mx-auto">

      {/* ── Filter bar ── */}
      <div className="filter-bar mb-10 mt-10 md:px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:flex md:gap-4 px-4 md:px-0 md:flex-wrap md:items-center">

          {/* Sort */}
            <div className="relative inline-block w-full sm:w-auto">
              <select
            value={sortLabel}
            onChange={(e) => {
              const val = SORT_OPTIONS.find((o) => o.label === e.target.value)?.value ?? "latest";
              navigate({ sort: val, page: 1 });
            }}
               className="border p-2 pr-8 m-2 md:m-0 rounded-[10px] text-ellipsis appearance-none w-full sm:w-[180px] md:w-[200px] lg:w-[200px] truncate"
          >
            {SORT_OPTIONS.map((o) => <option key={o.label}>{o.label}</option>)}
          </select>
          
            <svg
              className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
         </div>

          {/* Category */}
          <div className="relative inline-block w-full sm:w-auto">

            <select
              value={activeCatName}
              onChange={(e) => {
                const cat = allCats.find((c) => c.name === e.target.value) ?? ALL_CAT;
                navigate({ category: cat.slug, page: 1 });
              }}
              className="border p-2 pr-8 m-2 md:m-0 rounded-[10px] text-ellipsis appearance-none w-full sm:w-[180px] md:w-[200px] lg:w-[200px] truncate"
            >
              {allCats.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>

            <svg
              className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>

          </div>
          

          {/* Level — UI only (backend doesn't track level yet) */}
          {/* <select className="border p-2 m-2 md:m-0 rounded-[10px]" disabled>
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select> */}

          {/* Price */}
              <div className="relative inline-block w-full sm:w-auto">
              <select
            value={priceLabel}
            onChange={(e) => {
              const val = PRICE_OPTIONS.find((o) => o.label === e.target.value)?.value ?? "all";
              navigate({ price: val, page: 1 });
            }}
             className="border p-2 pr-8 m-2 md:m-0 rounded-[10px] text-ellipsis appearance-none w-full sm:w-[180px] md:w-[200px] lg:w-[200px] truncate"
          >
            {PRICE_OPTIONS.map((o) => <option key={o.label}>{o.label}</option>)}
          </select>
                   
            <svg
              className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
        </div>

          {/* Author — placeholder */}
          {/* <select className="border p-2 m-2 md:m-0 rounded-[10px]" disabled>
            <option>All Author/faculty</option>
          </select> */}

          {/* Clear button — only when filters active */}
          {hasActiveFilters && (
            <button
              className="border p-2 m-2 md:m-0 rounded-[10px] text-[#09339B] flex items-center gap-2 whitespace-nowrap"
              onClick={() => router.push({ pathname: "/courses", query: {} })}
            >
              Clear All Filter
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="mt-[2px]">
                <path
                  d="M8.75 0.75L0.75054 8.74947M8.74947 8.75L0.75 0.750567"
                  stroke="#09339B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>


      {/* Cards Grid */}
      {navigating ? (
        <SkeletonGrid />
      ) : courses.length === 0 ? (
        <div className="col-span-3 py-20 text-center text-gray-400 text-lg">
          No courses found.{" "}
          {hasActiveFilters && (
            <button
              className="text-[#09339B] underline ml-1"
              onClick={() => router.push({ pathname: "/courses", query: {} })}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10 container mx-auto px-4">
          {courses.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2 mb-6 flex-wrap">
          {/* Prev */}
          <button
            onClick={() => navigate({ page: currentPage - 1 })}
            disabled={currentPage <= 1}
            className={`w-9 h-9 flex items-center justify-center rounded-full border ${currentPage <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"
              }`}
          >
            <img src="/images/f-left.svg" alt="Previous" className="ml-1" />
          </button>

          {/* Smart page numbers with ellipsis */}
          {(() => {
            const pages: (number | "...")[] = [];
            if (pageCount <= 7) {
              for (let i = 1; i <= pageCount; i++) pages.push(i);
            } else {
              pages.push(1);
              if (currentPage > 3) pages.push("...");
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(pageCount - 1, currentPage + 1);
              for (let i = start; i <= end; i++) pages.push(i);
              if (currentPage < pageCount - 2) pages.push("...");
              pages.push(pageCount);
            }
            return pages.map((p, idx) =>
              p === "..." ? (
                <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => navigate({ page: p as number })}
                  className={`w-9 h-9 rounded-full border-2 border-[#EDF1F3] text-sm shadow-sm transition-colors ${currentPage === p
                      ? "bg-[#09339B] text-white border-[#09339B]"
                      : "bg-white hover:bg-gray-100 text-[#454545]"
                    }`}
                >
                  {p}
                </button>
              )
            );
          })()}

          {/* Next */}
          <button
            onClick={() => navigate({ page: currentPage + 1 })}
            disabled={currentPage >= pageCount}
            className={`w-9 h-9 flex items-center justify-center rounded-full border ${currentPage >= pageCount ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"
              }`}
          >
            <img src="/images/f-right.svg" alt="Next" className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
