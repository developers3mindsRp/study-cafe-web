"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        q: " Who can join this Course?",
        a: "⭐ Commerce Graduates/CA/CS/CMA/Law students ⭐ Tax professionals whether in JOB or Practice ⭐ Qualified CA/CS/CMA/LLB ⭐ Semi-qualified CA/CS/CMA working in CA Firms or in Industry ⭐ Any other person not covered above can join course if interested"
    },
    {
        q: " What is the Duration of the Course?",
        a: "The duration varies depending on module selection."
    },
    {
        q: " Whether Course Material will be Provided?",
        a: "Yes, complete study material is provided."
    },
    {
        q: " Whether Course Recording will be Provided?",
        a: "Yes, recordings are provided for 1 year."
    },
    {
        q: " How Can we Join this Course?",
        a: "You can join directly through our course registration portal."
    }
];

const Faqs_marketing = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="container px-4 mx-auto pb-8">
            {/* FAQ Section */}
            <div className="mx-auto md:mt-2">
                <h2 className="text-center text-[30px] md:text-[40px] mb-6">
                    FAQ's
                </h2>

                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div
                            key={index}
                            className="border rounded-lg overflow-hidden shadow-md"
                        >
                            {/* Question Button */}
                            <button
                                onClick={() =>
                                    setOpenIndex(openIndex === index ? null : index)
                                }
                                className={`
                  w-full flex justify-between items-center p-4 transition
                  ${openIndex === index
                                        ? "bg-white text-black"
                                        : "bg-white text-black"}
                `}
                            >
                                <span className="font-medium text-[20px] text-left">
                                    {index + 1}. {item.q}
                                </span>

                                {/* Arrow Icon */}
                                <motion.svg
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </motion.svg>
                            </button>

                            {/* Answer */}
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 text-[16px] text-[#454545] bg-white leading-[28px] border-t p-4">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faqs_marketing;