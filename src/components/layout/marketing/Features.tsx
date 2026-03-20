import React from "react";
import Link from "next/link";
import { useState } from "react";

const features = [
    "Learn How to Automate your CA Practice",
    "Learn How to Convert the leads into sale",
    "Learn How to Get GST, Income Tax Data from Clients Automatically in One Click",
    "Learn How to Automatically send Mail/ Msg to all Customers using Google Sheet",
    "Learn How to Reply Department Notices Automatically",
    "Learn How to Get New Clients Automatically",
    "Learn How to Collects Payments from Clients Automatically",
    "Learn How to Automate Your CA Practice With AI Tools",
    "Learn How to send Bulk Invoices to Clients Automatically with Attachment",
];

const Features_marketing = () => {
    return (
        <div className="grid md:grid-cols-2 gap-6 mb-6 md:mb-12 mt-8 scroll-mt-28 container px-4 mx-auto" id="features">
     
    
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
    );
};

export default Features_marketing;
