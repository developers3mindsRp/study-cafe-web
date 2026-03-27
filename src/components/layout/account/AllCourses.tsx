import CourseCard from "../../CourseCard";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState, useMemo, useEffect } from "react";

export default function MembershipCourses() {
    const [itemsPerPage, setItemsPerPage] = useState(9);

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(3);
            } else {
                setItemsPerPage(9);
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => {
            window.removeEventListener("resize", updateItemsPerPage);
        };
    }, []);

    const categories = [
        "All",
        "Finance",
        "Income Tax",
        "GST",
        "CA",
        "Company Laws",
        "Education",
        "Mutual Funds",
        "Insurance",
        "Share Market",
    ];

    const [active, setActive] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

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
            img: "/images/home/f4.jpg",
            hours: "3+ Hours",
            lang: "English",
            students: "820",
            oldPrice: "₹ 1,499",
            newPrice: "₹ 499",
            rating: "4.8",
        },
        {
            id: 6,
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
            id: 7,
            title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
            img: "/images/home/f4.jpg",
            hours: "3+ Hours",
            lang: "English",
            students: "820",
            oldPrice: "₹ 1,499",
            newPrice: "₹ 499",
            rating: "4.8",
        },
    ];

    // ✅ FIXED LOGIC
    const filtered = active === "All" ? courses : courses.filter((c) => c);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const visibleCourses = filtered.slice(startIndex, endIndex);

    const pageCount = Math.ceil(filtered.length / itemsPerPage);

    const handlePageClick = (page: number) => {

        if (page < 1 || page > pageCount) return;
        setCurrentPage(page);
    };

    // Reset page when itemsPerPage or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage, active]);

    return (
        <section className="md:p-6 container mx-auto bg-white rounded-lg shadow-sm px-4 p-4">
            <h2 className="text-[26px] font-normal text-gray-800 mb-1">
                All Courses
            </h2>
            <p className="text-gray-500 text-[16px] mb-6">
                Continue your learning Journey
            </p>

            {/* Grid */}
            <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-8">
                {visibleCourses.map((c) => (
                    <div
                        key={c.id}
                        className="bg-white shadow-md rounded-md overflow-hidden flex flex-col"
                    >
                        <div className="relative w-full h-[180px] md:h-[180px] xl:h-[220px]">
                            <Image src={c.img} alt={c.title} fill className="object-fit" />
                            <span className="absolute flex gap-1 top-2 right-3 bg-white px-2 rounded-full text-[18px] font-normal shadow mt-4">
                                <img
                                    src="/images/icons/star.svg"
                                    alt=""
                                    className="w-4 h-4 mt-1"
                                />
                                {c.rating}
                            </span>
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                            <div className="flex flex-wrap items-center gap-4 text-[#AFAFAF] text-sm">
                                <span className="flex items-center gap-1">
                                    <img
                                        src="/images/icons/clock-light.svg"
                                        alt=""
                                        width="20"
                                        height="20"
                                    />
                                    {c.hours}
                                </span>
                                <span className="flex items-center gap-1">
                                    <img
                                        src="/images/icons/eng-light.svg"
                                        alt=""
                                        width="20"
                                        height="20"
                                    />
                                    {c.lang}
                                </span>
                            </div>

                            <h3 className="text-[18px] xl:text-[22px] font-normal text-[#252525] mt-2 mb-2 line-clamp-2">
                                {c.title}
                            </h3>

                            <div className="flex items-center gap-1 text-[#AFAFAF] text-sm">
                                <img
                                    src="/images/icons/user-light.svg"
                                    alt=""
                                    width="20"
                                    height="20"
                                />
                                {c.students} students
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <button
                                    className="bg-white border border-[#09339B] text-[#09339B] px-4 py-1 md:py-2 rounded-md text-sm md:text-base font-medium hover:bg-[#09339B] hover:text-white transition-colors duration-300"
                                    onClick={() => (window.location.href = "/course/1")}
                                >
                                    Start Learning
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-10 gap-2 mb-6">
                {/* Left */}
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 border ${currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed rounded-full"
                            : "bg-white hover:bg-gray-100 rounded-full"
                        }`}
                >
                    <img src="/images/f-left.svg" alt="" className="ml-1" />
                </button>

                {/* Numbers */}
                {Array.from({ length: pageCount }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageClick(i + 1)}
                        className={`w-9 h-9 border text-sm ${currentPage === i + 1
                                ? "bg-[#09339B] text-white rounded-full"
                                : "bg-white hover:bg-gray-100 rounded-full"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                {/* Right */}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === pageCount}
                    className={`w-9 h-9 border ${currentPage === pageCount
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed rounded-full"
                            : "bg-white hover:bg-gray-100 rounded-full"
                        }`}
                >
                    <img src="/images/f-right.svg" alt="" className="ml-1" />
                </button>
            </div>
        </section>
    );
}
