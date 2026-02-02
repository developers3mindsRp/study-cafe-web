"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HeroSection = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/membership");
  };

  return (
    <section
      className="relative bg-[url('/images/home/home-banner.png')] bg-cover bg-center bg-no-repeat md:h-[800px]"
    >
      <div className="container mx-auto px-4  md:py-24 lg:py-24 flex flex-col lg:flex-row items-center">

        {/* TEXT CONTENT */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mt-8 md:mt-0 ">
          <p className="bg-white/10 backdrop-blur-lg inline-block px-3 py-2 rounded-lg mb-6 text-sm md:text-lg text-white border border-[#a5aab8]">
            Welcome to StudyCafe Learning Platform
          </p>

          <h1 className="text-[30px] sm:text-3xl md:text-[40px] lg:text-6xl font-semibold text-white leading-tight md:mb-10">
            Master Your Skills with  Professional Courses
          </h1>

          <p className="mt-4 text-[16px] md:text-[24px] text-white max-w-2xl mx-auto lg:mx-0 font-normal px-6 md:px-0">
            Learn from industry experts, get certified, and boost your <br className="hidden" />
            career with our comprehensive online courses
          </p>

          <div className="mt-6 md:mt-10 flex flex-row md:flex-row justify-center lg:justify-start gap-4 px-2 md:px-0 ">
            <button
              onClick={handleClick}
              className="py-2 px-3 border-2 border-white rounded-[10px] text-[14px] md:text-[20px] font-medium text-white hover:bg-white/20 transition"
            >
              View Memberships
            </button>

            <Link href="/courses_list">
              <button className="py-3 px-3 bg-white text-[#09339B] rounded-[10px] flex items-center justify-center gap-2 text-base md:text-[20px] hover:bg-gray-100 transition font-semibold">
                Browse Courses
                <img
                  src="/images/icons/blue_arrow.png"
                  alt="→"
                  className="w-5 h-auto"
                />
              </button>
            </Link>
          </div>
        </div>

        {/* IMAGE */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center lg:justify-end mb-4 md:mb-0 ">
          <img
            src="/images/home/home.png"
            alt="Learning illustration"
            className="px-4 md:w-full  object-contain "
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
