"use client";

import Image from "next/image";

export default function BannerSection_digital() {
    return (
        <div className="">

            {/* Top Ribbon */}
            <div className="bg-red-600 text-center text-sm py-2 whitespace-nowrap overflow-hidden">
                <p className="animate-marquee">
                    Join now for just Rs.99 Only &nbsp; | &nbsp; Join now for just Rs.99 Only &nbsp; | &nbsp;
                    Join now for just Rs.99 Only | &nbsp; Join now for just Rs.99 Only &nbsp; | &nbsp; Join now for just Rs.99 Only &nbsp; 
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-10 text-center">

                {/* Heading */}
                <h1 className="text-[20px] md:text-[40px] font-medium leading-snug">
                    HOW TO <span className="text-yellow-400">AUTOMATE CA PRACTICE</span> WITH AI <br className="hidden md:block" />
                    TOOLS TO <span className="text-yellow-400">WORK 10X FASTER</span> & GROW YOUR <br className="hidden md:block" />
                    PRACTICE UP TO 10X, <span className="text-yellow-400">GUARANTEED !!</span>
                </h1>

                <p className="text-[16px] text-white mt-4">
                    (No Need of Any Prior AI, Coding or MS Office Knowledge)
                </p>

                {/* Card Section */}
                <div className="mt-8 rounded-xl md:px-24">

                    <div className="relative rounded-lg overflow-hidden">

                        {/* Background Image */}
                        <Image
                            src="/images/c1.png" 
                            alt="Course"
                            width={800}
                            height={400}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                            <button className="bg-black w-16 h-16 flex items-center justify-center rounded-full">
                                <span className="text-white text-[30px]">▶</span>
                            </button>
                        </div>

       
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="mt-6">
                    <p className="font-medium text-[18px]">Register Before Tonight to</p>

                    <button className="mt-2 bg-[#FF383C] px-4 py-2 rounded-md text-sm font-semibold">
                        Unblock Bonuses Worth Rs. 12,000
                    </button>

                    <p className="mt-4 text-[16px] text-white">
                        Masterclass is Starting on
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-3  px-4 md:px-12">

                        <div className="bg-[#292738] text-[#FFCC00] px-3 py-2 rounded-md text-[13px] border  flex gap-2 items-center justify-center w-fit ">
                            <img src="/images/y-calendar.svg" alt="" className="w-4 h-4" />
                            Jan 11, 2026 Sunday
                        </div>

                        <div className="bg-[#292738] text-[#FFCC00] px-8 py-2 rounded-md text-[13px] border   flex gap-2 items-center justify-center w-fit ">
                            <img src="/images/y-clock.svg" alt="" className="w-4 h-4" />
                            11 AM to 2 PM
                        </div>

                    </div>



                </div>

            </div>


        </div>
    );
}
