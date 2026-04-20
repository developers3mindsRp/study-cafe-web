import Link from "next/link";
import {
  useMembershipCourses,
  useSubscriptionStatus,
  useOverallProgress,
} from "@/hooks/usePurchases";
import type { MembershipCourseItem } from "@/types/models.types";
import CourseCard, { type MyCourseCardModel } from "@/components/CourseCard";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";
import type { OverallProgressRow } from "@/services/progress.service";
import Image from "next/image";

function membershipToCardModel(
  course: MembershipCourseItem,
  prog?: OverallProgressRow
): MyCourseCardModel {
  return {
    image: resolveApiAssetUrl(course.thumbnail_url ?? "") || "/images/home/f1.jpg",
    title: course.title,
    lessons: prog?.totalSessions ?? 0,
    completed: prog?.completedSessions ?? 0,
    progress: prog?.percent ?? 0,
    courseId: String(course.id),
    slug: course.slug ?? String(course.id),
    enrolledBatch: null,
  };
}

function hasStarted(prog?: OverallProgressRow) {
  if (!prog) return false;
  if (prog.percent > 0) return true;
  return prog.status === "in_progress" || prog.status === "completed";
}

function MembershipStartCard({ course }: { course: MembershipCourseItem }) {
  const img = resolveApiAssetUrl(course.thumbnail_url ?? "") || "/images/home/f1.jpg";
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden flex flex-col">
      <div className="relative w-full h-[180px] md:h-[180px] xl:h-[220px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image fill src={img} alt={course.title} className="h-full w-full object-cover" />
        {course.category && (
          <span className="absolute top-2 left-3 bg-[#09339B] text-white px-2 py-0.5 rounded text-xs font-medium mt-4">
            {course.category}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[18px] xl:text-[22px] font-normal text-[#252525] mt-2 mb-3 line-clamp-2">
          {course.title}
        </h3>
        <div className="flex justify-between items-center mt-auto">
          <Link href={`/learn/${encodeURIComponent(course.slug || String(course.id))}`}>
            <button
              type="button"
              className="bg-white border border-[#09339B] text-[#09339B] px-4 py-1 md:py-2 rounded-md text-sm md:text-base font-medium hover:bg-[#09339B] hover:text-white transition-colors duration-300"
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
  const { data: subscription, isLoading: subLoading } = useSubscriptionStatus();
  const { data: overall } = useOverallProgress();

  const loading = isLoading || subLoading;
  const hasMembership = subscription?.hasActiveMembership;

  if (loading) {
    return (
      <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm border-[#9FBBFF] px-4 p-4">
        <div className="text-center py-12 text-gray-400">Loading membership courses…</div>
      </section>
    );
  }

  if (!hasMembership) {
    return (
      <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm border-[#9FBBFF] px-4 p-4">
        <h2 className="text-[26px] font-normal text-gray-800 mb-1">Membership Courses</h2>
        <p className="text-gray-500 text-[16px] mb-6">
          Access premium courses with a membership plan
        </p>

        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
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
          <p className="text-gray-500 text-lg mb-2">You have not purchased any membership.</p>
          <p className="text-gray-400 text-sm mb-6">
            Get access to all premium courses by upgrading your plan.
          </p>
          <Link href="/plans">
            <button className="px-6 py-3 bg-[#09339B] text-white rounded-md text-sm md:text-base font-medium hover:bg-white hover:text-[#09339B] border border-[#09339B] transition-colors duration-300">
              Buy Membership Now
            </button>
          </Link>
        </div>
      </section>
    );
  }

  const groups = planGroups ?? [];

  const progressById = new Map<string, OverallProgressRow>();
  for (const row of overall ?? []) {
    progressById.set(String(row.courseId), row);
  }

  // Flatten all courses across all plans for the "no courses" check
  const totalCourses = groups.reduce((acc, g) => acc + g.courses.length, 0);

  return (
    <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm border-[#9FBBFF] px-4 p-4">
      <h2 className="text-[26px] font-normal text-gray-800 mb-1">Membership Courses</h2>
      <p className="text-gray-500 text-[16px] mb-6">
        Your membership includes access to these courses
      </p>

      {totalCourses === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No courses have been assigned to your membership plan yet.
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.membershipId}>
              {/* Show plan name as section header only when there are multiple memberships */}
              {groups.length > 1 && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-[#EEF2FF] text-[#09339B] px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {group.planName}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {group.courses.length} course{group.courses.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {group.courses.length === 0 ? (
                <p className="text-gray-400 text-sm py-4">
                  No courses have been assigned to the{" "}
                  <span className="font-medium capitalize">{group.planName}</span> plan yet.
                </p>
              ) : (
                <div className="sm:grid grid-cols-2 md:grid-cols-2 gap-8">
                  {group.courses.map((course) => {
                    const prog = progressById.get(String(course.id));
                    if (hasStarted(prog)) {
                      return (
                        <CourseCard key={course.id} course={membershipToCardModel(course, prog)} />
                      );
                    }
                    return (
                      <MembershipStartCard key={course.id} course={course} />
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
