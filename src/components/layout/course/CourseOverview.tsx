import { CheckCircle, Gift } from "lucide-react";
import { useState } from "react";

const features = [
  "GST Provisions related to GSTR-9 and GSTR-9C Filing",
  "How to show impact of Reversals in GST annual Return",
  "GST Annual return, recent changes as per GST notification",
  "Linkage between GSTR-1, GSTR-3B, GSTR-9 and GSTR-9C",
  "GST annual return workflow, table wise changes and comparison with last year",
  "Practical Aspects will be discussed",
  "Compulsory and Optional Tables",
];

const bonuses = [
  {
    title: "Ready Made Editable Microsoft Excel Templates to work 10X Faster in your Office",
    image: "/images/excel.png",
    worth: "₹4,000",
  },
  {
    title: "Ready Made AI Tools Prompts to work 10X Faster in your Office",
    image: "/images/service.png",
    worth: "₹4,000",
  },
  {
    title: "Ready Made Microsoft Excel Short Cut E-Book for MS Office to Work 10X Faster",
    image: "/images/powerpoint.png",
    worth: "₹2,000",
  },
  {
    title: "Ready Made Microsoft Excel Short Cut E-Book for MS Office to Work 10X Faster",
    image: "/images/excel.png",
    worth: "₹2,000",
  },
];

const faqs = [
  {
    q: "Day1: What is the Duration of the Course?",
    a: [
      "GST Provisions related to GSTR-9 and GSTR-9C filing",
      "⁠GST Annual return, recent changes as per GST notification",
      "GST annual return workflow, table wise changes and comparison with last year",
      "Compulsory and Optional Tables"
    ],
  },
  {
    q: "Day2: Discussion on GSTR-9C",
    a: [
      "GST Provisions related to GSTR-9 and GSTR-9C filing",
      "⁠GST Annual return, recent changes as per GST notification",
      "GST annual return workflow, table wise changes and comparison with last year",
      "Compulsory and Optional Tables"
    ],
  },

];



export default function CourseOverview() {
  const [openIndex, setOpenIndex] = useState<any>('');
  return (
    <section className="container px-4 mx-auto  ">
      {/* Course Key Features */}


      <div className="grid md:grid-cols-2 gap-6 mb-12 mt-8 scroll-mt-28" id="features">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg border border-[#09B285] bg-[#E9FCF0] p-4"
          >
            <img src="/images/tick1.png" alt="" width="45" height="45" />
            <p className="text-[14px] text-black font-medium mt-4">{feature}</p>
          </div>
        ))}
      </div>

      {/* Course Description */}
      <h2 className="container scroll-mt-28  text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4
            px-4 py-3 text-white
           
            bg-gradient-to-r from-[#253D8E] to-transparent
            md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto" id="description">Course Description</h2>

      <div className="bg-white border rounded-lg p-6 text-[#6C6C6C] text-[17px] leading-[32px] mb-12 font-normal shadow-lg">
        <p>
          In our continuous endeavour to empower more and more finance
          professionals, this certification course has been designed for you.
          Detailed 2 days course has been designed where daily more than 2 hrs
          sessions have been organized. Recording of the Video is Valid for 1
          Year. This course contains Videos along with study material and files.
          Live training of GSTR-9 & GSTR-9C will be given.
        </p>


        {/* Bonuses */}
        <div className="p-4 sm:p-8">
          {/* Badge */}
          <button className="flex items-center justify-center gap-2 mb-3 bg-[#F7AA0A] mx-auto px-4 py-2 rounded-[10px]">
            <img src="/images/gift.png" alt="" className="w-5 h-5" />
            <span className="text-sm font-normal text-white">
              Exclusive bonuses
            </span>
          </button>

          {/* Heading */}
          <h3 className="text-center text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#252525] mt-2">
            Register Fast to unlock bonuses worth ₹12,000
          </h3>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-10 px-2 sm:px-8 lg:px-32 mt-8 sm:mt-12">
            {bonuses.map((bonus, index) => (
              <div
                key={index}
                className="relative bg-[#FEF9F1] border border-[#F59F0A] rounded-lg p-4 sm:p-6 text-center shadow-sm"
              >
                {/* Bonus Tag */}
                <span className="absolute -top-4 left-4 text-[14px] sm:text-[16px] font-semibold bg-black text-[#FFCC33] px-3 py-1 rounded-[10px]">
                  Bonus {index + 1}
                </span>

                {/* Content */}
                <div className="flex items-start gap-3 mt-4">
                  <img
                    src={bonus.image}
                    alt=""
                    className="w-[36px] h-[36px] sm:w-[43px] sm:h-[43px]"
                  />
                  <h4 className="text-sm sm:text-base font-semibold text-left">
                    {bonus.title}
                  </h4>
                </div>

                {/* Worth */}
                <span className="relative top-10 mt-6 text-[16px] sm:text-[18px] font-bold text-green-600 bg-green-100 px-3 py-2 rounded-[10px]">
                  Worth {bonus.worth}
                </span>
              </div>
            ))}
          </div>
        </div>


        <div className="mt-12">
          <h2 className="text-[25px] text-[#252525] font-semibold">How I will get the course:</h2>
          <p className="text-[17px] text-[#6C6C6C] leading-[32px] mt-4">This is an online Certification course so there will not be any physical delivery of the lectures. After the purchase of this Certification course, you can see this course under my account option under purchased courses. All the videos, study materials, PDF files and PPTs, will be uploaded there for quick access by participants. This Certification Course's Recording is valid for 1 Year.</p>
        </div>

        <div className="mt-12">
          <h2 className="text-[25px] text-[#252525] font-semibold">Who is Eligible to Join this Certification Course:</h2>
          <p className="text-[17px] text-[#6C6C6C] leading-[32px] mt-4 ">There is no bound on the eligibility from our side for this Certification Course. Any person who wants to learn and master in Taxation can join this course. However, it will be more beneficial for the below-mentioned persons:</p>
          <ul className="list-disc pl-4 mt-8">
            <li>Commerce Graduates/CA/CS/CMA/Law students</li>
            <li>Tax professionals whether in JOB or Practice</li>
            <li>Qualified CA/CS/CMA/LLB</li>
            <li>Semi-qualified CA/CS/CMA working in CA Firms or in Industry</li>
            <li>Any other person not covered above can join the course if interested.</li>
          </ul>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">

          <div className="bg-[#F9F9FB] p-8 ">
            <img src="/images/duration.png" alt="" />
            <h2 className="font-bold text-[20px] text-black mb-4 mt-4">Course Duration</h2>
            <p>The course duration is 2 Days and around 4+ hours.</p>
          </div>
          <div className="bg-[#F9F9FB] p-8">
            <img src="/images/view.png" alt="" />
            <h2 className="font-bold text-[20px] text-black mb-4 mt-4">Views Limitation</h2>
            <p>This is a fully online course with 1-year unlimited access, available anytime and anywhere.</p>
          </div>
          <div className="bg-[#F9F9FB] p-8">
            <img src="/images/time.png" alt="" />
            <h2 className="font-bold text-[20px] text-black mb-4 mt-4">Course Timing</h2>
            <p>Timing: 6:00 pm to 8:00 pm</p>
          </div>
        </div>

      </div>

      <h2 className="container scroll-mt-28 text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4
            px-4 py-3 text-white
           
            bg-gradient-to-r from-[#253D8E] to-transparent
            md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto" id="content">Course Content</h2>

      <div className="w-full  mt-10 space-y-3 text-left container px-4">
        {faqs.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden bg-[#09339B]">
            {/* Question Button */}
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className={`
              w-full flex justify-between items-center p-4 transition
              ${openIndex === index
                  ? "bg-[#09339B] text-white"    // Active
                  : "bg-white text-[#09339B]"}   // Inactive
            `}
            >
              <span className="font-medium text-[20px]  text-left "> {item.q}</span>

              {/* Arrow Icon */}
              <svg
                className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div className="px-4 pb-4 text-[16px] text-gray-600 leading-relaxed border-t bg-white">
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {item.a.map((text, i) => (
                    <li key={i}>{text}</li>
                  ))}
                </ul>
              </div>
            )}


          </div>
        ))}
      </div>

      <h2 className="  container mt-8 scroll-mt-28 text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4
            px-4 py-3 text-white
           
            bg-gradient-to-r from-[#253D8E] to-transparent
            md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto" id="certificate">Certificate</h2>
      <p className=" text-center text-[20px] mb-10 font-medium text-black">Certificate to be provided to all the participants.</p>
      <img src="/images/certificate1.png" alt="" className="mx-auto" />


    </section>
  );
}
