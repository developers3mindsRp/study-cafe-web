"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useMembershipCourses,
  useSubscriptionStatus,
  useOverallProgress,
} from "@/hooks/usePurchases";
import type {
  MembershipCourseItem,
  MembershipPlanCourses,
} from "@/types/models.types";
import CourseCard, {
  type MyCourseCardModel,
} from "@/components/CourseCard";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";
import type { OverallProgressRow } from "@/services/progress.service";
import { isMembershipCourseStarted } from "@/utils/membershipCourseProgress";

function membershipToCardModel(
  course: MembershipCourseItem,
  prog?: OverallProgressRow
): MyCourseCardModel {
  return {
    image:
      resolveApiAssetUrl(course.thumbnail_url ?? "") ||
      "/images/placeholder.jpg",
    title: course.title,
    lessons: prog?.totalSessions ?? 0,
    completed: prog?.completedSessions ?? 0,
    progress: prog?.percent ?? 0,
    courseId: String(course.id),
    slug: course.slug ?? String(course.id),
    enrolledBatch: null,
  };
}

function sortMembershipCourses(
  courses: MembershipPlanCourses["courses"],
  progressById: Map<string, OverallProgressRow>
) {
  return [...courses].sort((a, b) => {
    const pa = progressById.get(String(a.id));
    const pb = progressById.get(String(b.id));

    const aStarted = isMembershipCourseStarted(pa);
    const bStarted = isMembershipCourseStarted(pb);

    if (aStarted !== bStarted) {
      return aStarted ? 1 : -1;
    }

    if (aStarted && bStarted) {
      const d =
        (pb?.percent ?? 0) - (pa?.percent ?? 0) ||
        (pb?.completedSessions ?? 0) - (pa?.completedSessions ?? 0);

      if (d !== 0) {
        return d;
      }
    }

    return String(a.title).localeCompare(String(b.title));
  });
}

function MembershipStartCard({
  course,
}: {
  course: MembershipCourseItem;
}) {
  const img =
    resolveApiAssetUrl(course.thumbnail_url ?? "") ||
    "/images/placeholder.jpg";

  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-white shadow-md">
      <div className="relative h-[180px] w-full md:h-[180px] xl:h-[220px]">
        <Image
          fill
          src={img}
          alt={course.title}
          className="h-full w-full object-cover"
        />

        {course.category && (
          <span className="absolute left-3 top-2 mt-4 rounded bg-[#09339B] px-2 py-0.5 text-xs font-medium text-white">
            {course.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mt-2 mb-3 line-clamp-2 text-[18px] font-normal text-[#252525] xl:text-[22px]">
          {course.title}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <Link
            href={`/learn/${encodeURIComponent(
              course.slug || String(course.id)
            )}`}
          >
            <button
              type="button"
              className="rounded-md border border-[#09339B] bg-white px-4 py-1 text-sm font-medium text-[#09339B] transition-colors duration-300 hover:bg-[#09339B] hover:text-white md:py-2 md:text-base"
            >
              Start Learning
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MembershipCourses() {
  const { data: planGroups, isLoading } = useMembershipCourses();


  const {
    data: subscription,
    isLoading: subLoading,
  } = useSubscriptionStatus();
  const { data: overall } = useOverallProgress();


  
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const loading = isLoading || subLoading;
  const hasMembership = subscription?.hasActiveMembership;

  const groups = useMemo(() => {
    const sourceGroups = planGroups ?? [];

    if (!search.trim()) {
      return sourceGroups;
    }

    const query = search.toLowerCase();

    return sourceGroups
      .map((group) => ({
        ...group,
        courses: group.courses.filter((course) =>
          course.title.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.courses.length > 0);
  }, [planGroups, search]);

  const progressById = new Map<string, OverallProgressRow>();

  for (const row of overall ?? []) {
    progressById.set(String(row.courseId), row);
  }

  const totalCourses = (planGroups ?? []).reduce(
    (acc, g) => acc + g.courses.length,
    0
  );

  const filteredCoursesCount = groups.reduce(
    (acc, g) => acc + g.courses.length,
    0
  );

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl rounded-lg border border-[#9FBBFF] bg-white p-4 shadow-sm md:p-6">
        <div className="py-12 text-center text-gray-400">
          Loading membership courses...
        </div>
      </section>
    );
  }

  if (!hasMembership) {
    return (
      <section className="mx-auto max-w-6xl rounded-lg border border-[#9FBBFF] bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-1 text-[26px] font-normal text-gray-800">
          Membership Courses
        </h2>

        <p className="mb-6 text-[16px] text-gray-500">
          Access premium courses with a membership plan
        </p>

        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
              <path d="M3 20h18" />
            </svg>
          </div>

          <p className="mb-2 text-lg text-gray-500">
            You have not purchased any membership.
          </p>

          <p className="mb-6 text-sm text-gray-400">
            Get access to all premium courses by upgrading your plan.
          </p>

          <Link href="/plans">
            <button className="rounded-md border border-[#09339B] bg-[#09339B] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-[#09339B] md:text-base">
              Buy Membership Now
            </button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl rounded-lg border border-[#9FBBFF] bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-1 text-[26px] font-normal text-gray-800">
        Membership Courses
      </h2>

      <p className="mb-6 text-[16px] text-gray-500">
        Your membership includes access to these courses
      </p>

      {totalCourses > 0 && (
        <div className="mb-6">
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
                placeholder="Search membership courses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
               className="border border-gray-300 rounded-lg px-10 py-2 text-[16px] w-full placeholder-black"
              />

              
            </div>
         
        </div>
      )}

      {totalCourses === 0 ? (
        <div className="py-8 text-center text-gray-400">
          No courses have been assigned to your membership plan yet.
        </div>
      ) : filteredCoursesCount === 0 ? (
        <div className="py-8 text-center text-gray-400">
          No membership courses found matching "{search}".
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.membershipId}>
              {groups.length > 1 && (
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-1 text-sm font-semibold capitalize text-[#09339B]">
                    {group.planName}
                  </span>

                  <span className="text-sm text-gray-400">
                    {group.courses.length} course
                    {group.courses.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2">
                {group.courses.map((course) => {
                  const prog = progressById.get(String(course.id));

                  return isMembershipCourseStarted(prog) ? (
                    <CourseCard
                      key={course.id}
                      course={membershipToCardModel(course, prog)}
                    />
                  ) : (
                    <MembershipStartCard
                      key={course.id}
                      course={course}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}