"use client";
import { FaUsers, FaBookOpen, FaMedal, FaChartLine } from "react-icons/fa";

export default function StatsSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between gap-10 text-center">

          {/* Active Students */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-[#EAF0FF] p-6 rounded-full">
              <FaUsers className="text-[#0A2BA5] text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#121B31]">10,000+</h3>
            <p className="text-[#6A7181] text-sm">Active Students</p>
          </div>

 

          {/* Total Courses */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-[#EAF0FF] p-6 rounded-full">
              <FaBookOpen className="text-[#0A2BA5] text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#121B31]">150+</h3>
            <p className="text-[#6A7181] text-sm">Total Courses</p>
          </div>

   

          {/* Certificates issued */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-[#EAF0FF] p-6 rounded-full">
              <FaMedal className="text-[#0A2BA5] text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#121B31]">8,500+</h3>
            <p className="text-[#6A7181] text-sm">Certificates Issued</p>
          </div>


          {/* Success Rate */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-[#EAF0FF] p-6 rounded-full">
              <FaChartLine className="text-[#0A2BA5] text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#121B31]">95%</h3>
            <p className="text-[#6A7181] text-sm">Success Rate</p>
          </div>

        </div>
      </div>
    </section>
  );
}
