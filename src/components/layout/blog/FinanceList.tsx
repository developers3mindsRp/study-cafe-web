// import { Link } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useState, useMemo, useEffect } from 'react'

export default function Finance_list() {
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

  const categories = ["All", "Finance", "Income Tax", "GST", "CA", "Company Laws", "Education", "Mutual Funds", "Insurance", "Share Market"];
  const [active, setActive] = useState("All");
  const [currentPage, setCurrentPage] = useState(1)
  const blogs = [
    {
      img: "/images/finance/f1.png",
      tag: "finance",
      author: "Janvi",
      date: "Jul 21, 2025",
      title: "Centre Grants Temporary Exemption to SBI and Bank of...",
    },
    {
      img: "/images/finance/f2.png",
      tag: "Finance",
      author: "Vanshika verma",
      date: "Nov 22, 2025",
      title: "Employees Must Know about these 4 new Labour Codes...",
    },
    {
       img: "/images/finance/f3.png",
      tag: "finance",
      author: " Meetu Kumari",
      date: "Nov 18, 2025",
      title: "NRIs Get Major Tax Relief in Budget 2026: Investment....",
    },
    {
      img: "/images/finance/f4.png",
      tag: "finance",
      author: "Meetu Kumari",
      date: "Nov 18, 2025",
      title: "Ministry of Finance Notifies Amendment to Health...",
    },
    {
      img: "/images/finance/f5.png",
      tag: "finance",
      author: " Saloni Kumari",
      date: "Nov 17, 2025",
      title: "Budget 2026 Expectations: Will Housing Become More...",
    },
    {
       img: "/images/finance/f6.png",
      tag: "finance",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "Delhi Family Loses Rs. 42,000 Despite Quick...",
    },
    {
       img: "/images/finance/f7.png",
      tag: "finance",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "ICAI Releases User Manual Version 1.0 of UDIN Mobile...",
    },
    {
       img: "/images/finance/f8.png",
      tag: "finance",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "YES Bank Share Sale Under Scanner: SEBI Alleges Insider...",
    },
    {
       img: "/images/finance/f9.png",
      tag: "finance",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "Eight including aspiring CA Arrested After Delhi Couple...",
    },
    {
       img: "/images/finance/f1.png",
      tag: "finance",
      author: "Vanshika verma",
      date: "Nov 20, 2025",
      title: "Delhi Family Loses Rs. 42,000 Despite Quick...",
    },
  ];
        const ITEMS_PER_PAGE = itemsPerPage;
        const filtered = active === "All" ? blogs : blogs.filter((b) => b.tag === active);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const visibleblogs = filtered.slice(startIndex, endIndex);
        const pageCount = Math.ceil(filtered.length / itemsPerPage)


        const paginated = useMemo(() => {
          const start = (currentPage - 1) * ITEMS_PER_PAGE
          return filtered.slice(start, start + ITEMS_PER_PAGE)
        }, [filtered, currentPage])





      // use filtered array (so filters + pagination both work)
      const visibleCourses = filtered.slice(startIndex, endIndex);

      const handlePageClick = (page: number) => {
        if (page < 1 || page > pageCount) return;
        setCurrentPage(page);
      };

  return (

    <section className="w-full px-2 md:px-6 text-center">



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10  mx-auto container px-4 ">
        {visibleblogs.map((b) => (
          <div key={b.title} className="rounded-xl shadow-md border bg-white
          overflow-hidden text-left ">
            <div className="relative w-full xl:h-[233px]">
              <img
                src={b.img}
                alt="blog"
                className="w-full h-full object-fit"
              />

              {/* Right Corner Tag */}
              <span className="absolute top-4 left-4 bg-white text-[#252525] text-[14px] font-normal px-2 py-1 rounded-[14px] ">
                {b.tag}
              </span>
            </div>

            <div className="p-4">


              <div className="flex items-center gap-2 text-[16px] text-[#AFAFAF] mb-3">
                <span className="flex gap-1"> <img src="/images/user.svg" alt="" width="20" height="20" /> {b.author}</span>  <span className="flex gap-1 xl:gap-2"><img src="/images/calendar.svg" alt="" width="20" height="10" />{b.date}</span>

              </div>

                      <h3 className="font-medium xl:text-[26px] text-[#252525]
            leading-tight mb-4">
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
            <img src="/images/f-left.svg" alt="" className='ml-1'/>
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
            <img src="/images/f-right.svg" alt="" className='ml-1'/>
        </button>
      </div>


    </section>
  );
}