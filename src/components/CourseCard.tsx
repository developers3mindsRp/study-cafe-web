"use client";

import Link from "next/link";
import { useCallback } from "react";
import type { EnrolledBatchInfo } from "@/types/models.types";
import { downloadCertificate } from "@/services/progress.service";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";
import Image from "next/image";

export type MyCourseCardModel = {
  image: string;
  title: string;
  lessons: number;
  completed: number;
  progress: number;
  courseId?: string;
  slug?: string | null;
  enrolledBatch?: EnrolledBatchInfo | null;
  /** Default "Continue learning"; use "Start learning" for membership courses not yet opened */
  primaryCtaLabel?: string;
};

function formatDisplayDate(d?: string | null) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

function sellingPageHref(course: MyCourseCardModel) {
  const seg = course.slug?.trim() || course.courseId;
  if (!seg) return "/courses";
  return `/course/${encodeURIComponent(seg)}`;
}

function learnHref(course: MyCourseCardModel) {
  const seg = course.slug?.trim() || course.courseId;
  if (!seg) return "/courses";
  return `/learn/${encodeURIComponent(seg)}`;
}

export default function CourseCard({ course }: { course: MyCourseCardModel }) {
  const detailHref = sellingPageHref(course);
  const learningHref = learnHref(course);
  const onCertDownload = useCallback(async () => {
    if (!course.courseId) return;
    try {
      await downloadCertificate(course.courseId);
    } catch (e) {
      console.error(e);
    }
  }, [course.courseId]);
  const phase = course.enrolledBatch?.phase;
  const isUpcomingLive = phase === "upcoming";
  const isLiveCohort = phase === "live";
  const startLabel = formatDisplayDate(course.enrolledBatch?.startDate ?? null);
  const endLabel = formatDisplayDate(course.enrolledBatch?.endDate ?? null);

  const isFullyComplete =
    course.lessons > 0 && course.completed >= course.lessons;

  const imageSrc =
    resolveApiAssetUrl(course.image) || "/images/home/f1.jpg";

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative h-[180px] w-full overflow-hidden md:h-[200px] xl:h-[220px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          fill
          src={imageSrc}
          alt={course.title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-2 text-[16px] font-semibold text-gray-800 md:text-[20px]">
          {course.title}
        </h3>

        {isUpcomingLive && (
          <div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-sm text-amber-950">
            <p className="font-semibold text-amber-900">Upcoming live batch</p>
            {startLabel && (
              <p className="text-amber-900/90">
                Your cohort starts on <span className="font-medium">{startLabel}</span>
                {/* {endLabel ? (
                  <>
                    {" "}
                    · ends <span className="font-medium">{endLabel}</span>
                  </>
                ) : null} */}
                .
              </p>
            )}
            {!startLabel && (
              <p className="text-amber-900/90">
                You are enrolled for the next live batch. Session dates will appear here once
                scheduled.
              </p>
            )}
            {/* <p className="text-xs leading-relaxed text-amber-900/80">
              Section recordings unlock after this batch completes. Until then, use the course page
              for schedule and live session details.
            </p> */}
          </div>
        )}

        {isLiveCohort && !isUpcomingLive && (
          <div className="rounded-lg border border-[#09339B]/25 bg-[#f0f4ff] px-3 py-2 text-sm text-[#09339B]">
            <span className="font-semibold">Live batch in progress</span>
            {startLabel || endLabel ? (
              <span className="mt-0.5 block text-xs text-[#09339B]/90">
                {startLabel ? `Started ${startLabel}` : null}
                {startLabel && endLabel ? " · " : null}
                {endLabel ? `Ends ${endLabel}` : null}
              </span>
            ) : null}
          </div>
        )}

        {!isUpcomingLive && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {course.lessons} lessons · {course.completed} completed
              </div>
              <div className="text-right text-xs text-gray-500">{course.progress}%</div>
            </div>

            <div className="relative mt-1 h-2 rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#09339B]"
                style={{ width: `${Math.min(100, Math.max(0, course.progress))}%` }}
              />
            </div>
          </>
        )}

        <div className="flex gap-2 pt-1">
          {isUpcomingLive ? (
            <>
              <Link
                href={detailHref}
                className="flex-1 rounded-md bg-[#09339B] px-2 py-2 text-center text-[16px] font-medium text-white hover:bg-[#072a7a] md:py-2"
              >
                View course & schedule
              </Link>
              {course.enrolledBatch?.meetLink ? (
                <a
                  href={course.enrolledBatch.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-md border border-[#09339B] px-2 py-2 text-center text-[15px] font-medium text-[#09339B] hover:bg-[#f0f4ff]"
                >
                  Join link
                </a>
              ) : (
                <Link
                  href={detailHref}
                  className="flex flex-1 items-center justify-center rounded-md border border-[#09339B] px-2 py-2 text-center text-[15px] font-medium text-[#09339B] hover:bg-[#f0f4ff]"
                >
                  Details
                </Link>
              )}
            </>
          ) : isFullyComplete ? (
            <>
              <Link
                href={learningHref}
                className="line-clamp-1 flex-1 rounded-md bg-[#09339B] px-1 py-2 text-center text-[16px] text-white md:py-2"
              >
                Review course
              </Link>
              <button
                type="button"
                onClick={onCertDownload}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[#09339B] py-2 text-[16px] text-[#09339B] transition hover:bg-[#f0f4ff]"
              >
                <img src="/images/download-1.png" alt="" className="h-4 w-4" />
                <span>Certificate</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href={learningHref}
                className="line-clamp-1 flex-1 rounded-md bg-[#09339B] py-2 text-center text-[16px] text-white"
              >
                {course.primaryCtaLabel ?? "Continue learning"}
              </Link>
              <Link
                href={detailHref}
                className="flex-1 rounded-md border border-[#09339B] py-2 text-center text-[16px] text-[#09339B]"
              >
                Details
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
