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
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 5,
    title: "Certification Course on How to Automate Your CA Practice",
    img: "/images/f5.png",
    hours: "2+ Hours",
    lang: "English",
    students: "957",
    oldPrice: "₹ 1,999",
    newPrice: "₹ 99",
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
];

export default function FeaturedCourses() {
  const [active, setActive] = useState("All Courses");

  return (
    <section className="   py-14 bg-[url('/images/feature_bg.png')] bg-no-repeat bg-cover bg-center">
      <div className="container mx-auto px-4">
        <div className="">

          <h2 className="text-[40px] font-semibold text-[#121B31]">
            Featured Courses
          </h2>
          <div className="flex justify-between">
            <p className="text-[#6A7181] mt-2 mb-6 text-[24px]">
              Explore our most popular courses designed by <br /> industry experts
            </p>


            {/* Category Filter */}
            <div className="flex flex-wrap gap-4 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-6 py-2 rounded-md whitespace-nowrap transition ${active === cat
                      ? "bg-[#09339B] text-white"
                      : "bg-white text-[#767676] "
                    }`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="container grid md:grid-cols-3 gap-16 md:gap-4 ">
          {courses.map((c) => (
            <div key={c.id} className="bg-white shadow-md rounded-md overflow-hidden ">
              <div className="relative w-full h-[233px]">
                <Image src={c.img} alt={c.title} fill className="object-fit" />
                <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm flex items-center">
                  ⭐ {c.rating}
                </span>
              </div>

              <div className="p-3">
                {/* Info Row */}
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <FaClock /> {c.hours}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaLanguage /> {c.lang}
                  </span>
                </div>

                <h3 className="text-[15px] font-semibold text-[#121B31] mt-2 mb-2">
                  {c.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FaUserGraduate /> {c.students} students
                </div>

                <div className="flex justify-between gap-3 mt-4">
                  <div>   <span className="line-through text-gray-400">{c.oldPrice}</span>
                    <span className="text-[#09339B] font-semibold">{c.newPrice}</span></div>

                  <button className="p-4  bg-[#09339B] text-white py-2 rounded-md mr-10">
                    View Course
                  </button>

                </div>


              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
