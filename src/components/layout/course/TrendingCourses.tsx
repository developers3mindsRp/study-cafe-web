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
      <h2 className="text-[40px] font-semibold text-[#1A1A1A] mb-4 px-4">Trending Courses</h2>


      <div className="grid md:grid-cols-3 gap-10 container mx-auto px-4 ">
                {courses.map((c) => (
                  <div key={c.id} className="bg-white shadow-md rounded-md
      overflow-hidden ">
                    <div className="relative w-full h-[233px]">
                      <Image src={c.img} alt={c.title} fill 
            className="object-fit" />
                      <span className="absolute top-2 right-2 bg-white px-2
      py-1 rounded text-sm shadow">
                        ⭐ {c.rating}
                      </span>
                    </div>
      
                    <div className="p-3">
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <span className="flex items-center gap-1"><FaClock
      /> {c.hours}</span>
                        <span className="flex items-center
      gap-1"><FaLanguage /> {c.lang}</span>
                      </div>
      
                      <h3 className="text-[26px] font-normal
      text-[#252525] mt-2 mb-2">{c.title}</h3>
      
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FaUserGraduate /> {c.students} students
                      </div>
      
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <span className="line-through
      text-gray-400">{c.oldPrice}</span>
                          <span className="text-[#252525] font-normal text-[26px]
                    ml-2">{c.newPrice}</span>
                        </div>
                        <button className="bg-[#09339B] text-white px-4 py-2
                     rounded-md"  onClick={() => window.location.href = "/courses"}>
                          View Course
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
