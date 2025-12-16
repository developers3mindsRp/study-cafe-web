import Image from "next/image";
import React from "react";

export default function Sidebar() {
  return (
    <div className="sticky top-20 space-y-6">
      <div className=" p-6 h-fit"> <div> <h3 className="text-[30px] md:text-[40px] font-semibold">My Account</h3>
       <p className="text-[18px] md:text-[24px] text-[#454545]">Manage your profile, subscription, and learning progress</p> </div> </div>
{/* PROFILE BOX */}
<div className="flex flex-col items-center text-center mt-6 p-5 border rounded-lg bg-white shadow-sm ">

  {/* Mobile: Image left + content right */}
  <div className="flex w-full gap-4 items-center md:flex-col md:text-center">
    
    {/* Profile Image */}
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0">
      <Image
        src="/images/profile.png"
        alt="Profile"
        width={120}
        height={120}
        className="object-cover w-full h-full"
      />
    </div>

    {/* Right Content */}
    <div className="text-left md:text-center flex-1">
      <h2 className="text-[22px] md:text-[26px] font-semibold">Shubham</h2>
      <p className="text-gray-500 text-[14px] md:text-[16px] mt-1">
        Member since January 2025
      </p>

      <div className="mt-3 space-y-2  ">
        <div className="flex gap-2 items-start">
          <img src="/images/mail.png" alt="" className="mt-1" />
          <p className="text-gray-500 break-all text-sm">
            Shubham87548@gmail.com
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <img src="/images/phone.png" alt="" />
          <p className="text-gray-500 text-sm">+91 9584784584</p>
        </div>
      </div>
    </div>
  </div>

  {/* Buttons */}
  <div className="w-full mt-6 flex gap-3 md:flex-col">
    <button className="bg-[#09339B] text-white px-4 py-2 rounded-md w-1/2 md:w-full">
      Save Profile
    </button>
    <button className="border border-[#09339B] text-[#09339B] px-4 py-2 rounded-md w-1/2 md:w-full">
      Logout
    </button>
  </div>

</div>


      {/* SUBSCRIPTION BOX */}
      <div className="p-5 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Subscription Status</h3>
        <p className="text-2xl text-[#09339B]">₹7,999</p>
        <p className="text-sm text-gray-600">Premium Membership</p>

        <div className="mt-3 text-sm text-gray-500 ">
          <p className="text-left">
            Days Remaining: <span className="font-semibold ml-32 md:ml-56">26 Days</span>
          </p>

          <div className="w-full bg-gray-200 h-4 rounded-full mt-3 overflow-hidden">
            {/* If you want dynamic progress, pass it as prop later */}
            <div className="h-full bg-[#09339B]" style={{ width: `30%` }}></div>
          </div>

          <p className="mt-1">
            01 Jan 2024 <span className="font-semibold ml-32 md:ml-56">31 Dec 2024</span>
          </p>
        </div>

        <button className="mt-4 w-full border bg-[#F9F9FB] text-[#454545] py-2 rounded-md">
          Renew Now
        </button>
        <button className="mt-2 w-full border bg-[#F9F9FB] text-[#454545] py-2 rounded-md">
          Change Plan
        </button>
        <button className="mt-2 w-full border bg-[#F9F9FB] text-[#454545] py-2 rounded-md">
          Download Invoice
        </button>
      </div>
    </div>
  );
}
