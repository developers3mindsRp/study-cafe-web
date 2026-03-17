// import { Link } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useState, useMemo, useEffect } from 'react'

export default function Blog_list() {
  const [itemsPerPage, setItemsPerPage] = useState(6)
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(3)
      } else {
        setItemsPerPage(6)
      }
    }

    updateItemsPerPage()
    window.addEventListener("resize", updateItemsPerPage)

    return () => {
      window.removeEventListener("resize", updateItemsPerPage)
    }
  }, [])

  const categories = ["All", "Finance", "Income Tax", "GST", "CA", "Company Laws", "Education", "Mutual Funds", "Insurance", "Share Market"];
  const [active, setActive] = useState("All");
  const [currentPage, setCurrentPage] = useState(1)
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
  const filtered = useMemo(() => {
    return active === "All"
      ? blogs
      : blogs.filter((b) => b.tag === active);
  }, [blogs, active]);

  const pageCount = Math.ceil(filtered.length / itemsPerPage);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handlePageClick = (page: number) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  return (

    <section className="w-full py-6 md:py-12 px-2 md:px-6 text-center">
      {/* Category Filter */}
      <div className="container mx-auto px-4">
        <div className="flex md:flex-wrap gap-3 overflow-x-auto md:overflow-visible no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`flex-shrink-0 px-5 py-2 rounded-md whitespace-nowrap transition border ${active === cat
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



      <div className="mt-8 md:mt-10 mx-auto container px-4">

        {filtered.length === 0 ? (
          <div className="text-center md:py-20">
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No Blog Found
            </h3>
            <p className="text-gray-400">
              There are no blogs available in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginated.map((b) => (
              <div
                key={b.title}
                className="rounded-xl shadow-md border bg-white overflow-hidden text-left"
              >
                <div className="relative w-full xl:h-[243px]">
                  <img
                    src={b.img}
                    alt="blog"
                    className="w-full h-full object-cover"
                  />

                  <span className="absolute top-4 left-4 bg-white text-[#252525] text-[14px] font-normal px-2 py-1 rounded-[14px]">
                    {b.tag}
                  </span>
                </div>

                <div className="p-3 xl:p-4">
                  <div className="flex items-center gap-2 md:gap-2 xl:text-[16px] text-[#AFAFAF] mb-3">
                    <span className="flex gap-1">
                      <img src="/images/user.svg" alt="" width="20" height="20" />
                      {b.author}
                    </span>
                    <span className="flex gap-2">
                      <img src="/images/calendar.svg" alt="" width="20" height="10" />
                      {b.date}
                    </span>
                  </div>

                  <h3 className="font-medium text-[16px] text-[20px] xl:text-[26px] text-[#252525] leading-tight mb-4 line-clamp-2">
                    {b.title}
                  </h3>

                  <Link href="/blogs/blog-detail">
                    <button className="text-sm bg-[#09339B] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      Read More
                      <img src="/images/arrow-left.svg" alt="" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
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
            <img src="/images/f-left.svg" alt="" className='ml-1'/>
        </button>

        {/* Page Numbers */}
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageClick(i + 1)}
            className={`w-9 h-9 rounded border text-sm border shadow-sm ${currentPage === i + 1
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
            <img src="/images/f-right.svg" alt="" className='ml-1'/>
        </button>
        </div>
      )}


    </section>
  );
}