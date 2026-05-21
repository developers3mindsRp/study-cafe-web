import React from 'react';
import Image from 'next/image';
import type { PublicCourse } from '@/types/models.types';

interface TrendingCoursesProps {
  courses?: PublicCourse[];
}

const FALLBACK_COURSES = [
  { id: 1, title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course", thumbnail_url: "/images/home/f1.jpg", price: 699, sale_price: null, enrolled_count: 1240, ratings: "4.8", slug: "1" },
  { id: 2, title: "Certification Course on How to Automate Your CA Practice", thumbnail_url: "/images/home/f2.png", price: 99, sale_price: null, enrolled_count: 957, ratings: "4.8", slug: "2" },
  { id: 3, title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course", thumbnail_url: "/images/home/f3.png", price: 699, sale_price: null, enrolled_count: 1240, ratings: "4.8", slug: "3" },
];

function formatPrice(val?: string | number | null) {
  if (val == null) return null;
  const n = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(n)) return null;
  return `₹ ${n.toLocaleString('en-IN')}`;
}

const CourseCard = ({ course, size }: { course: any; size: 'sm' | 'lg' }) => {
  const price = formatPrice(course.sale_price ?? course.price);
  const originalPrice = course.sale_price ? formatPrice(course.price) : null;
  const thumbnail = course.thumbnail_url ?? '/images/home/f1.jpg';
  const href = `/course/${course.slug ?? course.id}`;

  if (size === 'sm') {
    return (
      <div className="min-w-[320px] snap-center rounded-xl shadow-md border bg-white overflow-hidden text-left">
        <div className="relative w-full h-[183px]">
          <Image src={thumbnail} alt={course.title} fill className="object-cover" />
          {course.ratings && (
            <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-[10px] text-sm shadow">
              ⭐ {Number(course.ratings).toFixed(1)}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-[18px] text-[#252525] leading-tight mb-4">{course.title}</h3>
          {course.enrolled_count != null && (
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
              <img src="/images/icons/user-light.svg" alt="" width="20" height="20" />
              {Number(course.enrolled_count).toLocaleString('en-IN')} students
            </div>
          )}
          <div className="flex justify-between items-center">
            <div>
              {originalPrice && <span className="line-through text-gray-400 text-[14px]">{originalPrice}</span>}
              {price && <span className="text-[#252525] font-semibold text-[22px] ml-2">{price}</span>}
            </div>
            <button
              className="text-sm bg-[#09339B] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              onClick={() => (window.location.href = href)}
            >
              View Course
              <img src="/images/arrow-left.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-md border bg-white overflow-hidden text-left">
      <div className="relative w-full md:h-[200px] xl:h-[243px]">
        <Image src={thumbnail} alt={course.title} fill className="object-fit" />
        {course.ratings && (
          <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm shadow">
            ⭐ {Number(course.ratings).toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium md:text-[20px] xl:text-[26px] text-[#252525] leading-tight mb-4">{course.title}</h3>
        {course.enrolled_count != null && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <img src="/images/icons/user-light.svg" alt="" width="20" height="20" />
            {Number(course.enrolled_count).toLocaleString('en-IN')} students
          </div>
        )}
        <div className="flex justify-between items-center">
          <div>
            {originalPrice && <span className="line-through text-gray-400 xl:text-[26px]">{originalPrice}</span>}
            {price && <span className="text-[#252525] font-normal xl:text-[26px] ml-2">{price}</span>}
          </div>
          <button
            className="text-sm bg-[#09339B] hover:bg-blue-700 text-white md:px-3 xl:px-4 md:py-1 xl:py-2 rounded-md flex items-center gap-2"
            onClick={() => (window.location.href = href)}
          >
            View Course
            <img src="/images/arrow-left.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TrendingCourses = ({ courses }: TrendingCoursesProps) => {
  const displayCourses = (courses && courses.length > 0 ? courses : FALLBACK_COURSES).slice(0, 6);

  return (
    <section className="w-full py-4 md:py-12 px-4 mx-auto container">
      <h2 className="text-[20px] md:text-[40px] font-medium mb-6 md:mb-4 px-4 py-3 text-white bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto" id="Courses">
        Trending Courses
      </h2>

      {/* Mobile Slider */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden pb-4 px-2 scrollbar-hide">
        {displayCourses.map((c) => (
          <CourseCard key={c.id} course={c} size="sm" />
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 mt-10 container mx-auto px-4">
        {displayCourses.map((c) => (
          <CourseCard key={c.id} course={c} size="lg" />
        ))}
      </div>
    </section>
  );
};

export default TrendingCourses;
