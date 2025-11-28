import React from 'react'
import Image from "next/image";

const Paymentsection = () => {
 return (
    <div className="min-h-screen  container px-4 mx-auto">
      {/* Breadcrumb */}
      <div className="container  mx-auto px-4 py-3 text-sm text-gray-500 bg-[#DDDDDD]">
        Home › Courses › <span className="text-blue-600">Certification Course On…</span>
      </div>

      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-10 mt-6">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Course Start Time */}
          <p className=" bg-[#F9F9FB] w-[379px] p-2 text-[#454545] font-[400px] font-Outfit font-[16px]">
            <strong>Starts at Thursday November 27, 2025 – 18:00</strong>
          </p>

          {/* Title */}
          <h1 className="text-[30px] font-medium text-gray-900 leading-snug">
            Certification Course On Practical Filing of GSTR-9 & GSTR-9C
          </h1>

          {/* Description */}
          <p className="text-[#929292] text-[16px] leading-relaxed">
            In our continuous endeavour to empower more and more finance professionals,
            this certification course has been designed for you. Detailed 2 Days course
            has been designed where already more than 2 hrs sessions have been organized.
            Recording of the Video is valid for 1 Year. This Course contains Videos along
            with study material and files. Live training on GSTR-9 & GSTR-9C will be given.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <span>English</span>
            <span>• 4 Hours</span>
            <span>• 957 students</span>
            <span>• ⭐ 4.8 by 47 Users</span>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-2 pt-1">
            <span className="font-medium">Share</span>
        
              <div
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 gap-4 ml-[100px] "
              >
                <img src="/images/fb.png" alt="" />
                <img src="/images/in.png" alt="" />
                <img src="/images/x.png" alt="" />
                <img src="/images/pinterest.png" alt="" />
                <img src="/images/print.png" alt="" />
               
              </div>
           
          </div>



          {/* Key Features */}
          <div className="space-y-3 pt-4">
            <h2 className="text-[30px] text-[#252525] font-medium">Course Key Features</h2>

            <ul className="space-y-3 text-[#929292]">
              {[
                "GST Provisions related to GSTR-9 and GSTR-9C filing",
                "GST Annual return, recent changes as per GST notification",
                "GST annual return workflow, table wise changes & comparison",
                "Compulsory and Optional Tables",
                "How to show impact of reversals in GSTR annual return",
                "Linkage between GSTR-1, GSTR-3B, GSTR-9 and GSTR-9C",
                "Practical aspects will be discussed",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#929292]">
                  <Image src="/images/tick.svg" alt="tick" width={22} height={22} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-5">
          {/* Pricing Card */}
          <div className="bg-white shadow rounded p-5 space-y-4">
            <p className="text-center text-[30px]">
              <span className="line-through text-[#929292] font-medium">₹2,000</span>{" "}
              <span className="text-3xl text-black font-bold">₹699</span>
            </p>

            <p className="text-[#929292] text-center">Hurry up, few days left at this price!</p>

           <div>
             
           </div>

        

            <div className="pt-3 space-y-2">
              <p className="font-medium">This course includes:</p>
              <div className="flex items-center gap-2 text-[#696969]">
                <input type="checkbox" checked readOnly />
                Recording is available for 1 year
              </div>
              <div className="flex items-center gap-2 text-[#696969]">
                <input type="checkbox" checked readOnly />
                StudyCafe certificate of completion
              </div>
              <div className="flex items-center gap-2 text-[#696969]">
                <input type="checkbox" checked readOnly />
                Access on laptop or mobile
              </div>
            </div>
          </div>




        </div>
      </div>
    </div>
  );
}

export default Paymentsection
