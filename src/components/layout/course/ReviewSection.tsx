"use client";
import { CoursePublicDetail } from "@/types/models.types";
import React from "react";
export default function ReviewSection({
  course,
}: {
  course: CoursePublicDetail | null;
}) {

  // console.log(course,"coursesdfsf")
  let reviews: { name: string; designation: string; review: string }[] = [];
  if (course?.feedback) {
    try {
      const parsed = JSON.parse(course.feedback);
      // console.log(parsed,"parsed")
      reviews = Array.isArray(parsed) ? parsed : [];
    } catch {
      reviews = [];
    }
  }
  // console.log(reviews.length,"reviews.length")
  if(reviews.length < 0) {
    return null;
  }

  // console.log(reviews,"reviews")
  return (
    <section className="container px-4 mx-auto py-6 md:py-12 ">

  
      <h2
        className="          text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4
            px-4 py-3 text-white
           
            bg-gradient-to-r from-[#253D8E] to-transparent
            md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto"
        id="reviews"
      >
        Google Reviews
      </h2>

      {/* Mobile slider */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:hidden mt-4 md:pb-4 px-2 scrollbar-hide">
        {reviews.map((item: {name: string, designation: string, review: string}, index: number) => (
          <div
            key={index}
            className="w-[320px] sm:w-[280px] snap-center flex-shrink-0 relative border border-[#AFAFAF] rounded-xl p-4 text-left"
          >
            {/* User + Rating Row */}
            <div className="flex flex-col gap-3">
              {/* Top Row */}
              <div className="flex items-start justify-between gap-3">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#09339B] text-white rounded-full flex items-center justify-center text-sm sm:text-lg font-medium">
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 text-[16px] sm:text-base">
                      {item.name}
                    </h4>
                    <div
                      className="text-[#302A2A99] font-medium text-[16px] sm:text-sm"
                      dangerouslySetInnerHTML={{ __html: item.designation }}
                    />
                  </div>
                </div>
              </div>
              {/* Rating */}
              <div className="flex items-center gap-3 mt-2 mb-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <img
                      key={i}
                      src={
                        i === 4 ? "/images/star-blank.png" : "/images/Star.png"
                      }
                      className="w-4 h-4 sm:w-4"
                      alt={i === 0 ? "empty star" : "filled star"}
                    />
                  ))}
                </div>

                {/* <span className="text-gray-400 text-[16px] sm:text-xs ml-6">
                  <li> 6 months ago</li>
                </span> */}
              </div>
            </div>

            {/* Message */}
            <div
              className="text-[#696969] text-[16px] sm:text-sm leading-relaxed [&_p]:mb-2 last:[&_p]:mb-0"
              dangerouslySetInnerHTML={{ __html: item?.review ?? "" }}
            />
          </div>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-3 gap-8">
        {reviews.map((item: {name: string, designation: string, review: string}, index: number) => (
          <div
            key={index}
            className="relative border border-[#AFAFAF] rounded-xl p-6 text-left"
          >
            {/* User + Rating Row */}
            <div className=" flex items-center justify-between">
              {/* Left: Name & Role */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#09339B] text-white rounded-full flex items-center justify-center text-lg font-medium">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-[18px]">
                    {item.name}
                  </h4>
                  <div
                    className="text-[#302A2A99] font-medium text-[16px] xl:text-[18px]"
                    dangerouslySetInnerHTML={{ __html: item.designation }}
                  />
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3 mb-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <img
                    key={i}
                    src={
                      i === 4 ? "/images/star-blank.png" : "/images/Star.png"
                    }
                    className="w-4 h-4 sm:w-4"
                    alt={i === 0 ? "empty star" : "filled star"}
                  />
                ))}
              </div>
              {/* <span className="text-gray-400 xl:text-[18px]  ml-6">
                <li> 6 months ago</li>
              </span> */}
            </div>
            {/* Message */}
            <div
              className="text-[#2F2A2A] xl:text-[18px] mt-2 leading-relaxed md:line-clamp-3 xl:line-clamp-4 [&_p]:mb-2 last:[&_p]:mb-0"
              dangerouslySetInnerHTML={{ __html: item.review ?? "" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
