import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

const Mission_about = () => {
  const { mission } = useAboutPage();
  const [card1, card2] = mission.cards;

  return (
    <>
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 border rounded-lg shadow-md p-6 md:p-10">
          <div>
            <h1 className="text-[28px] xl:text-[40px] lg:text-[56px] font-semibold text-[#252525] mb-4">
              {mission.sectionTitle}
            </h1>

            <div
              className="text-[15px] md:text-[17px] text-[#454545] leading-relaxed [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: mission.body }}
            />
          </div>

          <div className="grid sm:grid-cols-1 xl:grid-cols-2  gap-4 items-center ">
            <div className="border border-[#9FBBFF] rounded-xl p-6 xl:p-8 bg-[#FAFAFA] hover:shadow-md transition flex flex-col">
              <div className="w-12 h-12 md:w-16 md:h-16 mb-4">
                <img src={card1.icon} alt="" className="w-full h-full object-contain" />
              </div>

              <h3 className="text-[16px] md:text-[18px] font-bold text-[#252525] mb-2">{card1.title}</h3>

              <p className="text-[13px] md:text-[14px] text-gray-600">{card1.description}</p>
            </div>

            <div className="border border-[#9FBBFF] rounded-xl p-6 xl:p-8 bg-[#FAFAFA] hover:shadow-md transition flex flex-col">
              <div className="w-12 h-12 md:w-16 md:h-16 mb-4">
                <img src={card2.icon} alt="" className="w-full h-full object-contain" />
              </div>

              <h3 className="text-[16px] md:text-[18px] font-bold text-[#252525] mb-2">{card2.title}</h3>

              <p className="text-[13px] md:text-[14px] text-gray-600">{card2.description}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Mission_about;
