"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { HomeHero } from "@/types/models.types";
import {
  resolveApiAssetUrl,
  isUnoptimizedImageSrc,
  resolveCssBackgroundImage,
} from "@/utils/mediaUrl";
import Image from "next/image";
import { motion } from "framer-motion";

const DEFAULT_HERO: HomeHero = {
  title: "Master Your Skills with Professional Courses",
  ctaText: "View Memberships",
  ctaLink: "/plans",
  badge: "Welcome to StudyCafe Learning Platform",
};

/** Shipped fallback, used until an admin uploads a hero background in the CMS. */
const DEFAULT_HERO_BACKGROUND = "/images/home/home-banner.webp";

interface HeroSectionProps {
  hero?: HomeHero | null;
}

const HeroSection = ({ hero }: HeroSectionProps) => {
  const router = useRouter();
  const h = hero ?? DEFAULT_HERO;

  const heroSrc = h.imageUrl
    ? resolveApiAssetUrl(h.imageUrl) || h.imageUrl
    : "/images/home/home.png";

  // Rendered during SSR, so the correct background is in the initial HTML — no flash.
  const heroBackground = resolveCssBackgroundImage(
    h.backgroundImageUrl,
    DEFAULT_HERO_BACKGROUND,
  );

  const heroImageUnoptimized = isUnoptimizedImageSrc(heroSrc);

  const handleClick = () => {
    router.push(h.ctaLink || "/plans");
  };

  return (
    <section
      className="relative bg-cover bg-no-repeat md:h-auto xl:h-[750px]"
      style={{ backgroundImage: heroBackground }}
    >
      <div className="container mx-auto px-4  md:py-12 lg:py-20 xl:py-18 2xl:py-18 flex flex-col lg:flex-row items-center">
 

        {/* The entrance animation below is transform-only and staggers fast. It used to
            fade each child in from opacity:0, which meant every word of above-the-fold
            copy — including the <h1>, itself an LCP candidate — was invisible in the SSR
            HTML until hydration finished. Keep `opacity` out of these variants. */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="w-full lg:w-1/2 text-center lg:text-left mt-8 md:mt-0"
        >
          {/* Badge */}
          {h.badge && (
            <motion.p
              variants={{
                hidden: { y: 12 },
                visible: { y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
              className="bg-white/10 backdrop-blur-lg inline-block px-3 py-2 rounded-lg mb-6 text-sm md:text-lg xl:text-lg text-white border border-[#a5aab8]"
            >
              {h.badge}
            </motion.p>
          )}

          {/* Title */}
          <motion.h1
            variants={{
              hidden: { y: 12 },
              visible: { y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
            className="text-[30px] sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-white leading-tight md:mb-10"
          >
            {h.title}
          </motion.h1>

          {/* Description */}
          {h.description && (
            <motion.p
              variants={{
                hidden: { y: 12 },
                visible: { y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
              className="mt-4 text-[16px] md:text-[18px] xl:text-[24px] text-white max-w-2xl mx-auto lg:mx-0 font-normal px-6 md:px-0"
            >
              {h.description}
            </motion.p>
          )}

          {/* Buttons */}
          <motion.div
            variants={{
              hidden: { y: 12 },
              visible: { y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
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
                  width={24}
                  height={24}
                  className="w-5 h-auto"
                />
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* IMAGE
            Deliberately NOT wrapped in <motion.div>. This is the page's LCP element, and
            framer-motion renders its `initial` state as an inline style during SSR — the
            old `initial={{ opacity: 0, y: 80 }}` shipped the hero image at opacity:0, so
            the browser could not record LCP until React had hydrated, framer had mounted,
            the 0.4s delay had elapsed and the 1.2s fade had run. On throttled mobile that
            put LCP at ~7.9s against an FCP of 1.7s. Rendered plainly, LCP is just the
            image's own paint. Any entrance effect added back here must animate `transform`
            only and never `opacity`, and must not offset the image out of the viewport. */}
        <div className="sm:w-auto md:w-auto lg:w-1/2 mt-8 lg:mt-0 flex justify-center lg:justify-end mb-4 md:mb-0">
          <Image
            width={1000}
            height={1000}
            src={heroSrc}
            alt="Learning illustration"
            unoptimized={heroImageUnoptimized}
            priority
            // Was "(max-width: 1023px) min(100vw, 28rem) 50vw" — a missing comma before
            // `50vw` made the whole attribute invalid, so the browser fell back to 100vw.
            sizes="(max-width: 1023px) min(100vw, 28rem), 50vw"
            className="px-4 sm:w-[450px] md:w-auto xl:w-full 2xl:w-full h-auto object-contain max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
