import React from "react";
import Link from "next/link";

const Timer_marketing = () => {
    return (
        <section
            className=""
        >


            {/* Center Content */}
            <div className="relative z-10 text-center ">
                <h2 className="text-white text-[20px] xl:text-[40px] font-semibold mb-2 px-12 uppercase ">
                    Time is running out. Reserve your seat <span className="text-[#E6B800]">now!</span>
                </h2>

                <div className="flex justify-center gap-4 mt-4">

                    <div className="bg-[#FFCC00] text-black font-bold 
                  w-20 h-20 md:w-18 md:h-24 
                  flex flex-col items-center justify-center 
                  rounded-lg">
                        <span className="text-[20px] md:text-[40px] leading-none mb-2">15</span>
                        <span className="text-[12px] md:text-[18px] uppercase">Min</span>
                    </div>

                    <div className="bg-[#FFCC00] text-black font-bold 
                  w-20 h-20 md:w-18 md:h-24 
                  flex flex-col items-center justify-center 
                  rounded-lg">
                        <span className="text-[20px] md:text-[40px] leading-none mb-2">00</span>
                        <span className="text-[12px] md:text-[18px] uppercase">Sec</span>
                    </div>

                </div>


                    <p className="text-[24px] mt-4 px-4 mb-10">
                    Fee will <span className="text-[#FFCC00]">increase</span> to <span className="text-[#FFCC00]"> Rs 2,000 </span>once the <span className="text-[#FFCC00]"> timer hits ZERO.</span>

                    </p>
          
            </div>
        </section>
    );
};

export default Timer_marketing;
