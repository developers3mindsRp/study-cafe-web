"use client";
import React from "react";
import CountUp from "react-countup";

const ICONS = [
  "/images/icons/s1.svg",
  "/images/icons/s2.svg",
  "/images/icons/s3.svg",
  "/images/icons/s4.svg",
];

const DEFAULT_STATS = [
  { label: "Active Students", value: "12,847", suffix: "+" },
  { label: "Total Courses", value: "48", suffix: "+" },
  { label: "Certificates Issued", value: "2,356", suffix: "+" },
  { label: "Success Rate", value: "95", suffix: "%" },
];

function parseStatValue(raw) {
  const n = Number(
    String(raw)
      .replace(/,/g, "")
      .replace(/[^0-9.]/g, "")
  );

  return Number.isFinite(n) ? n : 0;
}

function getSuffix(stat, index) {
  const raw = String(stat.value);

  const trailingNonNum = raw.match(/[^0-9,]+$/);

  if (trailingNonNum) return trailingNonNum[0];

  if (stat.suffix != null && String(stat.suffix) !== "") {
    return String(stat.suffix);
  }

  if (stat.label && /success\s*rate/i.test(String(stat.label))) {
    return "%";
  }

  return DEFAULT_STATS[index]?.suffix ?? "+";
}

export default function StatsSection({ stats: statsProp }) {
  const stats = statsProp?.length ? statsProp : DEFAULT_STATS;

  return (
    <section
      className="bg-white py-10 md:py-16 md:pb-8 px-4 scroll-smooth"
      style={{
        scrollBehavior: "smooth",
      }}
    >
      <div className="container mx-auto px-4 bg-[#09339B] rounded-[10px] md:rounded-full p-6 ">
        <div className="grid grid-cols-2 md:flex justify-between gap-8 text-center px-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center gap-3"
            >
              <div className="bg-[#FFFFFF] p-2 xl:p-6 rounded-full">
                <img
                  src={ICONS[i % ICONS.length]}
                  alt={stat.label}
                  className="w-12 h-12 md:w-6 md:h-6 xl:w-16 xl:h-16"
                />
              </div>

              <div className="md:flex flex-col">
                <h3 className="whitespace-nowrap text-[15px] xl:text-[40px] md:text-left font-bold text-[#FFFFFF]">
                  <CountUp
                    end={parseStatValue(stat.value)}
                    duration={5}
                    delay={10}
                    separator=","
                    suffix={getSuffix(stat, i)}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </h3>

                <p className="text-[#FFFFFF] text-[14px] md:text-[16px] text-left">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}