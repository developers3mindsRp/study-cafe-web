import React from "react";

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
  ];

  return (
    <section className="w-full py-12 bg-[url('/images/feature_bg.png')]
bg-no-repeat bg-cover bg-center px-6 text-center">
      <h2 className="text-[40px] font-semibold text-[#1A1A1A]">Latest
from Our Blog</h2>
      <p className="text-[24px] text-gray-600 max-w-md mx-auto mt-2">
        Stay updated with the latest insights, tips, and industry trends
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10  mx-auto container px-4">
        {blogs.map((b, i) => (
          <div key={i} className="rounded-xl shadow-md border bg-white
overflow-hidden text-left">
            <img src={b.img} alt="blog" className="w-full h-[233px] object-fit" />

            <div className="p-4">


              <div className="flex items-center gap-2 text-[16px]
text-[#AFAFAF] mb-3">
                <span>{b.author}</span> • <span>{b.date}</span>
              </div>

              <h3 className="font-medium text-[26px] text-[#252525]
leading-tight mb-4">
                {b.title}
              </h3>

              <button className="text-sm bg-[#09339B] hover:bg-blue-700
text-white px-4 py-2 rounded-md flex items-center gap-2">
                Read More
                <svg className="w-4 h-4" fill="none"
stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center container
mx-auto mt-10 px-4">
        <div className="flex gap-3">
          <button className="w-10 h-10 flex items-center
justify-center rounded-full bg-white shadow">
            <svg className="w-5 h-5" fill="none" stroke="currentColor"
strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="w-10 h-10 flex items-center
justify-center rounded-full bg-white shadow">
            <svg className="w-5 h-5" fill="none" stroke="currentColor"
strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9
5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button className="text-sm text-[#09339B] font-medium flex
items-center gap-1">
          View All Blogs
          <svg className="w-4 h-4" fill="none" stroke="currentColor"
strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9
5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}