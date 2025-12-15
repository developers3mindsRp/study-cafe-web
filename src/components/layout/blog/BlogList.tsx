import React from "react";
import { useState } from "react";

export default function Blog_list() {
const categories = ["All ", "Finance", "Income Tax", "GST", "CA", "Company Laws", "Education", "Mutual Funds", "Insurance", "Share Market"];
  const [active, setActive] = useState("All Courses");
  const blogs = [
    {
      img: "/images/b1.jpg",
      tag: "Income Tax",
      author: "Janvi",
      date: "Jul 21, 2025",
      title: "Debt Mutual Funds for Monthly Income: How It Works?",
    },
    {
      img: "/images/b2.png",
      tag: "Finance",
      author: "Vanshika verma",
      date: "Nov 22, 2025",
      title: "Employees Must Know about these 4 new Labour Codes...",
    },
    {
      img: "/images/b3.png",
      tag: "GST",
      author: " Meetu Kumari",
      date: "Nov 18, 2025",
      title: "Delhi HC Slams GST Dept for Ex-Parte Order, Reopens...",
    },
    {
      img: "/images/b4.png",
      tag: "GST",
      author: "Meetu Kumari",
      date: "Nov 18, 2025",
      title: "Income tax: Delhi hc remands back reopening of case to...",
    },
    {
      img: "/images/b5.png",
      tag: "GST",
      author: " Saloni Kumari",
      date: "Nov 17, 2025",
      title: "Uae finalises new sugar-based tax model for sweetened...",
    },
    {
      img: "/images/b6.png",
      tag: "GST",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "ICAI Releases Eleventh Edition of GST Acts and Rules",
    },
  ];

  return (
    <section className="w-full py-12 px-2 md:px-6 text-center">
        {/* Category Filter */}
          <div className="flex flex-wrap gap-2 md:gap-8 mx-auto container md:px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-md whitespace-nowrap transition border ${
                  active === cat
                    ? "bg-[#09339B] text-white"
                    : "bg-transparent text-[#767676]"
                }`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>


      <div className="grid md:grid-cols-3 gap-6 mt-10  mx-auto container px-4">
        {blogs.map((b, i) => (
          <div key={i} className="rounded-xl shadow-md border bg-white
          overflow-hidden text-left">
            <img src={b.img} alt="blog" className="w-full h-[263px] object-fit" />

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