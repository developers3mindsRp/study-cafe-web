"use client";
import { useState } from "react";
import Certificate from "./Certificate";

import ReviewPage from "./Review";

export default function PaymemtDetail() {
    const [openDay, setOpenDay] = useState<number | null>(null)
    const [open, setOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [isCertificateOpen, setIsCertificateOpen] = useState(false)
    const videos = [
        {
            id: 1,
            title: "GST Provisions related to GSTR-9 and GSTR-9C filing",
            thumbnail: "/images/home/f1.jpg",
        },
        {
            id: 2,
            title: "GST Provisions related to GSTR-9 and GSTR-9C filing",
            thumbnail: "/images/home/f2.png",
        },
        {
            id: 3,
            title: "GST annual return workflow, table wise changes and comparison with last year",
            thumbnail: "/images/home/f3.png",
        },
        {
            id: 4,
            title: "Compulsory and Optional Tables",
            thumbnail: "/images/home/f4.jpg",
        },
    ];
    const [selectedVideo, setSelectedVideo] = useState(1);


    return (
        <div className="container  mx-auto px-6 py-6 ">

            {/* Back */}
            <div className="text-[16px] text-[#09339B] mb-3 cursor-pointer">
                ← Back to Payment History
            </div>

            {/* Header */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h1 className="md:text-[40px] font-semibold">
                        Payment Details
                    </h1>
                    <p className="text-[#252525] mt-1 text-[14px] md:text-[24px]">
                        Transaction ID: TXN-N41QMA9N4
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="bg-[#09339B] text-white px-4 py-2 rounded-md 
               hover:bg-[#072a80] transition duration-200
               flex items-center gap-2"
                        onClick={() => setIsReviewOpen(true)}
                    >
                        <img
                            src="/images/download-w.svg"
                            alt="Download Icon"
                            className="w-5 h-5 object-contain"
                        />
                        <span>Download</span>
                    </button>
                </div>


            </div>

            {/* Progress */}
            <div className="mt-6 bg-white border border-[#9FBBFF] rounded-lg p-4">
                
                <div className="flex flex-col justify-between text-sm m-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/success.svg"
                            alt="Success"
                            className="w-8 h-8 relative top-2"
                        />
                        <span className="font-bold text-[20px]">
                            Payment Successful
                        </span>
                    </div>

                    <span className="ml-10">2026-02-09 at 14:12:45</span>
                </div>

                <div className="border-b border-[#AFAFAF] md:m-6"></div>

                <div className="md:flex justify-between text-sm  m-4">
                    <div className="flex md:flex-col mb-2">
                       <div className="flex items-center gap-2">
                            <img
                                src="/images/id.svg"
                                alt="Order ID"
                                className="w-5 h-5"
                            />
                            <span className="text-[#AFAFAF] md:text-[20px]">
                                Order ID
                            </span>
                        </div>

                        <span className="text-black md:text-[16px] font-bold ml-2 md:ml-7 md:mt-2">ORD-72619</span>
                    </div>

                    <div className="flex md:flex-col mb-2">
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/file-1.svg"
                                alt="Invoice Number"
                                className="w-5 h-5"
                            />
                            <span className="text-[#AFAFAF] md:text-[20px]">
                                Invoice Number
                            </span>
                        </div>

                        <span className="text-black  md:text-[16px]  font-bold ml-2 md:ml-7 md:mt-2">INV-2026-02-0944545</span>
                    </div>

                    <div className="flex md:flex-col ">
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/cc.svg"
                                alt="Payment Method"
                                className="w-5 h-5"
                            />
                            <span className="text-[#AFAFAF] md:text-[20px]">
                                Payment Method
                            </span>
                        </div>

                        <span className="text-black md:text-[16px] mb-1 font-bold ml-2 md:ml-7 md:mt-2">Razorpay</span>
                        <span className="text-black md:text-[16px]  font-bold ml-7">****4242</span>
                    </div>

                </div>

            </div>



            {/* Left */}
            <div className="lg:col-span-2 bg-white border border-[#9FBBFF] rounded-xl p-4 mt-12">
                <div className="flex flex-col justify-between text-sm mb-4">
                    <span className="font-bold text-[20px] mb-1 m-4 ">Item Details</span>

                </div>
                <div className="border-b border-[#AFAFAF]"></div>

                <div className=" text-sm mt-4">
                    <div className="flex justify-between m-4">
                        <span className="text-[#AFAFAF] text-[20px] mb-2 ">Item</span>
                        <span className="text-[#AFAFAF] text-[20px] mb-2">Premium Membership</span>

                    </div>
                    <div className="flex justify-between m-4 ">
                        <span className="text-[#AFAFAF] text-[16px] mb-1  ">Category</span>
                        <span className="text-[#AFAFAF] text-[16px] mb-1 ">Annual Plan</span>
                    </div>

                    <div className="border-b border-[#AFAFAF]"></div>

                    <div className="flex justify-between m-4 ">
                        <span className="text-[#AFAFAF] text-[16px] mb-1  ">Subtotal</span>
                        <span className="text-[#AFAFAF] text-[16px] mb-1 ">7,999</span>
                    </div>
                    <div className="border-b border-[#AFAFAF]"></div>
                    <div className="flex justify-between m-4 ">
                        <span className="text-black font-semibold text-[16px] mb-1  ">Total Amount</span>
                        <span className="text-black font-semibold text-[16px] mb-1 ">7,999</span>
                    </div>



                </div>





            </div>


        </div>

    );
}
