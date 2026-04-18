"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { CoursePublicDetail, CourseBatch } from "@/types/models.types";
import { useUserPurchases } from "@/hooks/usePurchases";
import { getToken } from "@/utils/auth.utils";

interface BannerSectionProps {
  course?: CoursePublicDetail | null;
  batches?: CourseBatch[];
}

function formatPrice(val?: string | number | null) {
  if (val == null) return null;
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return null;
  return `₹${n.toLocaleString("en-IN")}`;
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

const FALLBACK_COURSE_INCLUDES = [
  {
    image: "/images/icon-video.png",
    title: "Recording is available for 1 year",
  },
  {
    image: "/images/icon-certiificate.png",
    title: "Studycafe certificate of completion",
  },
  {
    image: "/images/icon-laptop.png",
    title: "Access on mobile or computer/laptop",
  },
];

function resolveIncludeImageUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/")) {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";
    const serverRoot = base.replace(/\/api\/?$/, "");
    return `${serverRoot}${path}`;
  }
  return path;
}

function parseCourseIncludesJson(
  raw?: string | null,
): { image: string; title: string }[] {
  if (!raw?.trim()) return [];
  try {
    const p = JSON.parse(raw);
    if (!Array.isArray(p)) return [];
    return p
      .map((x: { image?: string; icon?: string; title?: string }) => ({
        image: String(x?.image ?? x?.icon ?? ""),
        title: String(x?.title ?? ""),
      }))
      .filter((x) => x.image || x.title);
  } catch {
    return [];
  }
}

/**
 * Resolve the batch date to surface in the banner.
 * - If there's an upcoming batch (start_date >= today) → show that start_date as "Starts at".
 * - Else show the most-recently-ended batch → "Last batch ended on".
 * - Else null (no batches yet).
 */
function resolveDisplayBatch(
  batches: CourseBatch[],
): { date: string; label: "upcoming" | "completed" } | null {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = batches
    .filter((b) => b.start_date)
    .map((b) => ({ d: new Date(b.start_date!), raw: b }))
    .filter(({ d }) => !isNaN(d.getTime()) && d >= now)
    .sort((a, b) => a.d.getTime() - b.d.getTime());

  if (upcoming.length > 0) {
    return { date: upcoming[0].d.toISOString(), label: "upcoming" };
  }

  const completed = batches
    .filter((b) => b.end_date)
    .map((b) => ({ d: new Date(b.end_date!), raw: b }))
    .filter(({ d }) => !isNaN(d.getTime()) && d < now)
    .sort((a, b) => b.d.getTime() - a.d.getTime());

  if (completed.length > 0) {
    return { date: completed[0].d.toISOString(), label: "completed" };
  }

  return null;
}

export default function BannerSection({
  course,
  batches = [],
}: BannerSectionProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const canFetchPurchases = mounted && !!getToken() && !!course?.id;
  const { data: purchases, isPending: purchasesPending } = useUserPurchases({
    enabled: canFetchPurchases,
  });

  const myPurchase = useMemo(() => {
    if (!course?.id || !purchases?.length) return undefined;
    const cid = String(course.id);
    return purchases.find(
      (p) => p.status === "completed" && String(p.courseId) === cid,
    );
  }, [course?.id, purchases]);

  const isOwned = !!myPurchase;
  const batchPhase = myPurchase?.enrolledBatch?.phase;

  const title =
    course?.title ??
    "Certification Course On Practical Filing of GSTR-9 & GSTR-9C";
  const description =
    course?.brief_description ??
    "In our continuous endeavour to empower more and more finance professionals, this certification course has been designed for you. Detailed 2 Days course has been designed where already more than 2 hrs sessions have been organized. Recording of the Video is valid for 1 Year. This Course contains Videos along with study material and files. Live training on GSTR-9 & GSTR-9C will be given.";
  const thumbnail = course?.thumbnail_url ?? "/images/c1.png";
  const price = formatPrice(course?.price);
  const salePrice = formatPrice(course?.sale_price);
  const displayBatch = resolveDisplayBatch(batches);
  const startDate = formatDate(displayBatch?.date ?? null);
  const dateLabel =
    displayBatch?.label === "completed" ? "Last batch ended on" : "Starts at";
  const enrolledCount = course?.enrolled_count ?? 957;
  const ratings = course?.ratings ? Number(course.ratings).toFixed(1) : "4.8";
  const ratingUsers = course?.rating_users ?? 47;
  const languages = course?.language
    ? (Array.isArray(course.language)
        ? course.language
        : [course.language]
      ).join(", ")
    : "English";
  const parsedIncludes = parseCourseIncludesJson(course?.course_includes);
  const courseIncludes =
    parsedIncludes.length > 0 ? parsedIncludes : FALLBACK_COURSE_INCLUDES;
  const displayPrice = salePrice ?? price;
  const originalPrice = salePrice ? price : null;

  const statBadges = (size: "sm" | "lg") => {
    const cls =
      size === "lg"
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
          <span>
            {ratings} by {ratingUsers} Users
          </span>
        </div>
      </>
    );
  };

  const handleShare = async (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const encUrl = encodeURIComponent(url);
    const encTitle = encodeURIComponent(title);
    const encImage = encodeURIComponent(thumbnail);

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
          "_blank",
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`,
          "_blank",
        );
        break;
      case "pinterest":
        window.open(
          `https://pinterest.com/pin/create/button/?url=${encUrl}&media=${encImage}&description=${encTitle}`,
          "_blank",
        );
        break;
      case "print":
        window.print();
        break;
      case "native":
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
          } catch (err) {
            console.error("Error sharing", err);
          }
        } else {
          try {
            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
          } catch (e) {
            console.error("Clipboard error", e);
          }
        }
        break;
    }
  };

  const renderSocialShare = (containerClassName: string) => (
    <div className={containerClassName}>
      <div
        onClick={() => handleShare("native")}
        className="flex gap-2 items-center bg-white text-black p-2 cursor-pointer border border-[#CCCCCC] rounded-[10px] hover:bg-gray-50 transition-colors"
      >
        <img src="/images/icon-share.png" alt="Share" />
        <span className="font-medium text-[20px]">Share</span>
      </div>
      <div className="flex gap-3">
        <img
          src="/images/facebook.svg"
          alt="Facebook"
          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleShare("facebook")}
        />
        <img
          src="/images/linkedin.svg"
          alt="LinkedIn"
          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleShare("linkedin")}
        />
        <img
          src="/images/twitter.svg"
          alt="X"
          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleShare("twitter")}
        />
        <img
          src="/images/pinterest.svg"
          alt="Pinterest"
          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleShare("pinterest")}
        />
        <img
          src="/images/print.svg"
          alt="Print"
          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleShare("print")}
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-[#F5FAFF]">
        <div className="py-2 container px-4 mx-auto">
          <div className="lg:col-span-2 space-y-6 mt-3 md:mt-6">
            <div className="md:mt-6 md:flex md:items-start md:gap-8">
              {/* Left: Banner */}
              <div className="md:w-1/2">
                {/* Course Start Time / Last completed batch date */}
                {startDate && (
                  <p className="bg-[#DEEBFD] w-fit p-2 px-4 md:p-4 rounded-[10px] text-[#09339B] text-[14px] md:text-[16px] font-Outfit font-normal">
                    {dateLabel} {startDate}
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
                  {!isOwned && (
                    <p className="hidden md:block text-[#252525] bg-[#FFF6E5] px-4 py-2 rounded-lg text-sm font-medium border border-dashed border-black mt-1 md:mt-3">
                      Hurry up, few days left at this price!
                    </p>
                  )}
                </div>

                {/* {isOwned && (
                  <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950">
                    <p className="font-semibold text-emerald-900">You&apos;re enrolled in this course</p>
                    <p className="mt-1 text-xs text-emerald-900/85">
                      Access recordings and materials from{" "}
                      <Link href="/account" className="font-medium underline underline-offset-2 hover:text-emerald-950">
                        My courses
                      </Link>{" "}
                      on your account.
                    </p>
                    {batchPhase === "upcoming" && myPurchase?.enrolledBatch?.startDate && (
                      <p className="mt-2 text-xs font-medium text-amber-900">
                        Upcoming live batch starts{" "}
                        {formatDate(myPurchase.enrolledBatch.startDate) ?? "soon"}.
                        Recordings unlock after the batch completes.
                      </p>
                    )}
                    {batchPhase === "live" && (
                      <p className="mt-2 text-xs font-medium text-[#09339B]">
                        Your live batch is in progress — keep learning from My courses.
                      </p>
                    )}
                  </div>
                )} */}

                {/* Mobile stats */}
                <div className="mt-3 flex flex-wrap md:hidden gap-1 justify-between text-[10px] font-bold">
                  {statBadges("sm")}
                </div>

                {/* Mobile social share */}
                {renderSocialShare(
                  "md:hidden flex flex-wrap items-center gap-4 pt-3",
                )}

                {/* Price + Buy buttons (fixed on mobile, static on desktop) */}
                <div className="fixed bottom-0 left-0 w-full z-50 bg-white md:bg-transparent px-4 py-2 md:py-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:static sm:shadow-none sm:p-0 rounded-t-[20px]">
                  {
                    // canFetchPurchases && purchasesPending ? (
                    // <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    //   <span className="inline-block size-4 animate-spin rounded-full border-2 border-[#09339B] border-t-transparent" />
                    //   Checking your enrollment…
                    // </div>
                    // ) :
                    isOwned ? (
                      <>
                        {/* <div className="mt-0 md:mt-4">
                        <p className="text-lg font-semibold text-emerald-800 md:text-xl">Purchased</p>
                        <p className="mt-1 text-sm text-gray-600">
                          No need to pay again — open{" "}
                          <Link href="/account" className="font-medium text-[#09339B] underline underline-offset-2">
                            My courses
                          </Link>{" "}
                          to continue.
                        </p>
                      </div> */}
                        <div className="mt-3 md:mt-4 mb-2 flex flex-row justify-center lg:justify-start gap-4">
                          <Link
                            href="/account"
                            className="w-full md:w-1/2 xl:w-auto flex items-center justify-center py-2 xl:py-3 px-2 md:px-6 xl:px-16 rounded-[10px] text-base xl:text-lg font-medium text-white bg-[#09339B] transition text-center"
                          >
                            Go to My courses
                          </Link>
                          <Link href="/courses" className="w-full sm:w-auto">
                            <span className="flex w-full xl:w-auto items-center justify-center py-2 xl:py-3 px-2 md:px-6 xl:px-16 bg-white text-[#09339B] rounded-[10px] text-base xl:text-[20px] border border-[#09339B] transition font-semibold">
                              View Membership
                            </span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-3 md:mt-4 mb-2 flex flex-row justify-center lg:justify-start gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              const slug = course?.slug;
                              if (slug)
                                router.push(
                                  `/payment?course=${encodeURIComponent(slug)}`,
                                );
                            }}
                            className="w-full md:w-1/2 xl:w-auto py-1 xl:py-2 px-2 md:px-6 xl:px-28 border-2 border-white rounded-[10px] text-base xl:text-lg font-medium text-white bg-[#09339B] transition"
                          >
                            Buy Now
                          </button>
                          <Link href="/courses" className="w-full sm:w-auto">
                            <button
                              type="button"
                              className="w-full xl:w-auto py-2 xl:py-3 px-2 md:px-6 xl:px-16 bg-white text-[#09339B] rounded-[10px] flex items-center justify-center gap-2 text-base xl:text-[20px] border border-[#09339B] transition font-semibold"
                            >
                              View Membership
                            </button>
                          </Link>
                        </div>
                      </>
                    )
                  }
                </div>

                {/* Desktop social share */}
                {renderSocialShare("hidden md:flex items-center gap-4 pt-3")}
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
            <h3 className="text-[14px] md:text-[20px] font-medium">
              This course includes:
            </h3>
            <div className="flex flex-wrap gap-4 items-center text-[#696969] p-3 text-[12px] md:text-[16px]">
              {courseIncludes.map((include, idx) => (
                <div
                  key={idx}
                  className="flex gap-2.5 items-center bg-white p-3 rounded-lg"
                >
                  {/* Smaller icons than bonus cards (bonus ~36–43px; banner row ~28–32px) */}
                  <img
                    src={resolveIncludeImageUrl(include.image)}
                    alt=""
                    className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] object-contain flex-shrink-0"
                  />
                  <span dangerouslySetInnerHTML={{ __html: include.title }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
