// pages/index.jsx
import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'


const courses = [
  {
    id: 1,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f1.jpg",   // UPDATED
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
    img: "/images/home/f2.png",   // UPDATED
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
    img: "/images/home/f3.png",   // UPDATED
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
    img: "/images/home/f4.jpg", // waiting for upload
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
    img: "/images/home/f5.png", // waiting for upload
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
    img: "/images/home/f6.png", // waiting for upload
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 7,
    title: "Course 6 thumbnail missing",
    img: "/images/home/f6.png", // waiting for upload
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 8,
    title: "Course 6 thumbnail missing",
    img: "/images/home/f6.png", // waiting for upload
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 9,
    title: "Course 6 thumbnail missing",
    img: "/images/home/f6.png", // waiting for upload
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 10,
    title: "Course 6 thumbnail missing",
    img: "/images/home/f6.png", // waiting for upload
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
];



export default function CoursesPage() {
  const [itemsPerPage, setItemsPerPage] = useState(9)
useEffect(() => {
  const updateItemsPerPage = () => {
    if (window.innerWidth < 768) {
      setItemsPerPage(3)
    } else {
      setItemsPerPage(9)
    }
  }

  updateItemsPerPage()
  window.addEventListener("resize", updateItemsPerPage)

  return () => {
    window.removeEventListener("resize", updateItemsPerPage)
  }
}, [])
  const ITEMS_PER_PAGE = itemsPerPage;

  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [levelFilter, setLevelFilter] = useState('All Levels')
  const [priceFilter, setPriceFilter] = useState('All Prices')
  const [authorFilter, setAuthorFilter] = useState('All Author/faculty')
  const [latestFilter, setLatestFilter] = useState('Latest')
  const [currentPage, setCurrentPage] = useState(1)
  const [active, setActive] = useState("All Courses");



  const filtered = useMemo(() => {
    return courses.filter((course: any) => {
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

const pageCount = Math.ceil(filtered.length / itemsPerPage)

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])



const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

// use filtered array (so filters + pagination both work)
const visibleCourses = filtered.slice(startIndex, endIndex);

  const handlePageClick = (page: number) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  return (
    <div className="container px-4 mx-auto">
      {/* Filter bar */}
      <div className="filter-bar md:flex  mb-10 mt-10  md:px-4 items-center">
        <div className="flex-wrap gap-8 md:flex md:gap-4 px-4 md:px-0">
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

          <select
            value={authorFilter}
            onChange={e => { setAuthorFilter(e.target.value); setCurrentPage(1) }}
            className='border p-2 rounded-[10px]'
          >
            <option>All Author/faculty</option>
            <option>Free</option>
            <option>₹0 - ₹500</option>
            <option>₹500 - ₹1000</option>
            <option>₹1000+</option>
          </select>

          <button className='border p-2 rounded-[10px] text-[#09339B]' onClick={() => {
            setCategoryFilter('All Categories');
            setLevelFilter('All Levels');
            setPriceFilter('All Prices');
            setAuthorFilter('All Author/faculty');
            setCurrentPage(1);
          }}>
            Clear All filter X
          </button>

        </div>


      </div>


      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-10 container mx-auto px-4 ">
        {visibleCourses.map((c) => (
          <div key={c.id} className="bg-white shadow-md rounded-md
   overflow-hidden ">
             <div className="relative w-full h-[200px]">
                  <Image src={c.img} alt={c.title} fill className="object-fit" />
                  <span className="absolute flex gap-1 top-2 right-4 bg-white px-2 py-1 rounded-[14px] text-sm shadow font-semibold mt-2">
                     <img src="/images/icons/star.svg" alt="" className="w-4 h-4 mt-1"/> {c.rating}
                  </span>
                </div>

            <div className="p-3">
              <div className="flex items-center gap-4 text-[#AFAFAF] text-[14px] md:text-[16px] ">
                <span className="flex items-center gap-1"><img src="/images/icons/clock-light.svg" alt="" width="20" height="20" /> {c.hours}</span>
                <span className="flex items-center
   gap-1"><img src="/images/icons/eng-light.svg" alt="" width="20" height="20" /> {c.lang}</span>
              </div>

              <h3 className="text-[16px] md:text-[26px] font-normal
   text-[#252525] mt-2 mb-2">{c.title}</h3>

              <div className="flex items-center gap-2 text-[#AFAFAF] text-[14px] md:text-[16px]">
                <img src="/images/icons/user-light.svg" alt="" width="20" height="20" /> {c.students} students
              </div>

              <div className="flex justify-between items-center mt-2 md:mt-4">
                <div>
                  <span className="line-through
   text-gray-400">{c.oldPrice}</span>
                  <span className="text-[#252525] font-normal text-[16px] md:text-[26px]
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
      <div className="flex justify-center items-center mt-10 gap-2 mb-6">
        {/* Left Arrow */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 rounded border  ${currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed rounded-full"
              : "bg-white hover:bg-gray-100 rounded-full"
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='mx-auto'>
            <path d="M5.5 12.002L19 12.002" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.9999 18.002C10.9999 18.002 5.00001 13.583 5 12.0019C4.99999 10.4208 11 6.00195 11 6.00195" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Page Numbers */}
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageClick(i + 1)}
            className={`w-9 h-9 rounded border text-sm  ${currentPage === i + 1
                ? "bg-[#09339B] text-white rounded-full"
                : "bg-white hover:bg-gray-100 rounded-full"
              }`}
          >
            {i + 1}
          </button>
        ))}

        {/* Right Arrow */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === pageCount}
          className={`w-9 h-9 rounded border ${currentPage === pageCount
              ? "bg-gray-100 text-gray-400 cursor-not-allowed rounded-full "
              : "bg-white hover:bg-gray-100 rounded-full"
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='mx-auto'>
            <path d="M18.5 11.998L5 11.998" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.0001 5.998C13.0001 5.998 19 10.417 19 11.9981C19 13.5792 13 17.998 13 17.998" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>


    </div>
  )
}
