"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/services/platform.service";
import { queryKeys } from "@/lib/react-query";
import Image from "next/image";
import { articleHref } from "@/lib/articlePaths";

const PLACEHOLDER_IMGS = ["/images/b1.jpg", "/images/b2.png", "/images/b3.png"];

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function BlogCard({
  img,
  tag,
  author,
  date,
  title,
  slug,
  id,
  size = "desktop",
}: {
  img: string;
  tag: string;
  author: string;
  date: string;
  title: string;
  slug: string;
  id: number;
  size?: "mobile" | "desktop";
}) {
  const isMobile = size === "mobile";
  return (
    <div
      className={
        isMobile
          ? "min-w-[320px] snap-center rounded-xl shadow-md border bg-white overflow-hidden text-left"
          : "rounded-xl shadow-md border bg-white overflow-hidden text-left w-full max-w-[500px]"
      }
    >
      <div className={`relative w-full ${isMobile ? "h-[200px]" : "xl:h-[233px]"}`}>
        <Image width={500} height={300} src={img} alt={title} className="w-full h-full object-cover" crossOrigin="anonymous" />
        <span className="absolute top-4 left-4 bg-white text-[#252525] text-[10px] md:text-[14px] font-normal px-2 py-1 rounded-[14px]">
          {tag}
        </span>
      </div>

      <div className="p-4">
        <div
          className={`flex items-center gap-2 text-[#AFAFAF] mb-3 ${
            isMobile ? "text-[12px]" : "md:text-[14px] xl:text-[16px]"
          }`}
        >
          <span className="flex gap-1">
            <img src="/images/user.svg" alt="" width={isMobile ? 10 : 20} height={isMobile ? 10 : 20} />
            {author}
          </span>
          <span className="flex gap-1 md:gap-2">
            <img src="/images/calendar.svg" alt="" width={isMobile ? 10 : 20} height={10} />
            {date}
          </span>
        </div>

        <h3
          className={`font-medium text-[#252525] leading-tight mb-4 line-clamp-2  ${
            isMobile ? "text-[14px]" : "md:text-[20px] xl:text-[26px]"
          }`}
        >
          {title}
        </h3>

        <Link href={articleHref(slug, id)}>
          <button className="text-[12px] md:text-sm bg-[#09339B] hover:bg-blue-700 text-white px-4 py-1 md:py-2 rounded-md flex items-center gap-2">
            Read More
            <img src="/images/arrow-left.svg" alt="" />
          </button>
        </Link>
      </div>
    </div>
  );
}

function BlogCardSkeleton({ size = "desktop" }: { size?: "mobile" | "desktop" }) {
  const isMobile = size === "mobile";
  return (
    <div
      className={
        isMobile
          ? "min-w-[320px] snap-center rounded-xl shadow-md border bg-white overflow-hidden text-left animate-pulse"
          : "rounded-xl shadow-md border bg-white overflow-hidden text-left animate-pulse "
      }
    >
      <div className={`bg-gray-200 w-full ${isMobile ? "h-[200px]" : "xl:h-[233px] h-[160px]"}`} />
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-7 bg-gray-200 rounded w-24 mt-2" />
      </div>
    </div>
  );
}

export default function BlogSection() {
  const [step, setStep] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.articles.list({ limit: 9 }),
    queryFn: () => getArticles({ page: 1, limit: 9 }),
    staleTime: 5 * 60 * 1000,
  });

  const blogs = (data?.data ?? []).map((article, i) => ({
    img: article.thumbnail_url || PLACEHOLDER_IMGS[i % PLACEHOLDER_IMGS.length],
    tag: article.categories?.[0]?.name || "Blog",
    author: article.author_name || "Studycafe",
    date: formatDate(article.published_at || article.created_at),
    title: article.title,
    slug: article.slug,
    id: Number(article.id),
  }));

  // Use skeletons while loading
  const skeletons = Array.from({ length: 9 });
  const hasData = blogs.length > 0;

  const totalSteps = hasData ? Math.ceil(blogs.length / 3) : Math.ceil(skeletons.length / 3);
  const startIndex = (step - 1) * 3;
  const visibleBlogs = hasData ? blogs.slice(startIndex, startIndex + 3) : [];
  const visibleSkeletons = isLoading ? skeletons.slice(startIndex, startIndex + 3) : [];

  const next = () => { if (step < totalSteps) setStep(step + 1); };
  const prev = () => { if (step > 1) setStep(step - 1); };
  const progress = (step / totalSteps) * 100;

  return (
    <section className="w-full py-8 md:py-12 bg-[url('/images/course-bg.png')] bg-no-repeat bg-cover bg-center px-6 text-center">
      <h2 className="text-[30px] xl:text-[40px] font-semibold text-[#1A1A1A]">
        Latest from Our Blog
      </h2>
      <p className="text-[16px] md:text-[20px] xl:text-[24px] text-gray-600 max-w-md mx-auto mt-2">
        Stay updated with the latest insights, tips, and industry trends
      </p>

      {/* Mobile — horizontal scroll through all */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden mt-10 pb-4 px-2 scrollbar-hide">
        {isLoading
          ? skeletons.map((_, i) => <BlogCardSkeleton key={i} size="mobile" />)
          : blogs.map((b, i) => <BlogCard key={i} {...b} size="mobile" />)}
      </div>

      {/* Desktop — paginated 3 at a time */}
      <div className="hidden md:flex gap-6 mt-10 justify-center container mx-auto px-6">
        {isLoading
          ? visibleSkeletons.map((_, i) => <BlogCardSkeleton key={i} size="desktop" />)
          : visibleBlogs.map((b, i) => <BlogCard key={i} {...b} size="desktop" />)}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center container mx-auto mt-4 md:mt-10 px-4">
        {/* Prev / Next */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={prev}
            disabled={step <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white shadow disabled:opacity-40"
          >
            <img src="/images/f-left.svg" alt="previous" />
          </button>
          <button
            onClick={next}
            disabled={step >= totalSteps}
            className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white shadow disabled:opacity-40"
          >
            <img src="/images/f-right.svg" alt="next" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:block flex-grow mx-4 h-[4px] bg-gray-300 rounded-full relative overflow-hidden">
          <div
            className="h-full bg-[#09339B] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* View All */}
        <div className="w-full flex justify-center md:w-auto md:justify-end">
          <Link href="/blogs">
            <button className="text-sm text-[#09339B] font-medium flex items-center gap-1 p-2 pl-4 pr-4 bg-white rounded-[10px] shadow">
              View All Blogs
              <img src="/images/icons/blue_arrow.png" alt="" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
