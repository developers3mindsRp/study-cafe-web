import React from 'react'
import Image from "next/image";

const Paymentsection = () => {
 return (
  <div className="md:min-h-screen container px-4 mx-auto">

  {/* LEFT CONTENT */}
  <div className="lg:col-span-2 space-y-6">

    {/* Course Start Time */}
    <p className="bg-[#F9F9FB] w-[340px] sm:max-w-[379px] p-2 text-[#454545] text-[15px] px-4">
      Starts at Thursday November 27, 2025 – 18:00
    </p>

    {/* CARD */}
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch">

      {/* Image */}
      <div className="w-full sm:w-[300px] h-[200px] sm:h-auto flex-shrink-0">
        <img
          src="/images/home/f6.png"
          alt=""
          className="w-full h-full object-fit rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="min-w-0">
        <h1 className="text-[18px] sm:text-[20px] font-medium text-gray-900 leading-snug mb-4">
          Certification Course On Practical Filing of GSTR-9 & GSTR-9C
        </h1>

        <p className="text-[#929292] text-[15px] sm:text-[16px] leading-relaxed mb-4 line-clamp-3">
          In our continuous endeavour to empower more and more finance professionals,
          this certification course has been designed for you.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#AFAFAF] text-sm">
          <div className="flex items-center gap-1">
            <img src="/images/eng-light.png" className="w-4 h-4" />
            English
          </div>
          <div className="flex items-center gap-1">
            <img src="/images/clock-light.png" className="w-4 h-4" />
            4 Hours
          </div>
          <div className="flex items-center gap-1">
            <img src="/images/user-light.png" className="w-4 h-4" />
            957 students
          </div>
          <div className="flex items-center gap-1">
            <img src="/images/Star.png" className="w-4 h-4" />
            4.8 by 47 Users
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default Paymentsection
