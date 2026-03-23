import CourseCard from "../../CourseCard";
import { useUserPurchases } from "@/hooks/usePurchases";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";

export default function MyCourses() {
  const { data: purchases, isLoading, error } = useUserPurchases();

  const courses = (purchases ?? []).map((p) => ({
    image: resolveApiAssetUrl(p.course?.thumbnail_url ?? (p.course as any)?.thumbnail) || "/images/home/f1.jpg",
    title: p.course?.title ?? "Untitled Course",
    lessons: (p.course as any)?.totalLessons ?? 0,
    completed: p.completedLessons?.length ?? 0,
    progress: p.progress ?? 0,
    courseId: p.courseId,
  }));

  return (
    <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm  border-[#9FBBFF] p-4">
      <h2 className="text-[26px] font-normal text-gray-800 mb-1">
        My Courses
      </h2>
      <p className="text-gray-500 text-[16px] mb-6">
        Continue your learning Journey
      </p>

      {isLoading && (
        <div className="text-center py-8 text-gray-400">Loading your courses…</div>
      )}

      {!isLoading && !error && courses.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          You haven't purchased any courses yet.
        </div>
      )}

      {!isLoading && !error && courses.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {courses.map((course, i) => (
            <CourseCard key={course.courseId ?? i} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
