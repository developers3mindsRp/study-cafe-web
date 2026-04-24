"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { HomeHero } from "@/types/models.types";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";
import Image from "next/image";

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

  console.log("hero -->", hero);

  const heroSrc = h.imageUrl
    ? resolveApiAssetUrl(h.imageUrl) || h.imageUrl
    : "/images/home/home.png";
  console.log("her image url", h);
  const heroImageUnoptimized =
    heroSrc.startsWith("http://") || heroSrc.startsWith("https://");

  const handleClick = () => {
    router.push(h.ctaLink || "/plans");
  };

  return (
    <section className="relative bg-[url('/images/home/home-banner.png')] bg-cover bg-center bg-no-repeat md:h-auto xl:h-[800px]">
      <div className="container mx-auto px-4  md:py-12 lg:py-24 xl:py-24 2xl:py-24 flex flex-col lg:flex-row items-center">
        {/* TEXT CONTENT */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mt-8 md:mt-0 ">
          {h.badge && (
            <p className="bg-white/10 backdrop-blur-lg inline-block px-3 py-2 rounded-lg mb-6 text-sm md:text-lg xl:text-lg text-white border border-[#a5aab8]">
              {h.badge}
            </p>
          )}

          <h1 className="text-[30px] sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-white leading-tight md:mb-10">
            {h.title}
          </h1>

          {h.description && (
            <p className="mt-4 text-[16px] md:text-[18px] xl:text-[24px] 2xl:text-[24px] text-white max-w-2xl mx-auto lg:mx-0 font-normal px-6 md:px-0">
              {h.description}
            </p>
          )}

          <div className="mt-6 md:mt-10 flex flex-row md:flex-row justify-center lg:justify-start gap-4 px-2 md:px-0 ">
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
          </div>
        </div>

        {/* IMAGE */}
        <div className="sm:w-auto md:w-auto lg:w-1/2 mt-8 lg:mt-0 flex justify-center lg:justify-end mb-4 md:mb-0 ">
          <Image
            width={1000}
            height={1000}
            src={heroSrc}
            crossOrigin="anonymous"
            alt="Learning illustration"
            className="px-4 sm:w-[450px] md:w-auto xl:w-full 2xl:w-full object-contain "
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
