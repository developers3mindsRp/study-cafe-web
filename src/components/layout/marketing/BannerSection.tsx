"use client";

import Image from "next/image";
import Link from "next/link";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
  /** Opens the inline checkout; when absent the bonus banner stays decorative. */
  onBuy?: () => void;
}

export default function BannerSection_digital({ data, onBuy }: Props) {
  const ticker = `${data.announcementText} | `.repeat(5);

  return (
    <div>
      <div className="bg-red-600 text-center text-sm py-2 whitespace-nowrap overflow-hidden">
        <p className="animate-marquee">{ticker}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-[20px] md:text-[40px] font-medium leading-snug">
          {data.headline}
        </h1>
      
        {data.subheadline ? (
          <p className="text-[16px] text-white mt-4">{data.subheadline}</p>
        ) : null}

        <div className="mt-8 rounded-xl md:px-24">
          <div className="relative rounded-lg overflow-hidden">
            {data.youtubeEmbedUrl ? (
              <iframe
                width="100%"
                height="400"
                src={data.youtubeEmbedUrl}
                title={data.headline}
                className="w-full aspect-video rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <Image
                  src={data.thumbnailUrl}
                  alt={data.headline}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg"
                />
                {data.showPlayIcon ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg pointer-events-none">
                    <span className="bg-black/60 w-16 h-16 flex items-center justify-center rounded-full">
                      <span className="text-white text-[30px]">▶</span>
                    </span>
                  </div>
                ) : null}
              </>
            )}
          </div>
          {/* <div className="mt-4">
            <Link
              href={data.checkoutUrl}
              className="inline-block bg-[#FF383C] px-6 py-3 rounded-md font-semibold text-white"
            >
              REGISTER NOW
            </Link>
          </div> */}
        </div>

        <div className="mt-6">
          <p className="font-medium text-[18px]">{data.registerBeforeText}</p>
          <button
            type="button"
            onClick={onBuy}
            className={`mt-2 bg-[#FF383C] px-4 py-2 rounded-md text-sm font-semibold${onBuy ? " cursor-pointer hover:bg-red-700 transition" : ""}`}
          >
            {data.bonusBannerText}
          </button>
          {data.masterclassDate ? (
            <>
              <p className="mt-4 text-[16px] text-white">{data.masterclassLabel}</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-3 px-4 md:px-12">
                <div className="bg-[#292738] text-[#FFCC00] px-3 py-2 rounded-md text-[13px] border flex gap-2 items-center justify-center w-fit">
                  <img src="/images/y-calendar.svg" alt="" className="w-4 h-4" />
                  {data.masterclassDate}
                </div>
                {data.masterclassTime ? (
                  <div className="bg-[#292738] text-[#FFCC00] px-8 py-2 rounded-md text-[13px] border flex gap-2 items-center justify-center w-fit">
                    <img src="/images/y-clock.svg" alt="" className="w-4 h-4" />
                    {data.masterclassTime}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
