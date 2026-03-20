import React from "react";
import Link from "next/link";
import { useState } from "react";



const Learning_marketing = () => {
    return (
        <div className="bg-[#06152B] py-10 container md:px-32 mx-auto ">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 container px-4 mx-auto">

                {[
                    { img: "/images/setting.svg", text: "Learn About How To Automate Your CA Practice" },
                    { img: "/images/excel.svg", text: "Learn About How To Use AI Tools With Excel" },
                    { img: "/images/code.svg", text: "How To Write Macros Using AI Tools" },
                    { img: "/images/work.svg", text: "Learn About How To Use AI Tools To Speed Up Your Work" },
                    { img: "/images/email.svg", text: "Learn About Email Automation With AI Tools" },
                    { img: "/images/click.svg", text: "Learn How To Get Data From 500+ Clients Automatically In One Click" },
                ].map((item, index) => (

                    <div
                        key={index}
                        className="bg-[#F3F4F6] border border-green-400 rounded-xl 
                   flex flex-col items-center justify-center text-center 
                   p-2 md:p-8 aspect-[1.2/1] 
                   hover:shadow-xl transition duration-300 "
                    >

                        {/* Icon */}
                        <img
                            src={item.img}
                            alt=""
                            className="w-14 h-14 md:w-16 md:h-16 mb-6"
                        />

                        {/* Text */}
                        <h2 className="font-semibold text-[12px] md:text-[18px] text-black leading-snug">
                            {item.text}
                        </h2>

                    </div>

                ))}

            </div>
        </div>


    );
};

export default Learning_marketing;

