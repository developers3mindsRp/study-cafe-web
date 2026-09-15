import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

const Leader_about = () => {
  const { leadership } = useAboutPage();

  return (
    <>
      <section className="md:py-4">
        <div className="container mx-auto md:pt-4  md:pb-12 w-full px-4 text-left grid grid-cols-1 md:grid-cols-2 gap-8 ">
          <div className="text-center items-center mt-8 md:mt-24">
            <h1 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-4">{leadership.title}</h1>
            <p className="text-[24px] text-[#454545]">{leadership.subtitle}</p>
          </div>

          <div className="rounded-lg  bg-white grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 mx-auto">
            {leadership.leaders.map((leader) => (
              <div key={leader.name} className="flex flex-col  rounded-full mb-4">
                {/* Capped rather than fixed, so a third leader shrinks to fit its
                    column instead of spilling out of it. */}
                <img src={leader.image} alt="" className="w-full md:max-w-[350px]" />
                <div className="flex justify-between pr-4 mt-2">
                  <h1 className="text-[18px] xl:text-[25px] font-medium text-[#454545]">{leader.name}</h1>
                  {leader.linkedin ? (
                    <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${leader.name} on LinkedIn`}>
                      <img src="/images/linkedin.svg" alt="" className="w-4 h-4 xl:w-6 xl:h-6 mt-2 xl:mt-3" />
                    </a>
                  ) : (
                    <img src="/images/linkedin.svg" alt="" className="w-4 h-4 xl:w-6 xl:h-6 mt-2 xl:mt-3 opacity-60" />
                  )}
                </div>
                <span className="xl:text-[20px] text-[#454545]">{leader.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Leader_about;
