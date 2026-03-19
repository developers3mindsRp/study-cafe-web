"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function BannerSection() {
  const [showBar, setShowBar] = useState(true);



  const router = useRouter();

  const handleClick = () => {
    router.push("/plans");
  };
  return (
    <>

      <div className="bg-[#F5FAFF]">
        <div className="py-2  container px-4 mx-auto ">


          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-6 mt-3 md:mt-6">


            <div className="md:mt-6 md:flex md:items-start md:gap-8">


              {/* Left: Banner */}
              <div className="md:w-1/2">
                {/* Course Start Time */}
                <p className="bg-[#DEEBFD] w-[320px] md:w-[360px] p-2 px-4 md:p-4 rounded-[10px] text-[#09339B] text-[14px] md:text-[16px] font-Outfit font-normal">
                  Starts at Thursday November 27, 2025 – 18:00
                </p>
                <h1 className="text-[20px] md:text-[20px] xl:text-[43px] font-semibold text-gray-900 leading-snug mt-3 md:mt-6">
                  Certification Course On Practical Filing of GSTR-9 & GSTR-9C
                </h1>

                {/* mobile image */}
                <div className="block md:hidden ">
                  <div className=" rounded overflow-hidden shadow mt-4">
                    <Image
                      src="/images/c1.png"
                      alt="Banner"
                      width={568}
                      height={320}
                      className="w-full object-cover"
                    />
                  </div>

                  {/* Stats */}
                  <div
                    className="
                          mt-3 p-3
                          md:flex flex-wrap 
                          gap-3 sm:gap-6
                          justify-center sm:justify-between
                          text-[8px] sm:text-[13px]
                          font-bold hidden
                        "
                  >
                    <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md">
                      <img src="/images/icon-eng.png" alt="Language" className="w-4 h-4" />
                      <span>English</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white text-black md:px-3 py-2 rounded-md">
                      <img src="/images/icon-clock.png" alt="Duration" className="w-4 h-4" />
                      <span>4 Hours</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md">
                      <img src="/images/icon-user.png" alt="Students" className="w-4 h-4" />
                      <span>957 students</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md">
                      <img src="/images/Star.png" alt="Rating" className="w-4 h-4" />
                      <span>4.8 by 47 Users</span>
                    </div>
                  </div>


                </div>

                {/* Description */}
                <p className="text-[#929292] text-[16px] leading-[32px] mt-6">
                  In our continuous endeavour to empower more and more finance professionals,
                  this certification course has been designed for you. Detailed 2 Days course
                  has been designed where already more than 2 hrs sessions have been organized.
                  Recording of the Video is valid for 1 Year. This Course contains Videos along
                  with study material and files. Live training on GSTR-9 & GSTR-9C will be given.
                </p>

                {/* Stats */}
                <div
                  className="
                            mt-3 
                            flex flex-wrap md:hidden
                            gap-1
                            justify-between
                            text-[10px] 
                            font-bold
                          "
                >
                  <div className="flex items-center gap-1 bg-white text-black px-2 py-2 rounded-md whitespace-nowrap">
                    <img src="/images/icon-eng.png" alt="Language" className="w-4 h-3" />
                    <span>English</span>
                  </div>

                  <div className="flex items-center gap-1 bg-white text-black px-2 py-2 rounded-md whitespace-nowrap">
                    <img src="/images/icon-clock.png" alt="Duration" className="w-4 h-3" />
                    <span>4 Hours</span>
                  </div>

                  <div className="flex items-center gap-1 bg-white text-black px-2 py-2 rounded-md whitespace-nowrap">
                    <img src="/images/icon-user.png" alt="Students" className="w-4 h-3" />
                    <span>957 students</span>
                  </div>

                  <div className="flex items-center gap-1 bg-white text-black px-2 py-2 rounded-md whitespace-nowrap justify-center">
                    <img src="/images/Star.png" alt="Rating" className="w-4 h-3 " />
                    <span className="">4.8 by 47 Users</span>
                  </div>
                </div>


                {/* Social Share */}
                <div className="md:hidden flex  items-center gap-4 pt-3">
                  <div className="flex  gap-2 items-center bg-white text-black p-2 cursor-pointer border border-[#CCCCCC] rounded-[10px]">
                    <img src="/images/icon-share.png" alt="Share" />
                    <span className="font-medium text-[20px]">Share</span>
                  </div>

                  <div className="flex gap-3 ">
                    <img src="/images/facebook.svg" alt="Facebook" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/linkedin.svg" alt="LinkedIn" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/twitter.svg" alt="X" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/pinterest.svg" alt="Pinterest" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/print.svg" alt="Print" className="w-8 h-8 cursor-pointer" />
                  </div>

                </div>




                
                {/* 🔼 Floating Arrow (ALWAYS visible when bar is hidden) */}
                {!showBar && (
                  <div
                    onClick={() => setShowBar(true)}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 cursor-pointer md:hidden"
                  >
                    <div className="bg-white shadow-md px-4 py-2 rounded-full flex items-center gap-2">
                      <span className="text-sm font-medium">Show</span>
                    
                    </div>
                  </div>
                )}

                {/* 🔽 Bottom Sticky Bar */}
                <div
                  className={`
          fixed bottom-0 left-0 w-full z-40
          transition-transform duration-300
          ${showBar ? "translate-y-0" : "translate-y-full"}
          
          bg-white md:bg-transparent px-4 py-2 md:py-6 
          shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
          sm:static sm:shadow-none sm:p-0 rounded-t-[20px]
        `}
                >
                  {/* 🔽 Arrow inside (for closing) */}
                  <div
                    onClick={() => setShowBar(false)}
                    className="flex justify-center mb-2 cursor-pointer md:hidden"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
         
                    </div>
                  </div>


                  {/* Content */}
                  <div className="mt-0 md:mt-4 flex flex-col sm:flex-row md:items-start items-center gap-3">
                    <p className="text-[30px] md:text-[26px] xl:text-[30px]">
                      <span className="line-through text-[#929292] font-medium mr-2">
                        ₹2,000
                      </span>
                      <span className="text-black font-bold text-[30px] xl:text-[40px]">
                        ₹699
                      </span>
                    </p>

                    <p className="hidden md:block text-[#252525] bg-[#FFF6E5] px-4 py-2 rounded-lg text-sm font-medium border border-dashed border-black mt-1 md:mt-3">
                      Hurry up, few days left at this price!
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-3 md:mt-4 mb-2 flex flex-row justify-center lg:justify-start gap-4">

                    <Link href="/payment" className="flex-1">
                      <button
                        onClick={handleClick}
                        className="w-full py-2 px-6
      border-2 border-white rounded-[10px]
      text-base xl:text-lg font-medium text-white
      bg-[#09339B] transition"
                      >
                        Buy Now
                      </button>
                    </Link>

                    <Link href="/plans" className="flex-1">
                      <button
                        className="w-full py-2 px-6
      bg-white text-[#09339B]
      rounded-[10px] flex items-center justify-center gap-2
      text-base xl:text-[20px]
      border border-[#09339B]
      transition font-semibold"
                      >
                        View Membership
                      </button>
                    </Link>

                  </div>

                </div>




                {/* Social Share */}
                <div className="hidden md:flex items-center gap-4 pt-3">
                  <div className="flex gap-2 items-center bg-white text-black p-2 cursor-pointer border border-[#CCCCCC] rounded-[10px]">
                    <img src="/images/icon-share.png" alt="Share" />
                    <span className="font-medium text-[20px]">Share</span>
                  </div>

                  <div className="flex gap-3 ">
                    <img src="/images/facebook.svg" alt="Facebook" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/linkedin.svg" alt="LinkedIn" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/twitter.svg" alt="X" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/pinterest.svg" alt="Pinterest" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/print.svg" alt="Print" className="w-8 h-8 cursor-pointer" />
                  </div>

                </div>




              </div>

              {/* Right: Content */}
              <div className="md:w-1/2 mt-6 md:mt-[95px]">
                <div className="hidden md:block rounded overflow-hidden shadow">
                  <Image
                    src="/images/c1.png"
                    alt="Banner"
                    width={568}
                    height={320}
                    className="w-full object-cover"
                  />
                </div>

                {/* Stats */}
                <div
                  className="
                    mt-3 p-3
                    hidden md:flex 
                    gap-3 sm:gap-6
                    justify-center sm:justify-between
                    text-[9px] xl:text-[13px]
                    font-bold 
                  "
                >
                  <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md">
                    <img src="/images/icon-eng.png" alt="Language" className="w-4 h-4" />
                    <span>English</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white text-black md:px-3 py-2 rounded-md">
                    <img src="/images/icon-clock.png" alt="Duration" className="w-4 h-4" />
                    <span>4 Hours</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md">
                    <img src="/images/icon-user.png" alt="Students" className="w-4 h-4" />
                    <span>957 students</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md">
                    <img src="/images/Star.png" alt="Rating" className="w-4 h-4" />
                    <span>4.8 by 47 Users</span>
                  </div>
                </div>



                {/* Title */}

              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-[14px] md:text-[20px] font-medium">This course includes:</h3>
            <div className="flex flex-wrap gap-4 items-center  text-[#696969]  p-3 text-[12px] md:text-[16px]">
              <div className="flex gap-2 items-center bg-white  p-3">
                <img src="/images/icon-video.png" alt="Language" /> <span>Recording is available for 1 year</span>
              </div>
              <div className="flex gap-2 items-center bg-white  p-3">
                <img src="/images/icon-certiificate.png" alt="Duration" /><span>Studycafe certificate of completion</span>
              </div>
              <div className="flex gap-2 items-center bg-white  p-3">
                <img src="/images/icon-laptop.png" alt="Students" /><span>Access on mobile or computer/laptop </span>
              </div>

            </div>
          </div>




        </div>
      </div>
    </>
  );
}
