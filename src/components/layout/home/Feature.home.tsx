"use client";
import Image from "next/image";
import { useState } from "react";
import { FaClock, FaLanguage, FaUserGraduate } from "react-icons/fa";

const categories = ["All Courses", "Excel", "AI Tools", "GST", "Income Tax"];

const courses = [
  {
    id: 1,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/f1.jpg",
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
    img: "/images/f2.png",
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
    img: "/images/f3.png",
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
    img: "/images/f4.jpg",
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
    img: "/images/f5.png",
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
    img: "/images/f6.png",
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
    img: "/images/f6.png",
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
    img: "/images/f6.png",
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
    img: "/images/f6.png",
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
    img: "/images/f6.png",
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
    img: "/images/f6.png",
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
    img: "/images/f6.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },

];

export default function FeaturedCourses() {
  const [active, setActive] = useState("All Courses");

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
      className="py-14 bg-[url('/images/feature_bg.png')] bg-no-repeat bg-cover bg-center"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div>
            <h2 className="text-[36px] md:text-[40px] font-semibold text-[#121B31]">
              Featured Courses
            </h2>
            <p className="text-[#6A7181] mt-2 mb-6 text-[18px] md:text-[20px] leading-6">
              Explore our most popular courses designed by industry experts
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap  gap-2 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-md whitespace-nowrap transition ${
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
        </div>

 {/* Courses Slider + Grid */}
<div>
  {/* Mobile Slider */}
  <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory sm:hidden pb-4">
    {courses.map((c) => (
      <div
        key={c.id}
        className="w-[300px] snap-center bg-white shadow-md rounded-md overflow-hidden flex-shrink-0"
      >
        <div className="relative w-full h-[220px]">
          <Image src={c.img} alt={c.title} fill className="object-fit" />
          <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm shadow">
            ⭐ {c.rating}
          </span>
        </div>

        <div className="p-4 flex flex-col">
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <FaClock /> {c.hours}
            </span>
            <span className="flex items-center gap-1">
              <FaLanguage /> {c.lang}
            </span>
          </div>

          <h3 className="text-[20px] font-normal text-[#252525] mt-2 mb-2">
            {c.title}
          </h3>

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FaUserGraduate /> {c.students} students
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="line-through text-gray-400">{c.oldPrice}</span>
              <span className="text-[#252525] font-normal text-[22px] ml-2">
                {c.newPrice}
              </span>
            </div>
            <button
              className="bg-[#09339B] text-white px-4 py-2 rounded-md text-sm"
              onClick={() => (window.location.href = "/courses")}
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
        <div className="relative w-full h-[250px] md:h-[233px]">
          <Image src={c.img} alt={c.title} fill className="object-fit" />
          <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm shadow">
            ⭐ {c.rating}
          </span>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <FaClock /> {c.hours}
            </span>
            <span className="flex items-center gap-1">
              <FaLanguage /> {c.lang}
            </span>
          </div>

          <h3 className="text-[22px] md:text-[26px] font-normal text-[#252525] mt-2 mb-2">
            {c.title}
          </h3>

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FaUserGraduate /> {c.students} students
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="line-through text-gray-400">{c.oldPrice}</span>
              <span className="text-[#252525] font-normal text-[22px] md:text-[26px] ml-2">
                {c.newPrice}
              </span>
            </div>
            <button
              className="bg-[#09339B] text-white px-4 py-2 rounded-md text-sm md:text-base"
              onClick={() => (window.location.href = "/courses")}
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
  <div className="flex items-center container mx-auto mt-10 px-4">

      {/* Left Buttons */}
      <div className="flex gap-3">
        <button
          onClick={prev}
          className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white shadow"
        >
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5.5 12.002L19 12.002" stroke="#252525" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.9999 18.002C10.9999 18.002 5.00001 13.583 5 12.0019C4.99999 10.4208 11 6.00195 11 6.00195" stroke="#252525" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
        </button>

        <button
          onClick={next}
          className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18.5 11.998L5 11.998" stroke="#252525" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13.0001 5.998C13.0001 5.998 19 10.417 19 11.9981C19 13.5792 13 17.998 13 17.998" stroke="#252525" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Progress Bar Middle Line */}
      <div className="flex-grow mx-4 h-[4px] bg-gray-300 rounded-full relative overflow-hidden">
        <div
          className="h-full bg-[#09339B] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Right Button */}
      <button className="text-sm text-[#09339B] font-medium flex items-center gap-1 p-4 bg-white rounded-[10px] shadow">
        View All Courses
        <img src="/images/blue_arrow.png" alt="" />
      </button>
    </div>
    </section>
  );
}
