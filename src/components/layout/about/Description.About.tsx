import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

const Description_about = () => {
  const { description } = useAboutPage();

  return (
    <>
      <section className="">
        <div className="container mx-auto pt-4 md:pt-6 md:pb-12  w-[100%]  px-4 text-left grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-4">{description.heading}</h1>
            <div
              className="text-[16px] xl:text-[18px] text-[#454545] [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: description.bodyHtml }}
            />
          </div>

          <div className='h-full'>
            <img src={description.imageUrl} alt="" className="w-full h-full object-contain p-4" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Description_about;
