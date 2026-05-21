"use client";

import React, { useEffect, useState } from "react";

export default function StickyCTA() {
    const [visible, setVisible] = useState(true);
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
        <>
            {/* STICKY CTA */}
            <div
                className={`fixed bottom-0 left-0 w-full z-50 md:hidden transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                <div className="bg-[#000A1F] px-4 py-3 shadow-lg">

                    {/* 🔼 TOP HANDLE (CENTER) */}
                    <div
                        onClick={() => setVisible(!visible)}
                        className="flex justify-center mb-2 cursor-pointer"
                    >
                        <div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
                    </div>

                    {/* Timer + Text */}
                    <div className="flex items-center justify-between mb-3">

                        <div className="flex gap-2">
                            <div className="bg-yellow-400 text-black font-bold px-3 py-2 rounded-md text-center">
                                <div className="text-lg leading-none">{minutes}</div>
                                <div className="text-[10px]">Min</div>
                            </div>

                            <div className="bg-yellow-400 text-black font-bold px-3 py-2 rounded-md text-center">
                                <div className="text-lg leading-none"> {seconds}</div>
                                <div className="text-[10px]">Sec</div>
                            </div>
                        </div>

                        <p className="text-white text-xs ml-3">
                            Fee will <span className="text-yellow-400">increase</span> to Rs{" "}
                            <span className="text-yellow-400 font-semibold">2,000</span> once the timer hits 0
                        </p>
                    </div>

                    {/* CTA BOX */}
                    <div className="bg-[url('/images/red-bg.png')] bg-cover bg-no-repeat rounded-xl px-5 py-4 flex items-center justify-between">

                        {/* LEFT */}
                        <div>
                            <h3 className="text-white text-[18px] font-semibold leading-tight">
                                Become a Certified <br /> AI Expert
                            </h3>
                            <p className="text-white text-[12px] mt-1 opacity-90">
                                To grow your practice Now!
                            </p>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-white text-[14px] font-medium">
                                Only at Rs 99
                            </span>

                            <button className="bg-white text-gray-700 text-[14px] font-semibold px-6 py-2 rounded-md">
                                Buy Now
                            </button>
                        </div>

                    </div>

                </div>
            </div>

            {/* 🔽 SMALL BUTTON WHEN HIDDEN */}
            {!visible && (
                <div
                    onClick={() => setVisible(true)}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 cursor-pointer md:hidden"
                >
                    <div className="bg-[#0B1B2B] px-4 py-2 rounded-full shadow-md">
                        <button>show</button>
                    </div>
                </div>
            )}
        </>
    );
}
