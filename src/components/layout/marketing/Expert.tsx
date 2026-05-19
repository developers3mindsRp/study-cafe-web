"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Expert_marketing = () => {
    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
                duration: 0.7,
                ease: "easeOut",
            }}
            className="relative max-w-[935px] h-[150px] md:h-[209px]
    flex items-center justify-center
    bg-[url('/images/red-bg.png')] bg-cover bg-no-repeat
    container mx-auto px-4 md:mt-8 md:rounded-[14px]
    overflow-hidden shadow-2xl
    animate-shake "
        >
            {/* Glow Pulse */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 bg-red-500/20 blur-3xl"
            />

            {/* Shine Effect */}
            <motion.div
                animate={{
                    x: ["-120%", "120%"],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "linear",
                    repeatDelay: 1,
                }}
                className="absolute top-0 left-0 w-[40%] h-full
                bg-gradient-to-r from-transparent via-white/25 to-transparent
                skew-x-12"
            />

            {/* Floating Particles */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    opacity: [0.2, 0.7, 0.2],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 3,
                }}
                className="absolute top-5 left-10 w-3 h-3 bg-white rounded-full blur-[2px]"
            />

            <motion.div
                animate={{
                    y: [0, 12, 0],
                    opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2.5,
                }}
                className="absolute bottom-6 right-16 w-2 h-2 bg-yellow-300 rounded-full blur-[1px]"
            />

            {/* Content */}
            <div className="relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    animate={{
                        scale: [1, 1.02, 1],
                    }}
                    className="text-white text-[20px] xl:text-[40px]
                    font-bold mb-2 px-8 tracking-wide"
                >
                    Become a Certified AI Expert
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-white text-[18px] xl:text-[24px]
                    font-normal max-w-xl mx-auto mb-4 px-8"
                >
                    To grow your practice Now!
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    whileHover={{
                        scale: 1.1,
                    }}
                    whileTap={{
                        scale: 0.95,
                    }}
                    animate={{
                        y: [0, -5, 0],
                        rotate: [0, 1, -1, 0],
                    }}
                    transition={{
                        y: {
                            repeat: Infinity,
                            duration: 1.8,
                            ease: "easeInOut",
                        },
                        rotate: {
                            repeat: Infinity,
                            duration: 0.6,
                            repeatDelay: 2,
                        },
                    }}
                >
                    <Link href="/login">
                        <button
                            className="bg-white text-black px-7 py-2 md:py-3
                            rounded-[15px] font-semibold
                            hover:bg-black hover:text-white
                            transition-all duration-300
                            flex mx-auto items-center gap-2
                            shadow-[0_8px_30px_rgba(255,255,255,0.35)]"
                        >
                            🚀 Only at Rs 99
                        </button>
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Expert_marketing;