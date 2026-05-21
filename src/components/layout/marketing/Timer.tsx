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
    <section className="container mx-auto px-4 py-8 text-center">
      <p className="text-[18px] md:text-[22px] font-semibold uppercase mb-4">
        Time is running out. Reserve your seat <span className="text-yellow-400">now!</span>
      </p>
      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-yellow-400 text-black font-bold px-6 py-4 rounded-lg text-center min-w-[80px]">
          <div className="text-3xl">{pad(min)}</div>
          <div className="text-xs">Min</div>
        </div>
        <div className="bg-yellow-400 text-black font-bold px-6 py-4 rounded-lg text-center min-w-[80px]">
          <div className="text-3xl">{pad(sec)}</div>
          <div className="text-xs">Sec</div>
        </div>
      </div>
      <p className="text-white mb-8">
        Fee will increase to{" "}
        <span className="text-yellow-400 font-semibold">{data.increasedPriceText}</span> once the
        timer hits <span className="text-yellow-400">ZERO</span>.
      </p>
      <Expert_marketing data={data} />
    </section>
  );
};

export default Timer_marketing;
