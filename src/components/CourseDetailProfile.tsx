"use client";
import { useState } from "react";
import Certificate from "./Certificate";

import ReviewPage from "./Review";

export default function CourseDetailPage() {
     const [openDay, setOpenDay] = useState<number | null>(null)
     const [open, setOpen] = useState(false);
     const [isReviewOpen, setIsReviewOpen] = useState(false)
const [isCertificateOpen, setIsCertificateOpen] = useState(false)

  return (
    <div className="container  mx-auto px-6 py-6 ">

      {/* Back */}
      <div className="text-sm text-[#09339B] mb-3 cursor-pointer">
        ← Back to My Courses
      </div>

      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="md:text-2xl font-semibold">
            Certification Course on Python with AI for Finance Professionals
          </h1>
          <p className="text-gray-500 mt-1">
            Instructor: CA Rahul Sharma
          </p>
        </div>

  <div className="flex gap-3">
    <button
      className="bg-[#09339B] text-white px-4 py-2 rounded-md"
      onClick={() => setIsReviewOpen(true)}
    >
      Write Review
    </button>

    {isReviewOpen && (
      <ReviewPage onClose={() => setIsReviewOpen(false)} />
    )}

    <button
      className="border px-4 py-2 rounded-md text-[#09339B]"
      onClick={() => setIsCertificateOpen(true)}
    >
      Certificate
    </button>

    {isCertificateOpen && (
      <Certificate onClose={() => setIsCertificateOpen(false)} />
    )}
  </div>
      </div>

      {/* Progress */}
      <div className="mt-6 bg-white border rounded-lg p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Course Progress</span>
          <span>42% Completed</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded">
          <div className="bg-[#09339B] h-2 rounded w-[42%]" />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>5 of 12 lessons completed</span>
          <span>8 hours, 30 minutes</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* Left */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-4">

          {/* Video Thumbnail */}
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="/images/f1.jpg"
              alt="course"
              className="w-full md:h-[550px] object-fit"
            />

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center ">
              <button className="bg-white p-4 rounded-full">
                ▶
              </button>
            </div>
          </div>

          {/* Day + Title */}
          <div className="flex justify-between items-center mt-4">
         
            <span className="text-xs border px-3 py-1 rounded-full">
              Day 1
            </span>

            <button className="text-sm border px-3 py-1 rounded-md text-[#09339B]">
              Mark as completed
            </button>
          </div>

          <h2 className="mt-3 font-medium">
            Certification Course on Python with AI for Finance Professionals
          </h2>
        </div>

        {/* Right */}
          <div className="bg-white border rounded-xl p-4 space-y-2">
             <h3 className="text-[26px] mb-4">Course Content</h3>
      {/* Day 1 */}
      <div className="border-b pb-3">
          
        <button
          onClick={() => setOpenDay(openDay === 1 ? null : 1)}
          className="flex justify-between items-center w-full font-medium text-sm"
        >
            
          <span className="font-semibold text-[20px]">Day 1: Discussion on GSTR-9</span>
                    <svg
                className={`w-5 h-5 transition-transform ${openDay === 1 ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
        </button>

        {openDay === 1 && (
          <ul className="mt-3 space-y-2 text-[16px] text-gray-600">
            <li className="text-green-600"><input type="checkbox" /> GST Provisions related to GSTR-9 and GSTR-9C filing</li>
            <li><input type="checkbox" /> GST Provisions related to GSTR-9 and GSTR-9C filing</li>
            <li><input type="checkbox" /> GST annual return workflow, table wise changes and comparison with last year</li>
            <li><input type="checkbox" /> Compulsory and Optional Tables</li>
          </ul>
        )}
      </div>

      {/* Day 2 */}
      <div className="border-b pb-3">
        <button
          onClick={() => setOpenDay(openDay === 2 ? null : 2)}
          className="flex justify-between items-center w-full font-medium text-sm"
        >
          <span className="font-semibold text-[20px]">Day 2: Discussion on GSTR-9C</span>
                 {/* Arrow Icon */}
              <svg
                className={`w-5 h-5 transition-transform ${openDay === 2 ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
        </button>

        {openDay === 2 && (
          <div className="mt-3 text-sm text-gray-600">
            {/* Add Day 2 lesson items here */}
            <p>More info about Day 2 content</p>
          </div>
        )}
      </div>
    </div>
      </div>
    </div>
  );
}
