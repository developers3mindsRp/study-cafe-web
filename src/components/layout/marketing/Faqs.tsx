"use client";

import { useState } from "react";
import type { FAQ } from "@/types/models.types";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
  faqs?: FAQ[];
}

const Faqs_marketing = ({ data }: Props) => {
  const faqs = data.faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs.length) return null;

  return (
    <section className="container px-4 mx-auto pb-8">
      <div className="mx-auto md:mt-2">
        <h2 className="text-center text-[24px] md:text-[40px] uppercase font-semibold mb-6 md:mb-8">FAQ&apos;s</h2>
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow-md">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center gap-3 p-4 transition bg-white text-black"
              >
                <span className="min-w-0 font-medium text-[16px] md:text-[20px] text-left">
                  {index + 1}. {item.q}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index ? (
                <div className="px-4 pt-4 pb-4 text-[15px] md:text-[16px] text-[#454545] bg-white leading-[26px] md:leading-[28px] border-t">
                  {item.a}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs_marketing;