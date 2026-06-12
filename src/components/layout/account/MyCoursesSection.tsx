"use client";

import { useMemo, useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard";
import { useUserPurchases, useUserCourses } from "@/hooks/usePurchases";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";
import { isUserCourseOrderPurchase } from "@/utils/purchaseGuards";
import type { MyCourseCardModel } from "@/components/CourseCard";
import type { UserCourse } from "@/types/models.types";

function purchaseToCard(p: UserCourse): MyCourseCardModel {
  const c = p.course || {};

  return {
    image:
      resolveApiAssetUrl(c.thumbnail || c.thumbnail_url) ||
      "/images/home/f1.jpg",
    title: c.title ?? "Untitled Course",
    lessons: c.totalLessons ?? 0,
    completed: p.completedLessons?.length ?? 0,
    progress: p.progress ?? 0,
    courseId: p.courseId,
    slug: c.slug ?? null,
    enrolledBatch: p.enrolledBatch ?? null,
  };
}

export default function MyCoursesSection() {
  const {
    data: purchasesRaw,
    isLoading: loadingPurchases,
    error: errP,
  } = useUserPurchases();

  const {
    data: userCoursesRaw,
    isLoading: loadingCourses,
  } = useUserCourses();

  const isLoading = loadingPurchases || loadingCourses;

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Paid course purchases (excludes membership plan orders)
  const purchases = (purchasesRaw ?? []).filter(
    isUserCourseOrderPurchase
  );

  // courseIds already covered by paid purchases — avoid duplicates
  const purchasedCourseIds = new Set(
    purchases.map((p) => String(p.courseId))
  );

  // Admin-granted courses from /user/courses that have no paid order
  const adminGranted = (userCoursesRaw ?? []).filter(
    (c) =>
      c.isAdminGranted &&
      !purchasedCourseIds.has(String(c.courseId))
  );

  const allCourses = [...purchases, ...adminGranted];

  // Filter courses based on search
  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return allCourses;

    return allCourses.filter((course) =>
      course.course?.title?.toLowerCase().includes(query)
    );
  }, [allCourses, search]);

  // Split into active vs expired access (expired = access window has ended).
  const isExpired = (c: UserCourse) => c.accessStatus === "expired";
  const activeCourses = useMemo(
    () => filteredCourses.filter((c) => !isExpired(c)),
    [filteredCourses]
  );
  const expiredCourses = useMemo(
    () => filteredCourses.filter((c) => isExpired(c)),
    [filteredCourses]
  );

  return (
    <section className="mx-auto max-w-6xl rounded-lg border border-[#9FBBFF] bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-1 text-[26px] font-normal text-gray-800">
        My Courses
      </h2>

      <p className="mb-6 text-[16px] text-gray-500">
        Direct purchases only. Plan-included courses live under{" "}
        <span className="font-medium text-gray-600">
          Membership courses
        </span>{" "}
        below; the same course may show in both if you bought it and it is on
        your membership.
      </p>

      {/* Search */}
      {!isLoading && allCourses.length > 0 && (
       

        <div className="relative mt-4 sm:mt-0 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-10 py-2 text-[16px] w-full placeholder-black"
          />

          
        </div>
      )}

      {isLoading && (
        <div className="py-8 text-center text-gray-400">
          Loading your courses...
        </div>
      )}

      {!isLoading && errP && (
        <div className="py-8 text-center text-red-500">
          Could not load purchases.
        </div>
      )}

      {!isLoading && !errP && allCourses.length > 0 && filteredCourses.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          No courses found matching "{search}".
        </div>
      )}

      {!isLoading && !errP && allCourses.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          You haven&apos;t purchased any courses yet.
        </div>
      )}

      {!isLoading && activeCourses.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-[20px] font-medium text-gray-800">
            Active Courses
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {activeCourses.map((course, index) => (
              <CourseCard
                key={`active-${course.courseId}-${index}`}
                course={purchaseToCard(course)}
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && expiredCourses.length > 0 && (
        <div className="mb-2">
          <h3 className="mb-1 text-[20px] font-medium text-gray-800">
            Expired Courses
          </h3>
          <p className="mb-4 text-[14px] text-gray-500">
            Access to these courses has ended. Renew to regain access.
          </p>
          <div className="grid gap-6 opacity-70 sm:grid-cols-2 lg:grid-cols-2">
            {expiredCourses.map((course, index) => (
              <CourseCard
                key={`expired-${course.courseId}-${index}`}
                course={purchaseToCard(course)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}