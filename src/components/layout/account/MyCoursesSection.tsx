import CourseCard from "@/components/CourseCard";
import { useUserPurchases } from "@/hooks/usePurchases";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";
import { isUserCourseOrderPurchase } from "@/utils/purchaseGuards";
import type { MyCourseCardModel } from "@/components/CourseCard";

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

export default function MyCoursesSection() {
  const { data: purchasesRaw, isLoading, error: errP } = useUserPurchases();

  /** Only direct course purchases — not membership plan orders (same API). */
  const purchases = (purchasesRaw ?? []).filter(isUserCourseOrderPurchase);

  return (
    <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm border-[#9FBBFF] p-4">
      <h2 className="text-[26px] font-normal text-gray-800 mb-1">My Courses</h2>
      <p className="text-gray-500 text-[16px] mb-6">
        Direct purchases only. Plan-included courses live under{" "}
        <span className="font-medium text-gray-600">Membership courses</span> below; the same
        course may show in both if you bought it and it is on your membership.
      </p>

      {isLoading && (
        <div className="text-center py-8 text-gray-400">Loading your courses…</div>
      )}

      {!isLoading && errP && (
        <div className="text-center py-8 text-red-500">Could not load purchases.</div>
      )}

      {!isLoading && !errP && purchases.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          You haven&apos;t purchased any courses yet.
        </div>
      )}

      {!isLoading && purchases.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {purchases.map((p, i) => (
            <CourseCard key={p.courseId ?? i} course={purchaseToCard(p)} />
          ))}
        </div>
      )}
    </section>
  );
}
