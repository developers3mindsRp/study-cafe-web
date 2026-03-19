import React from "react";
import Link from "next/link";
import { useState } from "react";

const features = [
    "Finance Professionals",
    "Lawyers",
    "Any Gradudate",
    "Corporate Professionals",
    "Qualified CA/CS/CMA",
    "Any Student",
    "Tax Professionals",
    "Semi-qualified CA/CS/CMA",
    "Anyone Not Listed in Above List",
];

const Attend_marketing = () => {
    return (
        <>
            <h2 className="text-[40px] uppercase text-center font-semibold">Who Can Attend?</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6 md:mb-12 mt-8 scroll-mt-28 container  mx-auto py-4" id="features">
    


                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border  bg-white p-4"
                    >
                        <img src="/images/tick1.png" alt="" width="45" height="45" />
                        <p className="text-[14px] text-black font-semibold">
                            {feature}
                        </p>
                    </div>

                ))}
            </div>
        </>
    );
};

export default Attend_marketing;
