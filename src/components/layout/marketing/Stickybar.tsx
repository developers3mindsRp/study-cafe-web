"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function StickyCTA({ data }: Props) {
  const [visible, setVisible] = useState(true);
  const totalSec = (data.countdownMinutes ?? 15) * 60;
  const [remaining, setRemaining] = useState(totalSec);

  useEffect(() => {
    setRemaining(totalSec);
    const t = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [totalSec]);

  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 w-full z-50 md:hidden transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-[#000A1F] px-4 py-3 shadow-lg">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setVisible(!visible)}
            onKeyDown={(e) => e.key === "Enter" && setVisible(!visible)}
            className="flex justify-center mb-2 cursor-pointer"
          >
            <div className="w-12 h-1.5 bg-gray-400 rounded-full" />
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <div className="bg-yellow-400 text-black font-bold px-3 py-2 rounded-md text-center">
                <div className="text-lg leading-none">{pad(min)}</div>
                <div className="text-[10px]">Min</div>
              </div>
              <div className="bg-yellow-400 text-black font-bold px-3 py-2 rounded-md text-center">
                <div className="text-lg leading-none">{pad(sec)}</div>
                <div className="text-[10px]">Sec</div>
              </div>
            </div>
            <p className="text-white text-xs ml-3">
              Fee will <span className="text-yellow-400">increase</span> to{" "}
              <span className="text-yellow-400 font-semibold">{data.increasedPriceText}</span> once
              the timer hits 0
            </p>
          </div>

          <div className="bg-[url('/images/red-bg.png')] bg-cover bg-no-repeat rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-white text-[18px] font-semibold leading-tight">
                {data.ctaTitle}
              </h3>
              <p className="text-white text-[12px] mt-1 opacity-90">{data.ctaSubtitle}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-white text-[14px] font-medium">{data.ctaPriceText}</span>
              <Link
                href={data.checkoutUrl}
                className="bg-white text-gray-700 text-[14px] font-semibold px-6 py-2 rounded-md"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {!visible ? (
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden bg-[#0B1B2B] px-4 py-2 rounded-full shadow-md text-white text-sm"
        >
          Show offer
        </button>
      ) : null}
    </>
  );
}
