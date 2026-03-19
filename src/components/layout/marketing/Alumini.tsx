


import React from "react";
import Link from "next/link";

const Alumini_marketing = () => {
    return (
        <section
            className="mt-12"
        >


            {/* Alumni Logos */}
            <div className="bg-[url('/images/alumini-bg.png')] bg-no-repeat bg-cover py-3 md:py-12 px-4 md:px-8 pb-8 md:pb-20 mb-8 ">
                <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium text-center mb-6 text-white px-2 mt-4">
                    Our Alumni at Leading Companies
                </h2>

                <div className="container mx-auto">
                    <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 place-items-center">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <div
                                key={num}
                                className="h-[70px] sm:h-[80px] w-full max-w-[140px]
                     border p-3 sm:p-4 rounded-[10px]
                     flex items-center justify-center
                     shadow-sm bg-white"
                            >
                                <img
                                    src={`/images/brand_${num}.svg`}
                                    alt={`brand_${num}`}
                                    className="h-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Alumini_marketing;
