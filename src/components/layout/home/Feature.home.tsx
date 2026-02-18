"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

const categories = ["Top Selling", "Excel", "AI Tools", "GST", "Income Tax"];

const courses = [
  {
    id: 1,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f1.jpg",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 2,
    title: "Certification Course on How to Automate Your CA Practice",
    img: "/images/home/f2.png",
    hours: "2+ Hours",
    lang: "English",
    students: "957",
    oldPrice: "₹ 1,999",
    newPrice: "₹ 99",
    rating: "4.8",
  },
  {
    id: 3,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f3.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 4,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f4.jpg",
    hours: "3+ Hours",
    lang: "English",
    students: "820",
    oldPrice: "₹ 1,499",
    newPrice: "₹ 499",
    rating: "4.8",
  },
  {
    id: 5,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f5.png",
    hours: "1.5+ Hours",
    lang: "English",
    students: "500",
    oldPrice: "₹ 999",
    newPrice: "₹ 299",
    rating: "4.8",
  },
  {
    id: 6,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f6.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 7,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f6.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 8,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f6.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 9,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f6.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 10,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f6.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 11,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f6.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 12,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f6.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },

];

export default function FeaturedCourses() {
  const [active, setActive] = useState(categories[0]);

  // Reference for mobile categories carousel
  const catRef = useRef<HTMLDivElement | null>(null);

  // Scroll helpers for mobile category slider
  const scrollCategories = (direction: number) => {
    if (!catRef.current) return;
    const width = catRef.current.clientWidth * 0.7; // scroll by ~70% of viewport
    catRef.current.scrollBy({ left: width * direction, behavior: "smooth" });
  };
  const prevCategory = () => scrollCategories(-1);
  const nextCategory = () => scrollCategories(1);

  const totalSteps = Math.ceil(courses.length / 6);
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
  const visibleBCourses = courses.slice(startIndex, endIndex);



  return (
    <section
      className="md:py-14 "
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div>
            <h2 className="text-[36px] md:text-[40px] text-center md:text-left font-semibold text-[#121B31]">
              Featured Courses
            </h2>
            <p className="text-[#6A7181] mt-2 mb-6 text-[18px] md:text-[20px] leading-6 text-center px-8 md:px-0">
              Explore our most popular courses designed by industry experts
            </p>
          </div>

          {/* Category Filter */}
          {/* Mobile: carousel with arrows */}
          <div className="sm:hidden w-full relative px-2">
            <div className="flex items-center">
              {/* <button
                onClick={prevCategory}
                aria-label="Previous category"
                className="p-2 rounded-md mr-2 bg-white shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M15 18L9 12l6-6" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button> */}

              <div
                ref={catRef}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory  scrollbar-hide scroll-smooth -ml-1 "
                role="listbox"
                aria-label="Course categories"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    role="option"
                    aria-selected={active === cat}
                    className={`snap-center flex-shrink-0  px-6 py-3 rounded-md whitespace-nowrap transition ${active === cat
                      ? "bg-[#09339B] text-white"
                      : "bg-transparent text-[#767676]"
                      }`}
                    onClick={() => setActive(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Desktop: inline buttons */}
          <div className="hidden sm:flex flex-wrap gap-2 md:gap-4 mt-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-[10px] whitespace-nowrap transition ${active === cat
                    ? "bg-[#09339B] text-white"
                    : "bg-transparent text-[#767676]"
                  }`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Courses Slider + Grid */}
        <div>
          {/* Mobile Slider */}
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory sm:hidden pb-4 scrollbar-hide px-2">
            {courses.map((c) => (
              <div
                key={c.id}
                className="w-[300px] snap-center bg-white shadow-md rounded-md overflow-hidden flex-shrink-0"
              >
                <div className="relative w-full h-[180px]">
                  <Image src={c.img} alt={c.title} fill className="object-fit" />
                  <span className="absolute flex gap-1 top-2 right-4 bg-white px-2 py-1 rounded-full text-sm shadow  mt-2">
                     <img src="/images/icons/star.svg" alt="" className="w-4 h-4 mt-1"/> {c.rating}
                  </span>
                </div>

                <div className="p-4 flex flex-col">
                  <div className="flex flex-wrap items-center gap-4 text-[#AFAFAF] text-sm">
                    <span className="flex items-center gap-1">
                      <img src="/images/icons/clock-light.svg" alt="" width="20" height="20" /> {c.hours}
                    </span>
                    <span className="flex items-center gap-1">
                      <img src="/images/icons/eng-light.svg" alt="" width="20" height="20" /> {c.lang}
                    </span>
                  </div>

                  <h3 className="text-[20px] font-normal text-[#252525] mt-2 mb-2">
                    {c.title}
                  </h3>

                  <div className="flex items-center gap-1 text-[#AFAFAF] text-sm">
                    <img src="/images/icons/user-light.svg" alt="" width="20" height="20" />{c.students} students
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="line-through text-[#AFAFAF] text-[15px]">{c.oldPrice}</span>
                      <span className="text-[#252525] font-normal text-[15px] ml-2">
                        {c.newPrice}
                      </span>
                    </div>
                    <button
                      className="bg-[#09339B] text-white px-4 py-2 rounded-md text-sm"
                      onClick={() => (window.location.href = "/course/1")}
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-8">
            {visibleBCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white shadow-md rounded-md overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-[250px] md:h-[250px]">
                  <Image src={c.img} alt={c.title} fill className="object-fit" />
                  <span className="absolute flex  gap-1 top-2 right-3 bg-white px-2 rounded-full text-[18px] font-normal shadow mt-4">
                    <img src="/images/icons/star.svg" alt="" className="w-4 h-4 mt-1"/> {c.rating}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-4 text-[#AFAFAF] text-sm">
                    <span className="flex items-center gap-1">
                      <img src="/images/icons/clock-light.svg" alt="" width="20" height="20" />{c.hours}
                    </span>
                    <span className="flex items-center gap-1">
                      <img src="/images/icons/eng-light.svg" alt="" width="20" height="20" /> {c.lang}
                    </span>
                  </div>

                  <h3 className="text-[22px] md:text-[26px] font-normal text-[#252525] mt-2 mb-2">
                    {c.title}
                  </h3>

                  <div className="flex items-center gap-1 text-[#AFAFAF] text-sm">
                    <img src="/images/icons/user-light.svg" alt="" width="20" height="20" />{c.students} students
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="line-through text-[#AFAFAF] text-[26px]">{c.oldPrice}</span>
                      <span className="text-[#252525] font-normal text-[22px] md:text-[26px] ml-2">
                        {c.newPrice}
                      </span>
                    </div>
                    <button
                      className="bg-[#09339B]  text-white px-4 py-2 rounded-md text-sm md:text-base"
                      onClick={() => (window.location.href = "/course/1")}
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      {/* Bottom Navigation */}
      <div className=" md:flex items-center container mx-auto md:mt-10 px-4">

        {/* Left Buttons */}
        <div className="hidden  md:flex gap-3">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white border border-gray-300 "
          >
          <img src="/images/f-left.svg" alt="" />
          </button>

          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white border border-gray-300 "
          >
       <img src="/images/f-right.svg" alt="" />
          </button>
        </div>

        {/* Progress Bar Middle Line */}
        <div className="hidden md:block flex-grow mx-4 h-[4px] bg-gray-300 rounded-full relative overflow-hidden">
          <div
            className="h-full bg-[#09339B] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Right Button */}
        <div className="w-full flex justify-center md:w-auto md:justify-end mb-6 md:mb-0 mt-4 md:mt-0">
          <Link href="/courses">
            <button className="text-sm text-[#09339B] border border-[#09339B] md:border-none font-medium flex items-center gap-1 p-2 md:p-4 bg-white rounded-[10px] ">
              View All Courses
              <img src="/images/icons/blue_arrow.png" alt="" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
