import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

const Feature_about = () => {
  const { featuredIn } = useAboutPage();
  const logos =
    featuredIn.logos.length > 0
      ? featuredIn.logos
      : ['/images/hc.svg', '/images/LT.svg', '/images/ANI.svg', '/images/the-print.svg', '/images/zee.svg', '/images/dailyhunt.svg'];

  return (
    <>
      <section className="py-4">
        <div className="container mx-auto pt-4 w-full px-4 text-left gap-8 ">
          <div className="text-center">
            <h1 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-6">{featuredIn.sectionTitle}</h1>
          </div>

          <div className="rounded-lg bg-white flex flex-wrap border">
            {logos.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="flex flex-1 min-w-[33%] md:min-w-[16.66%] basis-[33%] md:basis-0 items-center justify-center border-r border-b md:border-b-0 border-gray-100 p-4 last:border-r-0"
              >
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Feature_about;
