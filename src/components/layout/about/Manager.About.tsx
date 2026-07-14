import React from 'react';
import { useAboutPage } from '@/contexts/AboutPageContext';

const Manager_about = () => {
  const { managers } = useAboutPage();

  return (
    <>
      <section className="py-4 container px-4 mx-auto">
        <div>
          <h1 className="text-[25px] font-bold text-center">{managers.sectionTitle}</h1>

          <div className="mt-10 md:mt-6 md:p-6">
            <div className="flex overflow-x-auto gap-4 md:hidden pb-2 snap-x snap-mandatory scrollbar-hide">
              {managers.members.map((member) => (
                <div
                  key={member.name}
                  className="min-w-[75%] snap-start flex-shrink-0 border p-4 rounded-lg bg-white"
                >
                  
                  <div className='w-full h-[250px] block md:hidden relative'>
                    <img src={member.image} alt={member.name}  className='absolute w-full h-full object-cover'/>
                  </div>
                 
                  <img src={member.image} alt={member.name}  className='hidden md:block'/>

                  <div className="flex justify-between items-center mt-2">
                    <h1 className="text-[16px] font-bold text-[#111318]">{member.name}</h1>

                    <div className="flex gap-2">
                      <a href={member.social?.instagram || '#'} target="_blank" rel="noopener noreferrer">
                        <img src="/images/insta.png" className="w-4 h-4" alt="Instagram" />
                      </a>
                      <a href={member.social?.twitter || '#'} target="_blank" rel="noopener noreferrer">
                        <img src="/images/x.png" className="w-4 h-4" alt="Twitter" />
                      </a>
                      <a href={member.social?.linkedin || '#'} target="_blank" rel="noopener noreferrer">
                        <img src="/images/linkedin.svg" className="w-4 h-4" alt="LinkedIn" />
                      </a>
                    </div>
                  </div>

                  <span className="text-[14px] text-[#616F89] mt-2">{member.role}</span>
                </div>
              ))}
            </div>

            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
              {managers.members.map((member) => (
                <div key={member.name} className="flex flex-col border p-6 rounded-lg bg-white">
                  <img src={member.image} alt={member.name} />

                  <div className="flex justify-between items-center mt-2">
                    <h1 className="xl:text-[18px] font-bold text-[#111318]">{member.name}</h1>

                    <div className="flex gap-2">
                      <a href={member.social?.instagram || '#'} target="_blank" rel="noopener noreferrer">
                        <img src="/images/insta.png" className="w-4 h-4" alt="Instagram" />
                      </a>
                      <a href={member.social?.twitter || '#'} target="_blank" rel="noopener noreferrer">
                        <img src="/images/x.png" className="w-4 h-4" alt="Twitter" />
                      </a>
                      <a href={member.social?.linkedin || '#'} target="_blank" rel="noopener noreferrer">
                        <img src="/images/linkedin.svg" className="w-4 h-4" alt="LinkedIn" />
                      </a>
                    </div>
                  </div>

                  <span className="text-[14px] text-[#616F89] mt-2">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Manager_about;
