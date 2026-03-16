"use client";
import Link from 'next/link';


export default function CourseCard({ course }: { course: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Thumbnail */}
      <div className="xl:h-[220px] w-full overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-fit"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-[16px] md:text-[20px] font-semibold text-gray-800 line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center justify-between">
          {/* Progress */}
          <div className="text-sm text-gray-500">
            {course.lessons} lessons · {course.completed} completed
          </div>
          <div className="text-xs text-gray-500 text-right">
            {course.progress}%
          </div>
</div>

        <div className="relative h-2 bg-gray-200 rounded-full mt-1">
          <div
            className="h-full bg-[#09339B] rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
 

        {/* Buttons */}
        <div className="flex gap-2">
          {course.completed === course.lessons ? (
            <>
              <button className="flex-1 bg-[#09339B] text-white text-[16px] md:py-2 rounded-md px-1 line-clamp-1">
                Review Course
              </button>
          <button className="flex items-center justify-center gap-2 flex-1 border border-[#09339B] text-[#09339B] text-[16px] py-2 rounded-md hover:bg-[#f0f4ff] transition">
            <img src="/images/download-1.png" alt="Download Certificate" className="w-4 h-4" />
            <span>Certificate</span>
          </button>

            </>
          ) : (
            <>
              <button className="flex-1 bg-[#09339B] text-white text-[16px] py-2 rounded-md line-clamp-1">
                Continue Learning
              </button>

              <Link href="/course-detailPage" className="flex-1 border border-[#09339B] text-[#09339B] text-[16px] py-2 rounded-md text-center">
                Details
              </Link>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
