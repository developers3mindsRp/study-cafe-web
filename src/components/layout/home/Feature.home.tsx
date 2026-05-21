"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { getCourseCats, getCoursesByCategory } from "@/services/platform.service";
import type { CourseCat, PublicCourse } from "@/types/models.types";

const ALL_TAB: CourseCat = { id: 0, name: "Top Selling", slug: "all" };
const PAGE_SIZE = 6;

function formatPrice(val?: string | number | null) {
  if (val == null) return null;
  const n = Number(val);
  if (!Number.isFinite(n)) return String(val);
  return `₹ ${n.toLocaleString("en-IN")}`;
}

function CourseCard({ c, size }: { c: PublicCourse; size: "sm" | "lg" }) {
  const href = c.slug ? `/course/${c.slug}` : `/course/${c.id}`;
  const thumbnail = c.thumbnail_url || "/images/home/f1.jpg";
  const rating = c.ratings ? Number(c.ratings).toFixed(1) : null;
  const enrolled = c.enrolled_count ? c.enrolled_count.toLocaleString("en-IN") : null;
  const oldPrice = formatPrice(c.price);
  const newPrice = formatPrice(c.sale_price);

  if (size === "sm") {
    return (
      <div className="w-[300px] snap-center bg-white shadow-md rounded-md overflow-hidden flex-shrink-0">
        <Link href={href}>
          <div className="relative w-full h-[180px]">
            <Image src={thumbnail} alt={c.title} fill className="object-cover" />
            {rating && (
              <span className="absolute flex gap-1 top-2 right-4 bg-white px-2 py-1 rounded-full text-sm shadow mt-2">
                <img src="/images/icons/star.svg" alt="" className="w-4 h-4 mt-1" /> {rating}
              </span>
            )}
          </div>
        </Link>
        <div className="p-4 flex flex-col">
          {c.language && (
            <div className="flex flex-wrap items-center gap-4 text-[#AFAFAF] text-sm">
              <span className="flex items-center gap-1">
                <img src="/images/icons/eng-light.svg" alt="" width="20" height="20" /> {c.language.join(", ")}
              </span>
            </div>
          )}
          <Link href={href}>
          <h3 className="text-[20px] font-normal text-[#252525] mt-2 mb-2 line-clamp-2">{c.title}</h3></Link>
          {enrolled && (
            <div className="flex items-center gap-1 text-[#AFAFAF] text-sm">
              <img src="/images/icons/user-light.svg" alt="" width="20" height="20" />{enrolled} students
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <div>
              {newPrice && <span className="line-through text-[#AFAFAF] text-[15px]">{oldPrice}</span>}
              <span className="text-[#3a3c3e] font-normal text-[15px] ml-2">{newPrice ?? oldPrice}</span>
            </div>
            <Link href={href}>
              <button className="bg-[#09339B] text-white px-4 py-2 rounded-md text-sm">View Course</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden flex flex-col">
      <Link href={href}>
        <div className="relative w-full h-[250px] sm:h-[180px] md:h-[200px] xl:h-[250px]">
          <Image src={thumbnail} alt={c.title} fill className="object-cover" />
          {rating && (
            <span className="absolute flex gap-1 top-2 right-3 bg-white px-2 rounded-full text-[18px] font-normal shadow mt-4">
              <img src="/images/icons/star.svg" alt="" className="w-4 h-4 mt-1" /> {rating}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        {c.language && (
          <div className="flex flex-wrap items-center gap-4 text-[#AFAFAF] text-sm">
            <span className="flex items-center gap-1">
              <img src="/images/icons/eng-light.svg" alt="" width="20" height="20" /> {c.language.join(", ")}
            </span>
          </div>
        )}
        <Link href={href}><h3 className="text-[22px] md:text-[18px] xl:text-[26px] font-normal text-[#252525] mt-2 mb-2 line-clamp-2">{c.title}</h3></Link>
        {enrolled && (
          <div className="flex items-center gap-1 text-[#AFAFAF] text-sm">
            <img src="/images/icons/user-light.svg" alt="" width="20" height="20" />{enrolled} students
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <div>
            {newPrice && <span className="line-through text-[#AFAFAF] sm:text-[16px] xl:text-[26px]">{oldPrice}</span>}
            <span className="text-[#3a3c3e] font-normal text-[22px] sm:text-[16px] xl:text-[26px] ml-2">{newPrice ?? oldPrice}</span>
          </div>
          <Link href={href}>
            <button className="bg-[#09339B] text-white sm:px-1 md:px-2 xl:px-4 sm:py-1 md:py-2 xl:py-2 rounded-md sm:text-sm md:text-[14px] xl:text-base">View Course</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCourses() {
  const [cats, setCats] = useState<CourseCat[]>([ALL_TAB]);
  const [activeSlug, setActiveSlug] = useState<string>("all");
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const catRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getCourseCats()
      .then((rows) => setCats([ALL_TAB, ...rows]))
      .catch(() => { });
  }, []);

  const fetchCourses = useCallback((slug: string) => {
    setLoading(true);
    setStep(1);
    getCoursesByCategory({
      category: slug === "all" ? undefined : slug,
      limit: 24,
      sort: "popular",
    })
      .then((res) => setCourses(res.data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCourses(activeSlug);
  }, [activeSlug, fetchCourses]);

  const totalSteps = Math.max(1, Math.ceil(courses.length / PAGE_SIZE));
  const progress = (step / totalSteps) * 100;
  const visibleCourses = courses.slice((step - 1) * PAGE_SIZE, step * PAGE_SIZE);

  const prev = () => setStep((s) => Math.max(1, s - 1));
  const next = () => setStep((s) => Math.min(totalSteps, s + 1));

  const scrollCategories = (dir: number) => {
    if (!catRef.current) return;
    catRef.current.scrollBy({ left: catRef.current.clientWidth * 0.7 * dir, behavior: "smooth" });
  };

  const handleCatClick = (slug: string) => {
    setActiveSlug(slug);
  };

  return (
    <section className="xl:py-14">
      <div className="container mx-auto px-4">
        {/* Heading + Category Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div className="w-full md:w-[35%]">
            <h2 className="text-[36px] xl:text-[40px] text-center md:text-left font-semibold text-[#121B31]">
              Featured Courses
            </h2>
            <p className="text-[#6A7181] mt-2 mb-6 text-[18px] xl:text-[20px] leading-6 text-center md:text-left px-8 md:px-0">
              Explore our most popular courses designed by industry experts
            </p>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="sm:hidden w-full relative px-2 w-full md:w-[65%]">
            <div
              ref={catRef}
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth -ml-1"
              role="listbox"
              aria-label="Course categories"
            >
              {cats.map((cat) => (
                <button
                  key={cat.id}
                  role="option"
                  aria-selected={activeSlug === cat.slug}
                  className={`snap-center flex-shrink-0 px-6 py-3 rounded-md whitespace-nowrap transition ${activeSlug === cat.slug ? "bg-[#09339B] text-white" : "bg-transparent text-[#3a3c3e]"
                    }`}
                  onClick={() => handleCatClick(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: inline buttons */}
          <div className="hidden sm:flex md:flex-wrap gap-2 xl:gap-2 mt-12 w-full md:w-[65%] justify-end">
            {cats.map((cat) => (
              <button
                key={cat.id}
                className={`px-5 py-2 rounded-[10px] whitespace-nowrap transition ${activeSlug === cat.slug ? "bg-[#09339B] text-white" : "bg-transparent text-[#3a3c3e]"
                  }`}
                onClick={() => handleCatClick(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-md h-[380px]" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No courses found in this category.</p>
          ) : (
            <>
              {/* Mobile Slider */}
              <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory sm:hidden pb-4 scrollbar-hide px-2">
                {courses.map((c) => (
                  <CourseCard key={c.id} c={c} size="sm" />
                ))}
              </div>

              {/* Desktop Grid */}
              <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-8">
                {visibleCourses.map((c) => (
                  <CourseCard key={c.id} c={c} size="lg" />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      {!loading && courses.length > 0 && (
        <div className="md:flex items-center container mx-auto md:mt-10 px-4">
          {/* Prev / Next */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={prev}
              disabled={step === 1}
              className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white border border-gray-300 disabled:opacity-40"
            >
              <img src="/images/f-left.svg" alt="Previous" />
            </button>
            <button
              onClick={next}
              disabled={step === totalSteps}
              className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white border border-gray-300 disabled:opacity-40"
            >
              <img src="/images/f-right.svg" alt="Next" />
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
          <div className="w-full flex justify-center md:w-auto md:justify-end mb-6 md:mb-0 mt-4 md:mt-0">
            <Link href="/courses">
              <button className="text-sm text-[#09339B] border border-[#09339B] md:border-none font-medium flex items-center gap-1 p-2 md:p-4 bg-white rounded-[10px]">
                View All Courses
                <img src="/images/icons/blue_arrow.png" alt="" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
