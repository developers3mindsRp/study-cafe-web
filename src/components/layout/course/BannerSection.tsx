"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function BannerSection() {
    const router = useRouter();

  const handleClick = () => {
    router.push("/membership");
  };
  return (
    <>
          {/* Breadcrumb */}
      <div className="   px-48  py-3 text-sm text-[#696969] bg-[#DDDDDD]">
        Home › Courses › <span className="text-blue-600">Certification Course On…</span>
      </div>
 <div className="bg-[#F5FAFF]">
         <div className="  container px-4 mx-auto ">


        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6 mt-6">
  

  <div className="mt-6 md:flex md:items-start md:gap-8">
    
    
  {/* Left: Banner */}
  <div className="md:w-1/2">
              {/* Course Start Time */}
    <p className="bg-[#DEEBFD] max-w-sm p-4 rounded-[10px] text-[#09339B] text-[16px] font-Outfit font-normal">
      Starts at Thursday November 27, 2025 – 18:00
    </p>
   <h1 className="text-[30px] md:text-[43px] font-semibold text-gray-900 leading-snug mt-6">
      Certification Course On Practical Filing of GSTR-9 & GSTR-9C
    </h1>

    {/* Description */}
    <p className="text-[#929292] text-[17px] leading-[32px] mt-6">
      In our continuous endeavour to empower more and more finance professionals,
      this certification course has been designed for you. Detailed 2 Days course
      has been designed where already more than 2 hrs sessions have been organized.
      Recording of the Video is valid for 1 Year. This Course contains Videos along
      with study material and files. Live training on GSTR-9 & GSTR-9C will be given.
    </p>





        <div className="flex">
        <p className=" text-[30px] mt-4">
          <span className="line-through text-[#929292] font-medium">₹2,000</span>{" "}
          <span className="text-3xl text-black font-bold">₹699</span>
        </p>
        <p className="text-[#252525] mt-4 bg-[#FFF6E5] p-3 rounded-lg ml-4 text-sm font-medium border-dashed border border-[#000000]">
          Hurry up, few days left at this price!
        </p>
        </div>

            <div className="mt-10 flex flex-row md:flex-row justify-center lg:justify-start gap-4 mb-4 ">
            <button
              onClick={handleClick}
              className="py-2 px-28 border-2 border-white rounded-md text-base sm:text-lg font-medium text-white bg-[#09339B] transition"
            >
             Buy Now
            </button>

            <Link href="/courses_list">
              <button className="py-3 px-16 bg-white text-[#09339B] rounded-md flex items-center justify-center gap-2 text-base md:text-[20px] border border-[#09339B] transition font-semibold">
               View Membership
              
              </button>
            </Link>
          </div>

        
            {/* Social Share */}
    <div className="flex items-center gap-4 pt-3">
      <div className="flex gap-2 items-center bg-white text-black p-2 cursor-pointer border border-[#CCCCCC] rounded-[10px]">
        <img src="/images/icon-share.png" alt="Share" />
        <span className="font-medium text-[20px]">Share</span>
      </div>

      <div className="flex gap-3 ">
        <img src="/images/fb.png" alt="Facebook" className="w-8 h-8 cursor-pointer" />
        <img src="/images/in.png" alt="LinkedIn" className="w-8 h-8 cursor-pointer" />
        <img src="/images/x.png" alt="X" className="w-8 h-8 cursor-pointer" />
        <img src="/images/pinterest.png" alt="Pinterest" className="w-8 h-8 cursor-pointer" />
        <img src="/images/print.png" alt="Print" className="w-8 h-8 cursor-pointer" />
      </div>
        
    </div>




  </div>

  {/* Right: Content */}
  <div className="md:w-1/2 mt-6 md:mt-[95px]">
      <div className="rounded overflow-hidden shadow">
      <Image
        src="/images/c1.png"
        alt="Banner"
        width={568}
        height={320}
        className="w-full object-cover"
      />
    </div>

        {/* Stats */}
    <div className="flex flex-wrap justify-between gap-8 items-center  text-[#AFAFAF] mt-3 p-3 text-[13px] font-bold">
      <div className="flex gap-2 items-center bg-white text-black p-3">
        <img src="/images/icon-eng.png" alt="Language" /> <span>English</span>
      </div>
      <div className="flex gap-2 items-center bg-white text-black p-3">
        <img src="/images/icon-clock.png" alt="Duration" /><span>4 Hours</span>
      </div>
      <div className="flex gap-2 items-center bg-white text-black p-3">
        <img src="/images/icon-user.png" alt="Students" /><span>957 students</span>
      </div>
      <div className="flex gap-2 items-center bg-white text-black p-3">
        <img src="/images/Star.png" alt="Rating" /><span>4.8 by 47 Users</span>
      </div>
    </div>


    {/* Title */}
   
  </div>
</div>




        </div>

            <div className="mt-8">
          <h3 className="text-[20px] font-medium">This course includes:</h3>
          <div className="flex flex-wrap gap-4 items-center  text-[#696969]  p-3 text-[13px]">
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
