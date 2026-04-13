import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

const HeroSection_about = () => {
  const { hero } = useAboutPage();
  const bg = hero.backgroundImage?.trim() ? `url("${hero.backgroundImage}")` : 'url("/images/about-cover.svg")';

  return (
    <>
      <section
        className="bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: bg }}
      >
        <div className="container mx-auto pt-4 md:pt-6 pb-12  w-[100%]  px-4 text-left">
          <h1 className="text-[30px] xl:text-[62px] font-semibold text-[#09339B] mb-4">{hero.title}</h1>
          <h3 className="text-[#252525] text-[16px] md:text-[20px] xl:text-[24px]">{hero.subtitle}</h3>
        </div>
      </section>
    </>
  );
};

export default HeroSection_about;
