import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

const Awards_about = () => {
  const { awards } = useAboutPage();
  const imgs = awards.images.length > 0 ? awards.images : ['/images/certificates1.svg', '/images/certificates1.svg'];

  return (
    <>
      <section className="">
        <div className="container mx-auto pt-4 w-full px-4 text-left gap-8 ">
          <div className="text-center">
            <h1 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-6">{awards.sectionTitle}</h1>
          </div>
          <div className="hidden md:block">
            <div className="rounded-lg  bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
              {imgs.slice(0, 2).map((src, i) => (
                <div key={`${src}-${i}`} className="flex flex-col  rounded-full mb-4">
                  <img src={src} alt="" className="" />
                </div>
              ))}
            </div>
          </div>
          <div className="block md:hidden ">
            <div className="rounded-lg  bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
              {imgs.slice(0, 2).map((src, i) => (
                <div key={`${src}-${i}`} className="flex flex-col  rounded-[10px] mb-4 border border-[#E5E7EB] p-[15px]">
                  <img src={src} alt="" className="w-[205px] m-auto" />
                  <img src="/images/leaf.png" className='mt-[-65px]'/>
                </div>
              ))}
            </div>
          </div>
         
        </div>
      </section>
    </>
  );
};

export default Awards_about;
