import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative bg-[url('/images/hero_banner.png')] bg-center bg-cover bg-no-repeat h-[700px] md:h-[720px] overflow-hidden">

      {/* TOP TEXT */}
      <div className="container mx-auto px-4 pt-10 text-center">
        <p className="bg-white inline-block px-4 py-2 rounded-md mb-4 text-[18px]">
          Welcome to StudyCafe Learning Platform
        </p>

        <h1 className="text-[32px] md:text-[40px] font-bold text-[#252525] leading-tight">
          Master Your Skills with <br /> Professional Courses
        </h1>

        <p className="text-[18px] md:text-[22px] mt-4 text-[#252525]">
          Learn from industry experts, get certified, and boost your career
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button className="py-2 px-4 border-2 border-black rounded-md">
            View Memberships
          </button>
          <button className="py-2 px-4 bg-[#09339B] text-white rounded-md">
            Browse Courses
          </button>
        </div>
      </div>

      {/* CENTER IMAGE + ORBIT */}
      <div className="relative flex justify-center mt-[150px]">
        {/* Container sized to fit the orbit (uses CSS max to accommodate image or orbit) */}
        <div
          className="relative flex items-center justify-center "
          style={{ width: "max(520px, 550px)", height: "max(520px, 550px)" }}
        >
          {/* CENTER IMAGE (centered inside the container) */}
          <img
            src="/images/img1.svg"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[95%] z-20 "
            alt="Center Icon"
          />

          {/* ORBITING CIRCLES: centered and sized to the container so icons orbit the image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-36">
            <OrbitingCircles iconSize={90} radius={428} speed={1.3}>
              <img src="/images/icon1.svg" />
              <img src="/images/icon2.svg" />
              <img src="/images/icon3.svg" />
              <img src="/images/icon4.svg" />
              <img src="/images/icon5.svg" />
              <img src="/images/icon1.svg" />
              <img src="/images/icon2.svg" />
              <img src="/images/icon3.svg" />
              <img src="/images/icon4.svg" />
              <img src="/images/icon5.svg" />
            </OrbitingCircles>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
