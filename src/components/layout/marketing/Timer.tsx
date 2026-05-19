"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const Timer_marketing = () => {
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 min in seconds

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Convert seconds into minutes & seconds
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    return (
        <section>
            {/* Center Content */}
            <div className="relative z-10 text-center">
                <h2 className="text-white text-[20px] xl:text-[40px] font-semibold mb-2 px-12 uppercase">
                    Time is running out. Reserve your seat{" "}
                    <span className="text-[#E6B800]">now!</span>
                </h2>

                <div className="flex justify-center gap-4 mt-4">

                    {/* Minutes */}
                    <div
                        className="bg-[#FFCC00] text-black font-bold 
            w-20 h-24 md:w-20 md:h-24
            flex flex-col items-center justify-center 
            rounded-lg shadow-lg"
                    >
                        <span className="text-[40px] font-bold leading-none mb-2">
                            {minutes}
                        </span>

                        <span className="text-[18px]">Min</span>
                    </div>

                    {/* Seconds */}
                    <div
                        className="bg-[#FFCC00] text-black font-bold 
            w-20 h-24 md:w-20 md:h-24
            flex flex-col items-center justify-center 
            rounded-lg shadow-lg"
                    >
                        <span className="text-[40px] font-bold leading-none mb-2">
                            {seconds}
                        </span>

                        <span className="text-[18px]">Sec</span>
                    </div>
                </div>

                <p className="text-[24px] mt-4 px-4 mb-10 text-white">
                    Fee will <span className="text-[#FFCC00]">increase</span> to{" "}
                    <span className="text-[#FFCC00]">Rs 2,000</span> once the{" "}
                    <span className="text-[#FFCC00]">timer hits ZERO.</span>
                </p>
            </div>
        </section>
    );
};

export default Timer_marketing;