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

          {/* Fixed 3-up / 6-up cells so an extra logo starts a tidy new row instead
              of stretching the row it lands in. The inner grid is pulled 1px past
              the clipped edge, which trims the trailing dividers. */}
          <div className="rounded-lg bg-white border overflow-hidden">
            <div className="grid grid-cols-3 md:grid-cols-6 -mr-px -mb-px">
              {logos.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="flex items-center justify-center border-r border-b border-gray-100 p-4"
                >
                  <img src={src} alt="" className="max-w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Feature_about;
