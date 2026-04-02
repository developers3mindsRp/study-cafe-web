"use client";
import React from "react";
import CountUp from "react-countup";

export default function Stats_marketing() {
  return (
    <section className=" py-4 md:py-4 px-4 md:w-[850px] mx-auto">
      <div className="container mx-auto px-4 bg-[#09339B] rounded-full md:rounded-full p-6 ">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 text-center px-2">

          {/* Active Students */}

 
            <div className=" md:flex flex-col">
              <h3 className="text-[18px] xl:text-[40px] font-bold text-[#FFFFFF]">
                <CountUp end={10000} duration={2} separator="," />+
              </h3>
                          <p className="text-[#FFFFFF] text-[12px] md:text-[16px]">People Coached</p>
            </div>
    

          {/* Total Courses */}
  
    
            <div className=" md:flex flex-col">
              <h3 className="text-[18px] xl:text-[40px] font-bold text-[#FFFFFF]">
                <CountUp end={150} duration={2} />+
              </h3>
                          <p className="text-[#FFFFFF] text-[12px] md:text-[16px] ">Prefered By AI Experts</p>
            </div>
 

          {/* Certificates Issued */}

    
            <div className=" md:flex flex-col">
              <h3 className="text-[18px] xl:text-[40px] font-bold text-[#FFFFFF]">
                <CountUp end={8500} duration={2} separator="," />+
              </h3>
                          <p className="text-[#FFFFFF] text-[12px] md:text-[16px]">Attended</p>
            </div>
  



        </div>
          </div>
          
          <div className="mx-auto mt-12 md:ml-12">
              {/* Heading */}
              <h1 className="text-2xl md:text-[40px] font-medium leading-snug  px-12 md:px-2 text-center mb-8">
                  <span className="text-yellow-400">REGISTER </span> BEFORE TODAY'S MIDNIGHT 
                 
              </h1>
          </div>
    </section>
  );
}
