"use client";
import React, { useState } from "react";
import ReviewForm from "./WriteReview";
import { init } from "next/dist/compiled/webpack/webpack";
export default function ReviewSection() {
  const testimonials = [
  {
    initial: "R",
    message:
      "Managing studies with a full-time job was difficult until I joined StudyCafe. The flexibility, recorded sessions, and detailed notes helped me stay consistent without stress.",
    name: "Rahul Mehta",
    role: "Accounts & Finance",
    rating: 5,
  },
  {
   initial: "N",
    message:
      "StudyCafe transformed my career! The courses are practical, well-structured, and the instructors are incredibly knowledgeable",
    name: "Neha Sharma",
    role: "CA Intermediate Aspirant",
    rating: 5,
  },
  {
       initial: "P",
    message:
      "What I love most about StudyCafe is the simplicity of learning. The dashboard is easy to use, courses are well-organized, and progress tracking keeps me motivated.",
    name: "Priya Jain",
    role: "MBA Student",
    rating: 5,
  },
  {
       initial: "S",
    message:
      "StudyCafe offers high-quality content with real-world insights. The learning experience feels premium, and the material is extremely well explained.",
    name: "Saurabh Gupta",
    role: "CA Foundation Student",
    rating: 5,
  },
  {
       initial: "A",
    message:
      "StudyCafe makes even complex topics easy to understand. The step-by-step explanations and practice questions helped me build strong basics with confidence.",
    name: "Anjali Singh",
    role: "B.Com (Hons) Student",
    rating: 5,
  },
  {
       initial: "P",
    message:
      "I was struggling with self-study until I found StudyCafe. The structured courses and regular updates keep me on track throughout the semester.",
    name: "Saurabh Gupta",
    role: "Software Developer",
    rating: 5,
  },
    
  ]

  
  return (
    
    <section className="container px-4 mx-auto  ">
      
    <h2 className="text-[30px] font-semibold mb-4 ">Google Reviews</h2>
              {/* Mobile slider */}
  {/* Mobile slider */}
<div className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:hidden mt-4 pb-4 px-2 scrollbar-hide">
  {testimonials.map((item, index) => (
    <div
      key={index}
      className="w-[260px] sm:w-[280px] snap-center flex-shrink-0 relative border border-[#17254E] rounded-xl p-4 text-left"
    >
      {/* User + Rating Row */}
      <div className="flex flex-col gap-3">

        {/* Top Row */}
        <div className="flex items-start justify-between gap-3">
          {/* Left: Avatar + Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#09339B] text-white rounded-full flex items-center justify-center text-sm sm:text-lg font-medium">
              {item.initial}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                {item.name}
              </h4>
              <p className="text-[#302A2A99] font-medium text-xs sm:text-sm">
                {item.role}
              </p>
            </div>
          </div>
             </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-2 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <img key={i} src="/images/Star.png" className="w-3 sm:w-4" />
              ))}
            </div>
            <span className="text-gray-400 text-[10px] sm:text-xs">
              • 6 months ago
            </span>
          </div>
        </div>

        {/* Message */}
        <p className="text-[#696969] text-xs sm:text-sm leading-relaxed">
          {item.message}
        </p>

   
    </div>
  ))}
</div>



           {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="relative border border-[#17254E] rounded-xl p-6 text-left"
              >
      

             

                {/* User + Rating Row */}
                <div className=" flex items-center justify-between">
                  {/* Left: Name & Role */}
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-[#09339B] text-white rounded-full flex items-center justify-center text-lg font-medium">
                      {item.initial}
                    </div>

                    <div>
                            <h4 className="font-semibold text-gray-900 text-[30px]">
                              {item.name}
                            </h4>
                            <p className="text-[#302A2A99] font-bold text-[17px]">{item.role}</p>
                    </div>
                  </div>

                          
                </div>
                                  {/* Rating + Time */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <img key={i} src="/images/Star.png" className="w-4" />
                  ))}
                  <img src="/images/Star.png" className="w-4" />
                </div>
                <span className="text-gray-400 text-sm">• 6 months ago</span>
              </div>
                   {/* Message */}
                <p className="text-[#2F2A2A] text-[18px] mt-2 leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
    </section>
  );
}
