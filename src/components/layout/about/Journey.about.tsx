import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

/** Layout matches original absolute-positioned timeline (7 milestones). */
const CARD_WRAPPER_CLASSES = [
  'relative md:absolute   md:top-[120px] md:left-[8%] xl:left-[10%] 2xl:left-[12%] w-[230px] bg-white rounded-lg shadow-lg p-4 mx-auto ',
  'relative md:absolute  md:top-[120px] md:left-[42%] xl:left-[45%] 2xl:left-[42%] w-[230px] bg-white rounded-lg shadow-lg p-4 mx-auto ',
  'relative md:absolute md:top-[160px] md:right-[8%] xl:right-[5%] 2xl:right-[12%] w-[230px] bg-white rounded-lg shadow-lg p-4 mx-auto',
  'relative md:absolute  md:top-[490px] md:left-[0%] xl:left-[0%] 2xl:left-[6%] w-[230px] bg-white rounded-lg shadow-lg p-4 mx-auto',
  'relative md:absolute md:top-[450px] md:left-[30%] xl:left-[38%] 2xl:left-[40%] w-[230px] bg-white rounded-lg shadow-lg p-4 mx-auto',
  'relative md:absolute   md:top-[520px] md:right-[10%] xl:right-[10%] 2xl:right-[18%] w-[230px] bg-white rounded-lg shadow-lg p-4 mx-auto',
  'relative md:absolute   md:bottom-[58px] md:left-[35%]  md:-translate-x-1/2 xl:bottom-[-55px] w-[240px] bg-white rounded-lg shadow-lg p-4 mx-auto',
];

const Journey_about = () => {
  const { journey } = useAboutPage();
  const items = journey.milestones.slice(0, CARD_WRAPPER_CLASSES.length);

  return (
    <>
      <section className="">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-[40px] font-semibold mb-6 xl:mb-4">{journey.sectionTitle}</h2>

          <div className="relative bg-[url('/images/jouney-bg.svg')] bg-cover bg-center bg-no-repeat  md:h-[1100px] py-12 ">
            <svg
              className="absolute top-0 left-0 w-full h-full hidden md:block"
              viewBox="0 0 1200 1000"
              fill="none"
            >
              <path
                d="
                                        M220 260
                                        C360 160 430 200 600 180
                                        S820 140 940 220

                                        S980 480 880 600
                                        S720 300 580 510

                                        S420 520 115 550
                                        S260 790 340 800

                                       
                                        "
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeDasharray="6 6"
                fill="none"
              />
            </svg>

            <div className="flex flex-col gap-12">
              {items.map((milestone, index) => (
                <div key={`${milestone.year}-${milestone.title}-${index}`} className={CARD_WRAPPER_CLASSES[index] ?? CARD_WRAPPER_CLASSES[0]}>
                  <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" alt="" />
                  <div className="bg-[#DDE4FF] px-4 py-10 rounded-lg">
                    <h4 className="font-bold">{milestone.year}</h4>
                    <h5 className="font-bold text-[18px]">{milestone.title}</h5>
                    <p className="text-[14px] text-gray-500 mt-4 mb-6">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Journey_about;
