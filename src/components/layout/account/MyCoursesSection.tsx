import CourseCard from "@/components/CourseCard";
import {
  useUserPurchases,
  useMembershipCourses,
  useOverallProgress,
} from "@/hooks/usePurchases";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";
import type { MyCourseCardModel } from "@/components/CourseCard";
import type { MembershipCourseItem } from "@/types/models.types";
import type { OverallProgressRow } from "@/services/progress.service";

function purchaseToCard(p: any): MyCourseCardModel {
  const c = p.course || {};
  return {
    image:
      resolveApiAssetUrl(c.thumbnail || c.thumbnail_url) || "/images/home/f1.jpg",
    title: c.title ?? "Untitled Course",
    lessons: c.totalLessons ?? 0,
    completed: p.completedLessons?.length ?? 0,
    progress: p.progress ?? 0,
    courseId: p.courseId,
    slug: c.slug ?? null,
    enrolledBatch: p.enrolledBatch ?? null,
  };
}

function membershipToCard(
  c: MembershipCourseItem,
  prog?: OverallProgressRow
): MyCourseCardModel {
  return {
    image: resolveApiAssetUrl(c.thumbnail_url ?? "") || "/images/home/f1.jpg",
    title: c.title,
    lessons: prog?.totalSessions ?? 0,
    completed: prog?.completedSessions ?? 0,
    progress: prog?.percent ?? 0,
    courseId: String(c.id),
    slug: c.slug ?? String(c.id),
    enrolledBatch: null,
  };
}

function hasStarted(prog?: OverallProgressRow) {
  if (!prog) return false;
  if (prog.percent > 0) return true;
  if (prog.status === "in_progress" || prog.status === "completed") return true;
  return false;
}

export default function MyCoursesSection() {
  const { data: purchases, isLoading: loadP, error: errP } = useUserPurchases();
  const { data: planGroups, isLoading: loadM } = useMembershipCourses();
  const { data: overall, isLoading: loadO } = useOverallProgress();

  const loading = loadP || loadM || loadO;

  const progressById = new Map<string, OverallProgressRow>();
  for (const row of overall ?? []) {
    progressById.set(String(row.courseId), row);
  }

  const purchasedIds = new Set((purchases ?? []).map((p) => String(p.courseId)));
  const flatMem = (planGroups ?? []).flatMap((g) => g.courses);

  const merged: MyCourseCardModel[] = [];
  const seen = new Set<string>();

  for (const p of purchases ?? []) {
    const id = String(p.courseId);
    seen.add(id);
    merged.push(purchaseToCard(p));
  }

  for (const c of flatMem) {
    const id = String(c.id);
    if (purchasedIds.has(id)) continue;
    const prog = progressById.get(id);
    if (!hasStarted(prog)) continue;
    seen.add(id);
    merged.push(membershipToCard(c, prog));
  }

  const remainingMembership = flatMem.filter((c) => !seen.has(String(c.id)));

  return (
    <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm border-[#9FBBFF] p-4">
      <h2 className="text-[26px] font-normal text-gray-800 mb-1">My Courses</h2>
      <p className="text-gray-500 text-[16px] mb-6">
        Continue your learning journey — purchased courses and membership courses you&apos;ve started
        appear here.
      </p>

      {loading && (
        <div className="text-center py-8 text-gray-400">Loading your courses…</div>
      )}

      {!loading && errP && (
        <div className="text-center py-8 text-red-500">Could not load purchases.</div>
      )}

      {!loading && !errP && merged.length === 0 && remainingMembership.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          You haven&apos;t purchased any courses yet and haven&apos;t started a membership course.
        </div>
      )}

      {!loading && merged.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {merged.map((course, i) => (
            <CourseCard key={course.courseId ?? i} course={course} />
          ))}
        </div>
      )}

      {/* {remainingMembership.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Included in your membership</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {remainingMembership.map((c) => (
              <CourseCard
                key={c.id}
                course={{ ...membershipToCard(c), primaryCtaLabel: "Start learning" }}
              />
            ))}
          </div>
        </div>
      )} */}
    </section>
  );
}
