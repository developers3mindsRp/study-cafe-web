"use client";

import { useEffect, useState } from "react";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";
import Expert_marketing from "./Expert";

interface Props {
  data: ResolvedMarketingPage;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const Timer_marketing = ({ data }: Props) => {
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
    <section className="container mx-auto px-4 py-4 text-center">
      <p className="text-white text-[20px] xl:text-[40px] font-semibold mb-4 px-2 md:px-12 uppercase">
        Time is running out. Reserve your seat <span className="text-yellow-400">now!</span>
      </p>
      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-yellow-400 text-black font-bold px-2 py-4 rounded-lg text-center w-[90px]">
          <div className="text-[40px] md:text-[40px] font-bold leading-none mb-2">{pad(min)}</div>
          <div className="text-xs">Min</div>
        </div>
        <div className="bg-yellow-400 text-black font-bold px-2 py-4 rounded-lg text-center w-[90px]">
          <div className="text-[40px] md:text-[40px] font-bold leading-none mb-2">{pad(sec)}</div>
          <div className="text-xs">Sec</div>
        </div>
      </div>
      <p className="text-[16px] md:text-[24px] mt-4 px-2 md:px-4 mb-8 md:mb-10">
        Fee will increase to{" "}
        <span className="text-yellow-400 font-semibold">{data.increasedPriceText}</span> once the
        timer hits <span className="text-yellow-400">ZERO</span>.
      </p>
      {/* <Expert_marketing data={data} /> */}
    </section>
  );
};

export default Timer_marketing;