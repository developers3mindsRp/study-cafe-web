"use client";
import { useState } from "react";

import Image from "next/image";

type BlogHighlightCardProps = {
  title: string;
  description: string;
  subDescription?: string;
  readMoreLink?: string;
};

export default function BlogHighlightCard({
  title,
  description,
  subDescription,
}: BlogHighlightCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className=" container px-4 mx-auto">

      {/* LEFT CONTENT */}
      <div className="lg:col-span-2 space-y-6 ">

        <div className="space-y-4 border border-[#AFAFAF] shadow-md rounded-[10px] px-4 py-4 md:mt-12">
          <h2 className="text-[15px] md:text-[20px] font-bold text-[#252525]">{title}</h2>

          <p className="text-[#6C6C6C] md:text-[17px] leading-[32px] font-light">
            {description}
          </p>

          {subDescription && (
            <p className="text-[#6C6C6C] md:text-[17px] leading-[32px] font-light">
              {subDescription}
            </p>
          )}

          {/* Read more */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setIsOpen(true)}
              className="w-full sm:w-auto  border border-[#09339B] px-6 sm:px-32 py-2 rounded-[10px] text-[#09339B] font-medium hover:bg-[#09339B] hover:text-white transition"
            >
              Read More
            </button>
          </div>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

              {/* Modal Box */}
              <div className="bg-white md:max-w-xl w-full rounded-lg p-12 relative shadow-lg">

                {/* Close Button
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
      >
        ✕
      </button> */}


                <div className="flex  items-center justify-center gap-2 mb-2">
                  <img src="/images/lock1.png" alt="Premium Content" className="w-6 h-6" />
                  <h4 className="text-[#929292] text-center text-sm font-medium">
                    Premium Content
                  </h4>
                </div>


                <h2 className="text-[40px] font-semibold text-[#252525] mb-4 text-center">
                  Unlock The Full Article
                </h2>

                <p className="text-[#929292] leading-7 text-center text-[16px]">
                  This article is available exclusively for <strong className="text-black">Premium Members</strong>.
                </p>

                <div className="flex flex-col mx-auto md:px-32 gap-4 mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-[#09339B] text-white px-6 py-2 rounded-md"
                  >
                    Upgrade to Premium
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[#09339B] border border-[#09339B] bg-white px-6 py-2 rounded-md"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* Social buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center pt-2 gap-4">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#34C759] px-6  2xl:px-12
 py-2 rounded-[10px] text-[#34C759] font-medium hover:bg-[#34C759] hover:text-white transition">
              <img src="/images/whatsapp.png" alt="" className="w-4 h-4" />
              <span>Join WhatsApp Group</span>
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#039BE5] px-6  2xl:px-12
 py-2 rounded-[10px] text-[#039BE5] font-medium hover:bg-[#039BE5] hover:text-white transition">
              <img src="/images/telegram-round.png" alt="" className="w-4 h-4" />
              <span>Join Telegram Group</span>
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#252525] px-6  2xl:px-12
 py-2 rounded-[10px] text-[#252525] font-medium hover:bg-[#252525] hover:text-white transition">
              <img src="/images/google.png" alt="" className="w-4 h-4" />
              <span>Follow On Google News</span>
            </button>
          </div>
        </div>

      </div>



      <div className="flex items-center gap-4 my-6">
        <span className="flex-1 h-px bg-[#000000]" />
        <span className="text-[#09339B] text-[20px] font-medium whitespace-nowrap">
          Up Next
        </span>
        <span className="flex-1 h-px bg-[#000000]" />
      </div>




    </div>


  );
}
