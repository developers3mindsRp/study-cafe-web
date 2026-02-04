import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { FaClock, FaLanguage, FaUserGraduate } from "react-icons/fa";

const TrendingCourses = () => {
  const courses = [
    {
      id: 1,
      title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
      img: "/images/f1.jpg",   // UPDATED
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
      img: "/images/f2.png",   // UPDATED
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
      img: "/images/f3.png",   // UPDATED
      hours: "4+ Hours",
      lang: "English",
      students: "1240",
      oldPrice: "₹ 2,000",
      newPrice: "₹ 699",
      rating: "4.8",
    },
  ];

  return (
    <section className="w-full py-12  px-4 mx-auto container">
      <h2 className="text-[20px] md:text-[40px] font-medium   mb-6 md:mb-4
            px-4 py-3 text-white
           
            bg-gradient-to-r from-[#253D8E] to-transparent
            md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto">Trending Courses</h2>


      {/* Mobile Slider */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden mt-10 pb-4 px-2 scrollbar-hide">
        {courses.map((c, i) => (
          <div
            key={i}
            className="min-w-[320px] snap-center rounded-xl shadow-md border bg-white overflow-hidden text-left"
          >
            <div className="relative w-full h-[183px]">
              <Image src={c.img} alt={c.title} fill className="object-fit" />
              <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-[10px] text-sm shadow">
                ⭐ {c.rating}
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                <span className="flex items-center gap-1">
                   <img src="/images/icons/clock-light.svg" alt="" width="20" height="20" />  {c.hours}
                </span>
                <span className="flex items-center gap-1">
                  <img src="/images/icons/eng-light.svg" alt="" width="20" height="20" />  {c.lang}
                </span>
              </div>

              <h3 className="font-medium text-[18px] text-[#252525] leading-tight mb-4">
                {c.title}
              </h3>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <img src="/images/icons/user-light.svg" alt="" width="20" height="20" />  {c.students} students
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="line-through text-gray-400 text-[14px]">{c.oldPrice}</span>
                  <span className="text-[#252525] font-semibold text-[22px] ml-2">{c.newPrice}</span>
                </div>

                <button
                  className="text-sm bg-[#09339B] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  onClick={() => (window.location.href = "/courses")}
                >
                  View Course
                  <img src="/images/arrow-left.svg" alt="" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 mt-10 container mx-auto px-4">
        {courses.map((c, i) => (
          <div key={i} className="rounded-xl shadow-md border bg-white overflow-hidden text-left">
            <div className="relative w-full h-[233px]">
              <Image src={c.img} alt={c.title} fill className="object-fit" />
              <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm shadow">
                ⭐ {c.rating}
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                <span className="flex items-center gap-1">
                    <img src="/images/icons/clock-light.svg" alt="" width="20" height="20" />  {c.hours}
                </span>
                <span className="flex items-center gap-1">
                     <img src="/images/icons/eng-light.svg" alt="" width="20" height="20" />  {c.lang}
                </span>
              </div>

              <h3 className="font-medium text-[26px] text-[#252525] leading-tight mb-4">
                {c.title}
              </h3>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                 <img src="/images/icons/user-light.svg" alt="" width="20" height="20" />  {c.students} students
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="line-through text-gray-400 text-[16px]">{c.oldPrice}</span>
                  <span className="text-[#252525] font-semibold text-[26px] ml-2">{c.newPrice}</span>
                </div>

                <button
                  className="text-sm bg-[#09339B] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  onClick={() => (window.location.href = "/courses")}
                >
                  View Course
                  <img src="/images/arrow-left.svg" alt="" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}



export default TrendingCourses
