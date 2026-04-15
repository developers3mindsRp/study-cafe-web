"use client";

import type { CoursePublicDetail, CourseBatch } from "@/types/models.types";

interface Props {
  course: CoursePublicDetail | null;
  batches?: CourseBatch[];
}

function formatPrice(val?: string | number | null) {
  if (val == null) return null;
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return null;
  return `₹${n.toLocaleString("en-IN")}`;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  } catch {
    return null;
  }
}

function getNextUpcomingBatchDate(batches: CourseBatch[]): string | null {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcoming = batches
    .filter((b) => b.start_date)
    .map((b) => new Date(b.start_date!))
    .filter((d) => !isNaN(d.getTime()) && d >= now)
    .sort((a, b) => a.getTime() - b.getTime());
  return upcoming.length > 0 ? upcoming[0].toISOString() : null;
}

export default function Paymentsection({ course, batches = [] }: Props) {
  if (!course) {
    return (
      <div className="md:min-h-[200px] container px-4 mx-auto flex items-center justify-center">
        <p className="text-[#929292] text-[16px]">Course details not available.</p>
      </div>
    );
  }

  const thumbnail = course.thumbnail_url ?? "/images/c1.png";
  const startDate = formatDate(getNextUpcomingBatchDate(batches));
  const enrolledCount = course.enrolled_count ?? 0;
  const ratings = course.ratings ? Number(course.ratings).toFixed(1) : null;
  const ratingUsers = course.rating_users ?? 0;
  const languages = course.language
    ? (Array.isArray(course.language) ? course.language : [course.language]).join(", ")
    : "English";

  return (
    <div className="md:min-h-screen container px-4 mx-auto">
      <div className="lg:col-span-2 space-y-6">
        {startDate && (
          <p className="bg-[#F9F9FB] w-fit max-w-full p-2 text-[#454545] text-[15px] px-4">
            Starts at {startDate}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch">
          <div className="w-full sm:w-[300px] h-[200px] sm:h-auto flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt={course.title}
              className="w-full h-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-[18px] sm:text-[20px] font-medium text-gray-900 leading-snug mb-4">
              {course.title}
            </h1>

            {course.brief_description && (
              <p className="text-[#929292] text-[15px] sm:text-[16px] leading-relaxed mb-4 line-clamp-3">
                {course.brief_description}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#AFAFAF] text-sm">
              <div className="flex items-center gap-1">
                <img src="/images/eng-light.png" alt="" className="w-4 h-4" />
                {languages}
              </div>
              {enrolledCount > 0 && (
                <div className="flex items-center gap-1">
                  <img src="/images/user-light.png" alt="" className="w-4 h-4" />
                  {enrolledCount.toLocaleString("en-IN")} students
                </div>
              )}
              {ratings && (
                <div className="flex items-center gap-1">
                  <img src="/images/Star.png" alt="" className="w-4 h-4" />
                  {ratings} by {ratingUsers} Users
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
