import React, { useState } from "react";
import Link from "next/link";


export default function BlogSection() {
  const blogs = [
    {
      img: "/images/b1.jpg",
      tag: "Income Tax",
      author: "Meetu Kumari",
      date: "Nov 18, 2025",
      title: "Income tax: Delhi HC remands back reopening of case to...",
    },
    {
      img: "/images/b2.png",
      tag: "Finance",
      author: "Sakshi Kumari",
      date: "Nov 17, 2025",
      title: "UAE finalises new sugar-based tax model for sweetened...",
    },
    {
      img: "/images/b3.png",
      tag: "GST",
      author: "Meetu Kumari",
      date: "Nov 16, 2025",
      title: "Delhi HC slams GST Dept for Ex-Parte Order, Reopens...",
    },
    {
      img: "/images/b3.png",
      tag: "GST",
      author: "Meetu Kumari",
      date: "Nov 16, 2025",
      title: "Delhi HC slams GST Dept for Ex-Parte Order, Reopens...",
    },
    {
      img: "/images/b3.png",
      tag: "GST",
      author: "Meetu Kumari",
      date: "Nov 16, 2025",
      title: "UAE finalises new sugar-based tax model for sweetened...",
    },
    {
      img: "/images/b2.png",
      tag: "GST",
      author: "Meetu Kumari",
      date: "Nov 16, 2025",
      title: "Delhi HC slams GST Dept for Ex-Parte Order, Reopens...",
    },
    {
      img: "/images/b1.jpg",
      tag: "GST",
      author: "Meetu Kumari",
      date: "Nov 16, 2025",
      title: "UAE finalises new sugar-based tax model for sweetened...",
    },
    {
      img: "/images/b2.png",
      tag: "GST",
      author: "Meetu Kumari",
      date: "Nov 16, 2025",
      title: "Delhi HC slams GST Dept for Ex-Parte Order, Reopens...",
    },
    {
      img: "/images/b3.png",
      tag: "GST",
      author: "Meetu Kumari",
      date: "Nov 16, 2025",
      title: "UAE finalises new sugar-based tax model for sweetened ",
    },
  ];

  const totalSteps = Math.ceil(blogs.length / 3);
  const [step, setStep] = useState(1);

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  const progress = (step / totalSteps) * 100;

  // Calculate which blogs to show for current step
  const startIndex = (step - 1) * 3;
  const endIndex = startIndex + 3;
  const visibleBlogs = blogs.slice(startIndex, endIndex);

  return (
    <section
      className="w-full py-12 bg-[url('/images/course-bg.png')] bg-no-repeat bg-cover bg-center px-6 text-center "
    >
      <h2 className="text-[30px] md:text-[40px] font-semibold text-[#1A1A1A]">
        Latest from Our Blog
      </h2>
      <p className="text-[16px] md:text-[24px] text-gray-600 max-w-md mx-auto mt-2">
        Stay updated with the latest insights, tips, and industry trends
      </p>

      {/* Mobile Slider (unchanged) */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden mt-10 pb-4 px-2 scrollbar-hide
">
        {blogs.map((b, i) => (
          <div
            key={i}
            className="min-w-[320px] snap-center rounded-xl shadow-md border bg-white overflow-hidden text-left"
          >
            {/* <img src={b.img} alt="blog" className="w-full h-[200px] object-fit" /> */}
                <div className="relative w-full h-[200px]">
              <img
                src={b.img}
                alt="blog"
                className="w-full h-full object-fit"
              />

              {/* Right Corner Tag */}
              <span className="absolute top-4 left-4 bg-white text-[#252525] text-[10px] font-normal px-2 py-1 rounded-[14px] ">
                {b.tag}
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 text-[12px] text-[#AFAFAF] mb-3">
                <span className="flex"> <img src="/images/user.svg" alt="" width="10" height="10" /> {b.author}</span>  <span className="flex gap-2"><img src="/images/calendar.svg" alt="" width="10" height="10" />{b.date}</span>
              </div>
              <h3 className="font-medium text-[14px] text-[#252525] leading-tight mb-4">
                {b.title}
              </h3>
              <button className="text-[12px] bg-[#09339B] hover:bg-blue-700 text-white px-4 py-1 rounded-md flex items-center gap-2">
                Read More
                <img src="/images/arrow-left.svg" alt="" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Slider (updated) */}
      <div className="hidden md:flex gap-6 mt-10 justify-center container mx-auto px-6">
        {visibleBlogs.map((b, i) => (
          <div key={i} className=" rounded-xl shadow-md border bg-white overflow-hidden text-left">
          <div className="relative w-full h-[233px]">
              <img
                src={b.img}
                alt="blog"
                className="w-full h-full object-fit"
              />

              {/* Right Corner Tag */}
              <span className="absolute top-4 left-4 bg-white text-[#252525] text-[14px] font-normal px-2 py-1 rounded-[14px] ">
                {b.tag}
              </span>
            </div>

            
   
            <div className="p-4">
              <div className="flex items-center gap-2 text-[16px] text-[#AFAFAF] mb-3">
                <span className="flex"> <img src="/images/user.svg" alt="" width="20" height="20" /> {b.author}</span>  <span className="flex gap-2"><img src="/images/calendar.svg" alt="" width="20" height="10" />{b.date}</span>

              </div>
              <h3 className="font-medium text-[26px] text-[#252525] leading-tight mb-4 ">
                {b.title}
              </h3>
              <Link href="/blogs/blog-detail">
                <button className="text-sm bg-[#09339B] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  Read More
                  <img src="/images/arrow-left.svg" alt="" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation (unchanged) */}
      <div className=" flex items-center container mx-auto mt-10 px-4">
        {/* Left Buttons */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white shadow "
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5.5 12.002L19 12.002" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.9999 18.002C10.9999 18.002 5.00001 13.583 5 12.0019C4.99999 10.4208 11 6.00195 11 6.00195" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18.5 11.998L5 11.998" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.0001 5.998C13.0001 5.998 19 10.417 19 11.9981C19 13.5792 13 17.998 13 17.998" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:block flex-grow mx-4 h-[4px] bg-gray-300 rounded-full relative overflow-hidden">
          <div
            className="h-full bg-[#09339B] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Right Button */}
        <div className="w-full flex justify-center md:w-auto md:justify-end">
          <Link href="/blogs">
            <button className="text-sm text-[#09339B] font-medium flex items-center gap-1 p-2 pl-4 pr-4 bg-white rounded-[10px] shadow">
              View All Blogs
              <img src="/images/icons/blue_arrow.png" alt="" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
