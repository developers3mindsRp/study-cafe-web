"use client";
import React from "react";
import CountUp from "react-countup";

export default function StatsSection() {
  return (
    <section className="bg-white py-10 md:py-16 px-4 ">
      <div className="container mx-auto px-4 bg-[#09339B] rounded-[10px] md:rounded-full p-6 ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-2">

          {/* Active Students */}
          <div className="flex  flex-col md:flex-row  items-center gap-3">
            <div className=" bg-[#FFFFFF] p-2 xl:p-6 rounded-full">
              <img src="/images/icons/s1.svg" alt="Active Students" className="w-12 h-12 md:w-6 md:h-6 xl:w-16 xl:h-16" />
            </div>
            <div className=" md:flex flex-col">
              <h3 className="text-[15px] xl:text-[40px] font-bold text-[#FFFFFF]">
                <CountUp end={10000} duration={2} separator="," />+
              </h3>
              <p className="text-[#FFFFFF] text-[14px] md:text-[16px] text-left">Active Students</p>
            </div>
          </div>

          {/* Total Courses */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className=" bg-[#FFFFFF] p-2 xl:p-6 rounded-full">
              <img src="/images/icons/s2.svg" alt="Total Courses" className="w-12 h-12 md:w-6 md:h-6 xl:w-16 xl:h-16" />
            </div>
            <div className=" md:flex flex-col">
              <h3 className="text-[15px] xl:text-[40px] font-bold text-[#FFFFFF]">
                <CountUp end={150} duration={2} />+
              </h3>
              <p className="text-[#FFFFFF] text-[14px] md:text-[16px]">Total Courses</p>
            </div>
          </div>

          {/* Certificates Issued */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className=" bg-[#FFFFFF] p-2 xl:p-6 rounded-full">
              <img src="/images/icons/s3.svg" alt="Certificates Issued" className="w-12 h-12 md:w-6 md:h-6 xl:w-16 xl:h-16" />
            </div>
            <div className=" md:flex flex-col">
              <h3 className="text-[15px] xl:text-[40px] font-bold text-[#FFFFFF]">
                <CountUp end={8500} duration={2} separator="," />+
              </h3>
              <p className="text-[#FFFFFF] text-[14px] md:text-[16px]">Certificates Issued</p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className=" bg-[#FFFFFF] p-2 xl:p-6 rounded-full">
              <img src="/images/icons/s4.svg" alt="Success Rate" className="w-12 h-12 md:w-6 md:h-6 xl:w-16 xl:h-16" />
            </div>
            <div className=" md:flex flex-col">
              <h3 className="text-[15px] xl:text-[40px] font-bold text-[#FFFFFF]">
                <CountUp end={95} duration={2} />%
              </h3>
              <p className="text-[#FFFFFF] text-[14px] md:text-[16px]">Success Rate</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
