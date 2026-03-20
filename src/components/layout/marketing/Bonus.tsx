

import React from "react";
import Link from "next/link";

const Bonus_marketing = () => {
    const bonuses = [
        {
            title: "Ready Made Editable Microsoft Excel Templates to work 10X Faster in your Office",
            image: "/images/excel.png",
            worth: "₹4,000",
        },
        {
            title: "Ready Made AI Tools Prompts to work 10X Faster in your Office",
            image: "/images/service.png",
            worth: "₹4,000",
        },
        {
            title: "Ready Made Microsoft Excel Short Cut E-Book for MS Office to Work 10X Faster",
            image: "/images/powerpoint.png",
            worth: "₹2,000",
        },
        {
            title: "Ready Made Microsoft Excel Short Cut E-Book for MS Office to Work 10X Faster",
            image: "/images/excel.png",
            worth: "₹2,000",
        },
    ];
    return (
        <section
            className="container px-4 mx-auto mt-12"
        >

            {/* Heading */}
            <h3 className="text-center text-[20px] sm:text-[28px] lg:text-[40px] font-bold px-8 mt-8 uppercase">
                <span className="text-[#FFCC00]">Register </span> before <br className="block md:hidden"/> Today's Midnight 
            </h3>
            <h3 className="text-center text-[20px] sm:text-[28px] lg:text-[24px] font-regular  mt-8 px-12 ">
                To Unlock All Bonuses worth Rs 12,000
            </h3>
       

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-8 px-4 sm:px-8 xl:px-32 mt-10 sm:mt-12 pb-12">

                {bonuses.map((bonus, index) => (
                    <div
                        key={index}
                        className="relative bg-[#FEF9F1] border border-[#F59F0A] rounded-lg 
                 p-4 sm:p-6 text-center shadow-sm w-full "
                    >
                        {/* Bonus Tag */}
                        <span className="absolute -top-4 left-4 text-[14px] sm:text-[16px] font-semibold bg-black text-[#FFCC33] px-3 py-1 rounded-[10px]">
                            Bonus {index + 1}
                        </span>

                        {/* Content */}
                        <div className="flex items-start gap-3 mt-4">
                            <img
                                src={bonus.image}
                                alt=""
                                className="w-[36px] h-[36px] sm:w-[43px] sm:h-[43px]"
                            />
                            <h4 className="text-sm sm:text-base font-semibold text-left text-black">
                                {bonus.title}
                            </h4>
                        </div>

                        {/* Worth */}
                        <div className="mt-6">
                            <span className="relative top-6 md:absolute  text-[16px] sm:text-[18px] font-bold text-green-600 bg-green-100 px-3 py-2 rounded-[10px]">
                                Worth {bonus.worth}
                            </span>
                        </div>
                    </div>
                ))}

            </div>

        </section>
    );
};

export default Bonus_marketing;
