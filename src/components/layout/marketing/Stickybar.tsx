"use client";

export default function StickyCTA() {
    return (
        <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
            <div className="bg-[#0B1B2B] px-4 py-3 shadow-lg">

                {/* Timer + Text */}
                <div className="flex items-center justify-between mb-3">

                    <div className="flex gap-2">
                        <div className="bg-yellow-400 text-black font-bold px-3 py-2 rounded-md text-center">
                            <div className="text-lg leading-none">15</div>
                            <div className="text-[10px]">Min</div>
                        </div>

                        <div className="bg-yellow-400 text-black font-bold px-3 py-2 rounded-md text-center">
                            <div className="text-lg leading-none">00</div>
                            <div className="text-[10px]">Sec</div>
                        </div>
                    </div>

                    <p className="text-white text-xs ml-3">
                        Fee will <span className="text-yellow-400">increase</span> to Rs{" "}
                        <span className="text-yellow-400 font-semibold">2,000</span> once the timer hits 0
                    </p>
                </div>

                <div className="bg-red-600 rounded-xl px-5 py-4 flex items-center justify-between">

                    {/* LEFT SIDE */}
                    <div>
                        <h3 className="text-white text-[18px] font-semibold leading-tight">
                            Become a Certified <br /> AI Expert
                        </h3>
                        <p className="text-white text-[12px] mt-1 opacity-90">
                            To grow your practice Now!
                        </p>
                    </div>

                    {/* RIGHT SIDE */}
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
    );
}
