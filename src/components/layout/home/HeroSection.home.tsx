import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-[url('/images/hero_banner.png')] bg-no-repeat bg-cover bg-center h-[595px] md:h-[747px]">
      <div className="container mx-auto px-4 pt-8 mb:pt-20 pb-32 flex flex-col items-center">

        {/* Top Welcome Badge */}
        <div className="flex items-center justify-center mb-4">
          <p className="text-[16px] sm:text-[18px] md:text-[20px] bg-white p-2 sm:p-3 rounded-md text-center">
            Welcome to StudyCafe Learning Platform
          </p>
        </div>

        {/* Heading & Subheading */}
        <div className="text-center max-w-3xl">
          <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-[#252525] mb-4">
            Master Your Skills with <br /> Professional Courses
          </h1>
          <h3 className="text-[16px] sm:text-[20px] md:text-[24px] text-[#252525]">
            Learn from industry experts, get certified, and boost your career
            with our comprehensive online courses
          </h3>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="py-2 px-4  bg-transparent border-2 border-[#252525] text-[#252525] rounded-md font-semibold hover:bg-blue-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              View Memberships
            </button>
            <button className="py-2 px-4 bg-[#09339B] text-white border-2 border-transparent rounded-md font-semibold hover:bg-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              Browse Courses
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex items-center justify-center mt-8">
          <img
            src="/images/img1.svg"
            alt="Hero Graphic"
            className="w-full max-w-lg sm:max-w-xl md:max-w-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
