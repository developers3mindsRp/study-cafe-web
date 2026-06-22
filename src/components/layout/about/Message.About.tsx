import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

const Message_about = () => {
  const { message } = useAboutPage();
  const cardBg = message.cardBackgroundImage?.trim()
    ? `url("${message.cardBackgroundImage}")`
    : "url('/images/about-bg.svg')";

  return (
    <>
      <section className="py-12 ">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          <div className="bg-white rounded-xl border p-8 text-center shadow-sm order-2 lg:order-1">
            <h2 className="text-[25px] font-bold  mb-6 mt-10">{message.getInTouchTitle}</h2>

            <div className="flex justify-center gap-12 mb-6 flex-wrap">
              <img src="/images/fb-circle.svg" className="w-14 h-14" alt="" />
              <img src="/images/twitter-circle.svg" className="w-14 h-14" alt="" />
              <img src="/images/linkedin-circle.svg" className="w-14 h-14" alt="" />
            </div>
            <div className="flex justify-center gap-12 mb-6 flex-wrap ">
              <img src="/images/insta-circle.svg" className="w-14 h-14" alt="" />
              <img src="/images/mail-circle.svg" className="w-14 h-14" alt="" />
            </div>

            <h3 className="text-[20px] font-medium mt-10 text-[#454545]">{message.companyName}</h3>

            <p className="text-[14px] text-[#454545] mt-2 whitespace-pre-line">{message.address}</p>
          </div>

          <div
            className="bg-cover bg-no-repeat rounded-xl p-8 text-white relative order-1 lg:order-2 col-span-2"
            style={{ backgroundImage: cardBg }}
          >
            <div className="hidden md:flex items-center justify-center gap-4 mb-6">
              <img src="/images/left-stroke.svg" alt="" />

              <h2 className="text-[26px] font-semibold text-center">{message.founderSectionTitle}</h2>

              <img src="/images/right-stroke.svg" alt="" />
            </div>

            <div className="flex flex-col xl:flex-row gap-6 items-start">
              <div className="bg-white rounded-xl flex-shrink-0 mx-auto ">
                <img
                  src={message.founderImage}
                  alt="Founder"
                  className="w-[250px] md:w-full md:h-auto rounded-lg object-cover md:mt-0 "
                />
              </div>

              <h2 className="text-[26px] font-semibold text-center block md:hidden">{message.founderSectionTitle}</h2>

              <div>
                {message.founderMessage.includes('<') ? (
                  <div
                    className="text-[15px] leading-relaxed font-regular text-center xl:text-left [&_p]:mb-3"
                    dangerouslySetInnerHTML={{ __html: message.founderMessage }}
                  />
                ) : (
                  <p className="text-[15px] leading-relaxed font-regular text-center xl:text-left">
                    {message.founderMessage}
                  </p>
                )}

                <h3 className="text-[20px] font-medium mt-6">{message.founderName}</h3>

                <p className="text-[15px] mt-2 opacity-90">{message.founderRole}</p>
              </div>
            </div>

            <div className="bg-white rounded-[18px]  w-12 h-12 flex items-center justify-center absolute bottom-14 right-6">
              <img src="/images/linkedin.svg" alt="Linkedin" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Message_about;
