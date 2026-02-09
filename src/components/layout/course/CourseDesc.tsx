"use client";

import { useEffect, useState } from "react";

const tabs = [
  { label: "Course Key Features", target: "features" },
  { label: "Course Description", target: "description" },
  { label: "Course Content", target: "content" },
  { label: "Certificate", target: "certificate" },
];

export default function CourseTabs() {
  const [activeTab, setActiveTab] = useState("features");
  const [isSticky, setIsSticky] = useState(true);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

useEffect(() => {

  const observerTabs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveTab(entry.target.id);
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );

  tabs.forEach((tab) => {
    const sec = document.getElementById(tab.target);
    if (sec) observerTabs.observe(sec);
  });

  let stopObserver: IntersectionObserver | null = null;
  let checkInterval: number;

  const observeStopSection = () => {
    const stopSection = document.getElementById("certificate");
    if (stopSection) {
      stopObserver = new IntersectionObserver(
        ([entry]) => {
          const rectTop = entry.boundingClientRect.top;

          // SCROLL DOWN — certificate reached top → stop sticky
          if (rectTop <= 0) {
            setIsSticky(false);
          }
          // SCROLL UP — certificate moved above viewport → start sticky
          else if (rectTop > 0) {
            setIsSticky(true);
          }
        },
        {
          root: null,
          threshold: [0],
          rootMargin: "0px 0px -100% 0px",
        }
      );

      stopObserver.observe(stopSection);
      clearInterval(checkInterval);
    }
  };

  checkInterval = window.setInterval(observeStopSection, 100);

  return () => {
    observerTabs.disconnect();
    if (stopObserver) stopObserver.disconnect();
    clearInterval(checkInterval);
  };

}, []);





  return (
    <div className={`${isSticky ? "sticky top-20 z-50" : ""} border-b bg-white mt-4`}>
      <div className="container mx-auto px-4">
        <div
          className="
            flex gap-6 py-4
            overflow-x-auto
            whitespace-nowrap
            scrollbar-hide
          "
        >
          {tabs.map((tab) => (
            <button
              key={tab.target}
              onClick={() => handleScroll(tab.target)}
              className={`relative shrink-0 text-[16px] sm:text-[18px] md:text-[20px] transition-all
                ${
                  activeTab === tab.target
                    ? "text-[#252525] font-semibold after:scale-x-100"
                    : "text-[#6C6C6C] after:scale-x-0"
                }
                after:content-['']
                after:absolute
                after:left-0
                after:-bottom-4
                after:w-full
                after:h-[2px]
                after:bg-[#252525]
                after:origin-left
                after:transition-transform
                hover:text-[#252525]
                hover:after:scale-x-100
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
