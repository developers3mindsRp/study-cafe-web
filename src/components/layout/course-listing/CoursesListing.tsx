// pages/index.jsx
import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { FaClock, FaLanguage, FaUserGraduate } from "react-icons/fa";

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
  {
    id: 4,
    title: "Course 4 thumbnail missing",
    img: "/images/f4.jpg", // waiting for upload
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
    img: "/images/f5.png", // waiting for upload
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
    img: "/images/f6.png", // waiting for upload
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
];

const ITEMS_PER_PAGE = 6

export default function CoursesPage() {
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [levelFilter, setLevelFilter] = useState('All Levels')
  const [priceFilter, setPriceFilter] = useState('All Prices')
  const [latestFilter, setLatestFilter] = useState('Latest')
  const [currentPage, setCurrentPage] = useState(1)
    const [active, setActive] = useState("All Courses");

  const filtered = useMemo(() => { 
    return courses.filter((course:any) => {
      const matchCategory =
        categoryFilter === 'All Categories' || course.category === categoryFilter
      const matchLevel =
        levelFilter === 'All Levels' || course.level === levelFilter
      let matchPrice = true
      if (priceFilter === 'Free') {
        matchPrice = course.price === 0
      } else if (priceFilter === '₹0 - ₹500') {
        matchPrice = course.price > 0 && course.price <= 500
      } else if (priceFilter === '₹500 - ₹1000') {
        matchPrice = course.price > 500 && course.price <= 1000
      } else if (priceFilter === '₹1000+') {
        matchPrice = course.price > 1000
      }
      return matchCategory && matchLevel && matchPrice
    })
  }, [categoryFilter, levelFilter, priceFilter])

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  const handlePageClick = (pageNum:any) => {
    setCurrentPage(pageNum)
  }

  return (
    <div className="container px-4 mx-auto">
    {/* Filter bar */}
    <div className="filter-bar md:flex  mb-10 mt-10  md:px-4 items-center">
      <div className="flex-wrap gap-2 md:flex md:gap-4 ">
        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1) }}
          className='border p-2 rounded-[10px]'
        >
          <option>All Categories</option>
          <option>Accounting</option>
          <option>AI / Automation</option>
          {/* aur categories add karo */}
        </select>

        <select
          value={levelFilter}
          onChange={e => { setLevelFilter(e.target.value); setCurrentPage(1) }}
          className='border p-2 rounded-[10px]'
        >
          <option>All Levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <select
          value={priceFilter}
          onChange={e => { setPriceFilter(e.target.value); setCurrentPage(1) }}
          className='border p-2 rounded-[10px]'
        >
          <option>All Prices</option>
          <option>Free</option>
          <option>₹0 - ₹500</option>
          <option>₹500 - ₹1000</option>
          <option>₹1000+</option>
        </select>
      </div>

      <select
        value={latestFilter}         
        onChange={e => { setLatestFilter(e.target.value); setCurrentPage(1) }}
        className='border p-2 rounded-[10px] md:ml-auto'
      >
        <option>Latest</option>
        <option>Newest</option>
        <option>Recently added</option>
        <option>Oldest</option>
      </select>
    </div>


      {/* Cards Grid */}
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

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2 mb-6">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageClick(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
