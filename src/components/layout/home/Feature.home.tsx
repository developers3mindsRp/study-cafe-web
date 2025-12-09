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
    title: "Course 4 thumbnail missing",
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
    title: "Course 5 thumbnail missing",
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
    title: "Course 6 thumbnail missing",
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
    {courses.map((c) => (
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
    </section>
  );
}
