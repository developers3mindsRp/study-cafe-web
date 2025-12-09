"use client";
import React from "react";
import CountUp from "react-countup";

export default function StatsSection() {
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-8 text-center">

          {/* Active Students */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-transparent md:bg-[#EAF0FF] p-0 md:p-6 rounded-full">
              <img src="/images/s1.svg" alt="Active Students" className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <h3 className="text-[15px] md:text-[40px] font-bold text-[#121B31]">
              <CountUp end={10000} duration={2} separator="," />+
            </h3>
            <p className="text-[#454545] text-[14px] md:text-[16px]">Active Students</p>
          </div>

          {/* Total Courses */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-transparent md:bg-[#EAF0FF] p-0 md:p-6 rounded-full">
              <img src="/images/s2.svg" alt="Total Courses" className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <h3 className="text-[15px] md:text-[40px] font-bold text-[#121B31]">
              <CountUp end={150} duration={2} />+
            </h3>
            <p className="text-[#454545] text-[14px] md:text-[16px]">Total Courses</p>
          </div>

          {/* Certificates Issued */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-transparent md:bg-[#EAF0FF] p-0 md:p-6 rounded-full">
              <img src="/images/s3.svg" alt="Certificates Issued" className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <h3 className="text-[15px] md:text-[40px] font-bold text-[#121B31]">
              <CountUp end={8500} duration={2} separator="," />+
            </h3>
            <p className="text-[#454545] text-[14px] md:text-[16px]">Certificates Issued</p>
          </div>

          {/* Success Rate */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-transparent md:bg-[#EAF0FF] p-0 md:p-6 rounded-full">
              <img src="/images/s4.svg" alt="Success Rate" className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <h3 className="text-[15px] md:text-[40px] font-bold text-[#121B31]">
              <CountUp end={95} duration={2} />%
            </h3>
            <p className="text-[#454545] text-[14px] md:text-[16px]">Success Rate</p>
          </div>

        </div>
      </div>
    </section>
  );
}
