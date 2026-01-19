import Image from "next/image";
import SidebarCourseCard from "./Sidebar";

export default function BannerSection() {
  return (
    <div className="  container px-4 mx-auto">
      {/* Breadcrumb */}
      <div className="container  mx-auto px-4 py-3 text-sm text-gray-500 bg-[#DDDDDD]">
        Home › Courses › <span className="text-blue-600">Certification Course On…</span>
      </div>

    

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6 mt-6">
              {/* Course Start Time */}
    <p className="bg-[#F9F9FB] p-2 text-[#454545] text-[16px] font-Outfit font-normal">
      Starts at Thursday November 27, 2025 – 18:00
    </p>

  <div className="mt-6 md:flex md:items-start md:gap-8">
    
  {/* Left: Banner */}
  <div className="md:w-1/2">
    <div className="rounded overflow-hidden shadow">
      <Image
        src="/images/c1.png"
        alt="Banner"
        width={1200}
        height={600}
        className="w-full object-cover"
      />
    </div>

        {/* Stats */}
    <div className="flex flex-wrap justify-around items-center gap-8 text-[#AFAFAF] mt-3 bg-[#F9F9FB] p-3">
      <div className="flex gap-2 items-center">
        <img src="/images/icon-eng.png" alt="Language" /> <span>English</span>
      </div>
      <div className="flex gap-2 items-center">
        <img src="/images/icon-clock.png" alt="Duration" /><span>4 Hours</span>
      </div>
      <div className="flex gap-2 items-center">
        <img src="/images/icon-user.png" alt="Students" /><span>957 students</span>
      </div>
      <div className="flex gap-2 items-center">
        <img src="/images/Star.png" alt="Rating" /><span>4.8 by 47 Users</span>
      </div>
    </div>
  </div>

  {/* Right: Content */}
  <div className="md:w-1/2 mt-6 md:mt-0">


    {/* Title */}
    <h1 className="text-[30px] md:text-[30px] font-medium text-gray-900 leading-snug mt-2">
      Certification Course On Practical Filing of GSTR-9 & GSTR-9C
    </h1>

    {/* Description */}
    <p className="text-[#929292] text-[16px] leading-relaxed mt-2">
      In our continuous endeavour to empower more and more finance professionals,
      this certification course has been designed for you. Detailed 2 Days course
      has been designed where already more than 2 hrs sessions have been organized.
      Recording of the Video is valid for 1 Year. This Course contains Videos along
      with study material and files. Live training on GSTR-9 & GSTR-9C will be given.
    </p>



    {/* Social Share */}
    <div className="flex items-center gap-4 pt-3">
      <div className="flex gap-2 items-center">
        <img src="/images/icon-share.png" alt="Share" />
        <span className="font-medium">Share</span>
      </div>

      <div className="flex gap-3 ">
        <img src="/images/fb.png" alt="Facebook" className="w-6 h-6 cursor-pointer" />
        <img src="/images/in.png" alt="LinkedIn" className="w-6 h-6 cursor-pointer" />
        <img src="/images/x.png" alt="X" className="w-6 h-6 cursor-pointer" />
        <img src="/images/pinterest.png" alt="Pinterest" className="w-6 h-6 cursor-pointer" />
        <img src="/images/print.png" alt="Print" className="w-6 h-6 cursor-pointer" />
      </div>

 
        
    </div>

        <div className="bg-white">
        <p className=" text-[30px] mt-4">
          <span className="line-through text-[#929292] font-medium">₹2,000</span>{" "}
          <span className="text-3xl text-black font-bold">₹699</span>
        </p>
        <p className="text-[#929292]">
          Hurry up, few days left at this price!
        </p>
        </div>

  </div>
</div>


  {/* Key Features */}
<div className=" bg-[#F9F9FB] p-8">
  <h2 className="text-[20px] md:text-[30px] text-[#252525] font-medium ">
    Course Key Features
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#929292] pt-4 ">
    {/* Left Column (first 4) */}
    <ul className="space-y-6">
      {[
        "GST Provisions related to GSTR-9 and GSTR-9C filing",
        "GST Annual return, recent changes as per GST notification",
        "GST annual return workflow, table wise changes & comparison",
        "Compulsory and Optional Tables",
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <Image src="/images/tick.svg" alt="tick" width={22} height={22} />
          <span>{item}</span>
        </li>
      ))}
    </ul>

    {/* Right Column (remaining 3) */}
    <ul className="space-y-6">
      {[
        "How to show impact of reversals in GSTR annual return",
        "Linkage between GSTR-1, GSTR-3B, GSTR-9 and GSTR-9C",
        "Practical aspects will be discussed",
      ].map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <Image src="/images/tick.svg" alt="tick" width={22} height={22} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
</div>

        </div>

   

      
    </div>
  );
}
