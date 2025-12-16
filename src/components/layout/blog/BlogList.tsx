// import { Link } from "lucide-react";
import Link from "next/link";
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
    {
      img: "/images/b3.png",
      tag: "GST",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "ICAI Releases Eleventh Edition of GST Acts and Rules",
    },
    {
      img: "/images/b4.png",
      tag: "GST",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "ICAI Releases Eleventh Edition of GST Acts and Rules",
    },
    {
      img: "/images/b3.png",
      tag: "GST",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "ICAI Releases Eleventh Edition of GST Acts and Rules",
    },
    {
      img: "/images/b6.png",
      tag: "GST",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "ICAI Releases Eleventh Edition of GST Acts and Rules",
    },
  ];
 

  const totalSteps = Math.ceil(blogs.length / 6); 
  const [step, setStep] = useState(1);

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  const progress = (step / totalSteps) * 100;

    // Calculate which blogs to show for current step
  const startIndex = (step - 1) * 6;
  const endIndex = startIndex + 6;
  const visibleblogs = blogs.slice(startIndex, endIndex);

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


      <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-6 mt-10  mx-auto container px-4">
            {visibleblogs.map((b) => (
          <div key={b.title} className="rounded-xl shadow-md border bg-white
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


        <Link href="/blogs/blog-detail">
            <button className="text-sm bg-[#09339B] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
              Read More
              <svg className="w-4 h-4" fill="none"stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
        </Link>

            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center container mx-auto mt-10 px-4">
         {/* Left Buttons */}
        <div className="flex gap-3">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white shadow "
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5.5 12.002L19 12.002" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.9999 18.002C10.9999 18.002 5.00001 13.583 5 12.0019C4.99999 10.4208 11 6.00195 11 6.00195" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18.5 11.998L5 11.998" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.0001 5.998C13.0001 5.998 19 10.417 19 11.9981C19 13.5792 13 17.998 13 17.998" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
                             {/* Progress Bar */}
        <div className="flex-grow mx-4 h-[4px] bg-gray-300 rounded-full relative overflow-hidden">
          <div
            className="h-full bg-[#09339B] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <button className="text-sm text-[#09339B] font-medium flex items-center gap-1 p-4 bg-white rounded-[10px] shadow">
          View All Blogs
          <img src="/images/blue_arrow.png" alt="" />
        </button>

      </div>
    </section>
  );
}