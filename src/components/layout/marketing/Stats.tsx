"use client";

import React, { useRef, useState, useEffect } from "react";
import CountUp from "react-countup";

export default function Stats_marketing() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Section viewport me aate hi counter start hoga
        if (entry.isIntersecting) {
          setStartCount(true);
        }
      },
      {
        threshold: 0.4, // 40% section visible hone pr start
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-4 md:py-4 px-4 md:w-[850px] mx-auto"
    >
      <div className="container mx-auto px-4 bg-[#09339B] rounded-full p-6">
        <div className="grid grid-cols-3 gap-2 text-center px-2">

          {/* People Coached */}
          <div className="flex flex-col">
            <h3 className="text-[18px] xl:text-[40px] font-bold text-white">
              {startCount && (
                <CountUp
                  end={10000}
                  duration={5} // slow animation
                  separator=","
                />
              )}
              +
            </h3>

            <p className="text-white text-[12px] md:text-[16px]">
              People Coached
            </p>
          </div>

          {/* AI Experts */}
          <div className="flex flex-col">
            <h3 className="text-[18px] xl:text-[40px] font-bold text-white">
              {startCount && (
                <CountUp
                  end={150}
                  duration={5}
                />
              )}
              +
            </h3>

            <p className="text-white text-[12px] md:text-[16px]">
              Preferred By AI Experts
            </p>
          </div>

          {/* Attended */}
          <div className="flex flex-col">
            <h3 className="text-[18px] xl:text-[40px] font-bold text-white">
              {startCount && (
                <CountUp
                  end={8500}
                  duration={5}
                  separator=","
                />
              )}
              +
            </h3>

            <p className="text-white text-[12px] md:text-[16px]">
              Attended
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Heading */}
      <div className="mx-auto mt-12 md:ml-12">
        <h1 className="text-2xl md:text-[40px] font-medium leading-snug px-12 md:px-2 text-center mb-8">
          <span className="text-yellow-400">REGISTER </span>
          BEFORE TODAY'S MIDNIGHT
        </h1>
      </div>
    </section>
  );
}