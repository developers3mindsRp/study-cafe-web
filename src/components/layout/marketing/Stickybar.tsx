"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
  /** Opens the inline checkout; when absent the CTA navigates to data.checkoutUrl. */
  onBuy?: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function StickyCTA({ data, onBuy }: Props) {
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

  // "Only at Rs 199" → "Buy Now · Rs 199" so the price stays visible without its own line.
  const priceOnly = data.ctaPriceText.replace(/^\s*only\s+at\s*/i, "").trim();
  const buyLabel = priceOnly ? `Buy Now · ${priceOnly}` : "Buy Now";

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 w-full z-50 md:hidden transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Kept deliberately short: this bar sits over the page on every phone, so
            every extra line here is content the visitor can't read. The price now
            lives inside the Buy button; the standalone "Only at …" line was dropped. */}
        <div className="bg-[#000A1F] px-3 pt-1.5 pb-2 shadow-lg">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setVisible(!visible)}
            onKeyDown={(e) => e.key === "Enter" && setVisible(!visible)}
            className="flex justify-center mb-1.5 cursor-pointer"
          >
            <div className="w-10 h-1 bg-gray-400 rounded-full" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1.5 shrink-0">
              <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded-md text-center min-w-[38px]">
                <div className="text-[15px] leading-none">{pad(min)}</div>
                <div className="text-[9px] leading-tight">Min</div>
              </div>
              <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded-md text-center min-w-[38px]">
                <div className="text-[15px] leading-none">{pad(sec)}</div>
                <div className="text-[9px] leading-tight">Sec</div>
              </div>
            </div>
            <p className="text-white text-[11px] leading-snug">
              Fee will <span className="text-yellow-400">increase</span> to{" "}
              <span className="text-yellow-400 font-semibold">{data.increasedPriceText}</span> once
              the timer hits 0
            </p>
          </div>

          <div className="bg-[url('/images/red-bg.png')] bg-cover bg-center bg-no-repeat rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-white text-[14px] font-semibold leading-tight line-clamp-2">
                {data.ctaTitle}
              </h3>
              <p className="text-white text-[11px] mt-0.5 opacity-90 line-clamp-1">{data.ctaSubtitle}</p>
            </div>
            {onBuy ? (
              <button
                type="button"
                onClick={onBuy}
                className="shrink-0 bg-white text-gray-800 text-[13px] font-semibold px-4 py-2 rounded-md whitespace-nowrap"
              >
                {buyLabel}
              </button>
            ) : (
              <Link
                href={data.checkoutUrl}
                className="shrink-0 bg-white text-gray-800 text-[13px] font-semibold px-4 py-2 rounded-md whitespace-nowrap"
              >
                {buyLabel}
              </Link>
            )}
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
