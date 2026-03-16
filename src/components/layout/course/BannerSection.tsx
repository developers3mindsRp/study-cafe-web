"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { CoursePublicDetail } from "@/types/models.types";

interface BannerSectionProps {
  course?: CoursePublicDetail | null;
}

function formatPrice(val?: string | number | null) {
  if (val == null) return null;
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return null;
  return `₹${n.toLocaleString("en-IN")}`;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    // Deterministic format: "Tuesday 24 February, 2026" — same on server and client
    return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  } catch {
    return null;
  }
}

export default function BannerSection({ course }: BannerSectionProps) {
  const router = useRouter();

  const title = course?.title ?? "Certification Course On Practical Filing of GSTR-9 & GSTR-9C";
  const description = course?.brief_description ?? "In our continuous endeavour to empower more and more finance professionals, this certification course has been designed for you. Detailed 2 Days course has been designed where already more than 2 hrs sessions have been organized. Recording of the Video is valid for 1 Year. This Course contains Videos along with study material and files. Live training on GSTR-9 & GSTR-9C will be given.";
  const thumbnail = course?.thumbnail_url ?? "/images/c1.png";
  const price = formatPrice(course?.price);
  const salePrice = formatPrice(course?.sale_price);
  const startDate = formatDate(course?.start_date);
  const enrolledCount = course?.enrolled_count ?? 957;
  const ratings = course?.ratings ? Number(course.ratings).toFixed(1) : "4.8";
  const ratingUsers = course?.rating_users ?? 47;
  const languages = course?.language
    ? (Array.isArray(course.language) ? course.language : [course.language]).join(", ")
    : "English";

  const displayPrice = salePrice ?? price;
  const originalPrice = salePrice ? price : null;

  const statBadges = (size: "sm" | "lg") => {
    const cls = size === "lg"
      ? "flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md"
      : "flex items-center gap-1 bg-white text-black px-2 py-2 rounded-md whitespace-nowrap";
    const imgCls = size === "lg" ? "w-4 h-4" : "w-4 h-3";
    return (
      <>
        <div className={cls}>
          <img src="/images/icon-eng.png" alt="Language" className={imgCls} />
          <span>{languages}</span>
        </div>
        <div className={cls}>
          <img src="/images/icon-user.png" alt="Students" className={imgCls} />
          <span>{enrolledCount.toLocaleString("en-IN")} students</span>
        </div>
        <div className={cls}>
          <img src="/images/Star.png" alt="Rating" className={imgCls} />
          <span>{ratings} by {ratingUsers} Users</span>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="bg-[#F5FAFF]">
        <div className="py-2 container px-4 mx-auto">
          <div className="lg:col-span-2 space-y-6 mt-3 md:mt-6">
            <div className="md:mt-6 md:flex md:items-start md:gap-8">

              {/* Left: Banner */}
              <div className="md:w-1/2">
                {/* Course Start Time */}
                {startDate && (
                  <p className="bg-[#DEEBFD] w-[320px] md:w-[360px] p-2 px-4 md:p-4 rounded-[10px] text-[#09339B] text-[14px] md:text-[16px] font-Outfit font-normal">
                    Starts at {startDate}
                  </p>
                )}

                <h1 className="text-[20px] md:text-[20px] xl:text-[43px] font-semibold text-gray-900 leading-snug mt-3 md:mt-6">
                  {title}
                </h1>

                {/* Mobile image */}
                <div className="block md:hidden">
                  <div className="rounded overflow-hidden shadow mt-4">
                    <Image
                      src={thumbnail}
                      alt={title}
                      width={568}
                      height={320}
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="mt-3 p-3 md:flex flex-wrap gap-3 sm:gap-6 justify-center sm:justify-between text-[8px] sm:text-[13px] font-bold hidden">
                    {statBadges("lg")}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#929292] text-[16px] leading-[32px] mt-6">
                  {description}
                </p>

                {/* Mobile stats */}
                <div className="mt-3 flex flex-wrap md:hidden gap-1 justify-between text-[10px] font-bold">
                  {statBadges("sm")}
                </div>

                {/* Mobile social share */}
                <div className="md:hidden flex items-center gap-4 pt-3">
                  <div className="flex gap-2 items-center bg-white text-black p-2 cursor-pointer border border-[#CCCCCC] rounded-[10px]">
                    <img src="/images/icon-share.png" alt="Share" />
                    <span className="font-medium text-[20px]">Share</span>
                  </div>
                  <div className="flex gap-3">
                    <img src="/images/facebook.svg" alt="Facebook" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/linkedin.svg" alt="LinkedIn" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/twitter.svg" alt="X" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/pinterest.svg" alt="Pinterest" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/print.svg" alt="Print" className="w-8 h-8 cursor-pointer" />
                  </div>
                </div>

                {/* Price + Buy buttons (fixed on mobile, static on desktop) */}
                <div className="fixed bottom-0 left-0 w-full z-50 bg-white md:bg-transparent px-4 py-2 md:py-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:static sm:shadow-none sm:p-0 rounded-t-[20px]">
                  <div className="mt-0 md:mt-4 flex flex-col sm:flex-row md:items-start items-center gap-3">
                    <p className="text-[30px] md:text-[26px] xl:text-[30px]">
                      {originalPrice && (
                        <span className="line-through text-[#929292] font-medium mr-2">
                          {originalPrice}
                        </span>
                      )}
                      {displayPrice && (
                        <span className="text-black font-bold text-[30px] xl:text-[40px]">
                          {displayPrice}
                        </span>
                      )}
                    </p>
                    <p className="hidden md:block text-[#252525] bg-[#FFF6E5] px-4 py-2 rounded-lg text-sm font-medium border border-dashed border-black mt-1 md:mt-3">
                      Hurry up, few days left at this price!
                    </p>
                  </div>

                  <div className="mt-3 md:mt-4 mb-2 flex flex-row justify-center lg:justify-start gap-4">
                    <button
                      onClick={() => router.push("/plans")}
                      className="w-full md:w-1/2 xl:w-auto py-1 xl:py-2 px-2 md:px-6 xl:px-28 border-2 border-white rounded-[10px] text-base xl:text-lg font-medium text-white bg-[#09339B] transition"
                    >
                      Buy Now
                    </button>
                    <Link href="/courses" className="w-full sm:w-auto">
                      <button className="w-full xl:w-auto py-2 xl:py-3 px-2 md:px-6 xl:px-16 bg-white text-[#09339B] rounded-[10px] flex items-center justify-center gap-2 text-base xl:text-[20px] border border-[#09339B] transition font-semibold">
                        View Membership
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Desktop social share */}
                <div className="hidden md:flex items-center gap-4 pt-3">
                  <div className="flex gap-2 items-center bg-white text-black p-2 cursor-pointer border border-[#CCCCCC] rounded-[10px]">
                    <img src="/images/icon-share.png" alt="Share" />
                    <span className="font-medium text-[20px]">Share</span>
                  </div>
                  <div className="flex gap-3">
                    <img src="/images/facebook.svg" alt="Facebook" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/linkedin.svg" alt="LinkedIn" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/twitter.svg" alt="X" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/pinterest.svg" alt="Pinterest" className="w-8 h-8 cursor-pointer" />
                    <img src="/images/print.svg" alt="Print" className="w-8 h-8 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Right: Image + stats */}
              <div className="md:w-1/2 mt-6 md:mt-[95px]">
                <div className="hidden md:block rounded overflow-hidden shadow">
                  <Image
                    src={thumbnail}
                    alt={title}
                    width={568}
                    height={320}
                    className="w-full object-cover"
                  />
                </div>

                {/* Desktop stats */}
                <div className="mt-3 p-3 hidden md:flex gap-3 sm:gap-6 justify-center sm:justify-between text-[9px] xl:text-[13px] font-bold">
                  {statBadges("lg")}
                </div>
              </div>
            </div>
          </div>

          {/* This course includes */}
          <div className="mt-8">
            <h3 className="text-[14px] md:text-[20px] font-medium">This course includes:</h3>
            <div className="flex flex-wrap gap-4 items-center text-[#696969] p-3 text-[12px] md:text-[16px]">
              <div className="flex gap-2 items-center bg-white p-3">
                <img src="/images/icon-video.png" alt="" />
                <span>Recording is available for 1 year</span>
              </div>
              <div className="flex gap-2 items-center bg-white p-3">
                <img src="/images/icon-certiificate.png" alt="" />
                <span>Studycafe certificate of completion</span>
              </div>
              <div className="flex gap-2 items-center bg-white p-3">
                <img src="/images/icon-laptop.png" alt="" />
                <span>Access on mobile or computer/laptop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
