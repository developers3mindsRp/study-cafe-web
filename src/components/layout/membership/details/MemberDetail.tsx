import React from 'react'
import Image from 'next/image';

const MemberDetail = () => {
 return (
    <div className="h-[700px]  container px-4 mx-auto">
      {/* Breadcrumb */}
      <div className="container  mx-auto px-4 py-3 text-sm text-gray-500 bg-[#DDDDDD]">
        Home › Courses › <span className="text-blue-600">Certification Course On…</span>
      </div>

  

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6 mt-12">

          {/* Course Start Time */}
          <p className=" bg-[#F9F9FB] w-[80px] p-2 text-[#454545] font-normal font-Outfit font-[16px] mt-4">
            <strong>Lifetime</strong>
          </p>

          {/* Title */}
          <h1 className="text-[30px] font-medium text-gray-900 leading-snug">
            Premium
          </h1>

          {/* Description */}
          <p className="text-[#929292] text-[16px] leading-relaxed">
      In our continuous endeavour to empower more and more finance professionals, this certification course has been designed for you. Detailed 2 Days course has been designed where daily more than 2 hrs sessions have been organized. Recording of the Video is Valid for 1 Year. This Course contains Videos along with study material and files. Live training of GSTR-9 & GSTR-9C will be given.
          </p>




          {/* Key Features */}
          <div className="space-y-3 pt-4">
            {/* <h2 className="text-[30px] text-[#252525] font-medium">Course Key Features</h2> */}

            <ul className="space-y-3 text-[#929292]">
              {[
                "GST Provisions related to GSTR-9 and GSTR-9C filing",
                "GST Annual return, recent changes as per GST notification",
                "GST annual return workflow, table wise changes & comparison",
                "Compulsory and Optional Tables",
                "How to show impact of reversals in GSTR annual return",
             
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#929292]">
                  <Image src="/images/tick.svg" alt="tick" width={22} height={22} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>


 
    </div>
  );
}

export default MemberDetail
