import { useState } from "react";
import ReviewSection from "./ReviewSection";

export default function CourseTabs() {
  const [active, setActive] = useState("description");

  return (

   <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow p-6 mt-10 container   px-4 mx-auto">
      {/* Tabs */}
      <div className="border rounded-lg flex overflow-hidden text-sm font-medium container pr-64 ">
        {[
          { key: "description", label: "Course Description" },
          { key: "content", label: "Course Content" },
          { key: "review", label: "Review" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex-1 px-0 py-3 border-r last:border-none transition-all  pl-4  ${
              active === tab.key
                ? "bg-[#09339B] text-white rounded-[20px] "
                : "bg-white text-[#AFAFAF] hover:bg-gray-200 rounded-[20px]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="pt-6 text-gray-700 leading-relaxed text-sm md:text-base container px-4">

        {active === "description" && (
          <div className="space-y-6">
            <h2 className="text-[20px] font-semibold text-gray-900">Course Description</h2>
            <p className="text-[#929292] text-[16px]">
              In our continuous endeavour to empower more and more finance professionals,
              this certification course has been designed for you. Detailed 2 Days course
              has been designed where daily more than 2 hrs sessions have been organized.
              Recording of the Video is valid for 1 Year. This Course contains Videos
              along with study material and files. Live training of GSTR-9 & GSTR-9C will be given.
            </p>

            <h3 className="text-[20px] font-semibold text-gray-900">How will I get the course:</h3>
            <p className="text-[#929292] text-[16px]">
              This is an online Certification course so there will not be any physical delivery
              of the lectures. After the purchase of this Certification course, you can see this
              course under your my account option under purchased courses. All the videos, study
              materials, PDFs, and PPTs will be uploaded there for quick access by participants.
              This Certification Course's Recording is valid for 1 Year.
            </p>

            <h3 className="text-[20px] font-semibold text-gray-900">
              Who is Eligible to Join this Certification Course:
            </h3>
            <p className="text-[#929292] text-[16px]">
              There is no bound on the eligibility from our side for this Certification Course.
              Any person who wants to learn and master in Taxation can join this course. However,
              it will be more beneficial for the below-mentioned persons:
            </p>

            <ul className="list-disc pl-6 space-y-1 text-[#929292] text-[16px]">
              <li>Commerce Graduates/CA/CS/CMA/Law students</li>
              <li>Tax professionals whether in JOB or Practice</li>
              <li>Qualified CA/CS/CMA/LLB</li>
              <li>Semi–qualified CA/CS/CMA working in CA Firms or in Industry</li>
              <li>Any other person not covered above can join the course if interested.</li>
            </ul>

            <h3 className="text-[20px] font-semibold text-gray-900">Course Duration:</h3>
            <p className="text-[#929292] text-[16px]">
              The course duration is 2 Days and around 4+ hours.
            </p>

            <h3 className="text-[20px] font-semibold text-gray-900">Certificate:</h3>
            <p className="text-[#929292] text-[16px]">
              A Certificate of Participation from the Studycafe will be provided on completion
              of the Certification course.
            </p>

            <h3 className="text-[20px] font-semibold text-gray-900">Views Limitation:</h3>
            <p className="text-[#929292] text-[16px]">
              This is a Completely online course, there is no bar on the number of views.
              During 1 Year you can access this Certification course from anywhere at any
              time with unlimited views.
            </p>

            <h3 className="text-[20px] font-semibold text-gray-900">Course Timing:</h3>
            <p className="text-[#929292] text-[16px]">
              Timing: 6:00 pm to 8:00 pm
            </p>
          </div>
        )}

        {active === "content" && (
              <div className="space-y-6">
            <h2 className="text-[20px] font-semibold text-gray-900">Day 1 : Discussion on GSTR-9</h2>
             <ul className="list-disc pl-6 space-y-1 text-[#929292] text-[16px]">
              <li>GST Provisions related to GSTR-9 and GSTR-9C filing</li>
              <li>⁠GST Annual return, recent changes as per GST notification</li>
              <li>GST annual return workflow, table wise changes and comparison with last year</li>
              <li>Compulsory and Optional Tables</li>
          
            </ul>

            <h3 className="text-[20px] font-semibold text-gray-900">Day-2: Discussion on GSTR-9C</h3>
            <ul className="list-disc pl-6 space-y-1 text-[#929292] text-[16px]">
              <li>⁠How to show impact of Reversals in GST annual Return</li>
              <li>Linkage between GSTR -1, GSTR-3B, GSTR-9 and GSTR-9C</li>
              <li>Practical Aspects will be discussed</li>
         
          
            </ul>
            </div>
        )}

      {active === "review" && (
<ReviewSection/>
)}

      </div>
    </div>
  </div>

  );
}
