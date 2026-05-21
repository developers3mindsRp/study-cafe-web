"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { HomeHero } from "@/types/models.types";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";
import Image from "next/image";
import { motion } from "framer-motion";

const DEFAULT_HERO: HomeHero = {
  title: "Master Your Skills with Professional Courses",
  ctaText: "View Memberships",
  ctaLink: "/plans",
  badge: "Welcome to StudyCafe Learning Platform",
};

interface HeroSectionProps {
  hero?: HomeHero | null;
}

const HeroSection = ({ hero }: HeroSectionProps) => {
  const router = useRouter();
  const h = hero ?? DEFAULT_HERO;

  const heroSrc = h.imageUrl
    ? resolveApiAssetUrl(h.imageUrl) || h.imageUrl
    : "/images/home/home.png";

  /** Remote CMS/API URLs: load in the browser (bypass next/image optimizer). The optimizer runs on the Next server and often fails in production when fetching a different origin (timeouts, IP rules, SSL). Local /public assets still use optimization. */
  const heroImageUnoptimized =
    heroSrc.startsWith("http://") || heroSrc.startsWith("https://");

  const handleClick = () => {
    router.push(h.ctaLink || "/plans");
  };

  return (
    <section className="relative bg-[url('/images/home/home-banner.png')] bg-cover  bg-no-repeat md:h-auto xl:h-[750px]">
      <div className="container mx-auto px-4  md:py-12 lg:py-20 xl:py-18 2xl:py-18 flex flex-col lg:flex-row items-center">
 

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.25,
              },
            },
          }}
          className="w-full lg:w-1/2 text-center lg:text-left mt-8 md:mt-0"
        >
          {/* Badge */}
          {h.badge && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
              className="bg-white/10 backdrop-blur-lg inline-block px-3 py-2 rounded-lg mb-6 text-sm md:text-lg xl:text-lg text-white border border-[#a5aab8]"
            >
              {h.badge}
            </motion.p>
          )}

          {/* Title */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
            className="text-[30px] sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-white leading-tight md:mb-10"
          >
            {h.title}
          </motion.h1>

          {/* Description */}
          {h.description && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
              className="mt-4 text-[16px] md:text-[18px] xl:text-[24px] text-white max-w-2xl mx-auto lg:mx-0 font-normal px-6 md:px-0"
            >
              {h.description}
            </motion.p>
          )}

          {/* Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
            className="mt-6 md:mt-10 flex flex-row justify-center lg:justify-start gap-4 px-2 md:px-0"
          >
            <button
              onClick={handleClick}
              className="py-2 px-3 border-2 border-white rounded-[10px] text-[14px] md:text-[20px] font-medium text-white hover:bg-white/20 transition"
            >
              {h.ctaText}
            </button>

            <Link href="/courses">
              <button className="py-3 px-3 bg-white text-[#09339B] rounded-[10px] flex items-center justify-center gap-2 text-base md:text-[20px] hover:bg-gray-100 transition font-semibold">
                Browse Courses
                <img
                  src="/images/icons/blue_arrow.png"
                  alt="→"
                  className="w-5 h-auto"
                />
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.4,
            ease: [0.25, 0.8, 0.25, 1],
          }}
          className="sm:w-auto md:w-auto lg:w-1/2 mt-8 lg:mt-0 flex justify-center lg:justify-end mb-4 md:mb-0"
        >
          <Image
            width={1000}
            height={1000}
            src={heroSrc}
            alt="Learning illustration"
            unoptimized={heroImageUnoptimized}
            priority
            sizes="(max-width: 1023px) min(100vw, 28rem) 50vw"
            className="px-4 sm:w-[450px] md:w-auto xl:w-full 2xl:w-full h-auto object-contain max-w-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
