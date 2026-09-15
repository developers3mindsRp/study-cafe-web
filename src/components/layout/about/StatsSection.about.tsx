import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

const Stats_about = () => {
  const { stats } = useAboutPage();

  return (
    <>
      {/* Wrapping flex rather than a grid: 2-up / 4-up as before, but a row that
          does not fill up stays centred instead of hugging the left edge. */}
      <section className="container mx-auto pt-4 md:pt-6 md:pb-12 w-[100%] px-4 text-left flex flex-wrap justify-center gap-1">
        {stats.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="basis-[calc(50%-2px)] md:basis-[calc(25%-3px)] p-2 md:p-4 bg-[#09339B] rounded-lg text-center flex items-center md:justify-center gap-3  md:gap-8 px-3 "
          >
            <img src={item.icon} alt={item.title} className="w-10 h-10 xl:w-auto xl:h-auto " />

            <div className="flex flex-col">
              <h2 className="text-[14px] md:text-[16px] font-regular text-white xl:w-[110px] whitespace-nowrap">
                {item.title}
              </h2>

              <p className="text-[25px] xl:text-[40px] text-white mt-1">{item.value}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Stats_about;
