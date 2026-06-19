import type { Testimonial } from '@/types/models.types';
import { useState, useEffect, useRef } from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import "swiper/css";

const FALLBACK_TESTIMONIALS = [
  { id: '1', quote: 'StudyCafe transformed my career! The courses are practical, well-organized, well-structured, and the instructors are incredibly knowledgeable.', authorName: 'Rahul Verma', authorRole: 'Software Developer' },
  { id: '2', quote: 'What I love most is the simplicity of learning. The dashboard is easy to use, courses are well-organized, and progress tracking keeps me motivated.', authorName: 'Neha Sharma', authorRole: 'CA Intermediate Aspirant' },
  { id: '3', quote: 'StudyCafe offers high-quality content with real-world insights. The learning experience feels premium, and the material is extremely well explained.', authorName: 'Priya Jain', authorRole: 'MBA Student' },
];

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export default function Testimonials({ testimonials: testimonialsProp }: TestimonialsProps) {
  const testimonials = testimonialsProp && testimonialsProp.length > 0 ? testimonialsProp : FALLBACK_TESTIMONIALS;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showButton, setShowButton] = useState<{ [key: number]: boolean }>({});
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  useEffect(() => {
    const newShowButton: { [key: number]: boolean } = {};

    textRefs.current.forEach((el, i) => {
      if (el) {
        newShowButton[i] = el.scrollHeight > el.clientHeight;
      }
    });

    setShowButton(newShowButton);
  }, [testimonials]);



  return (
    <section className="py-12 xl:py-18 bg-white">
      <div className=" mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-[30px] xl:text-[40px] font-semibold text-gray-900">
          What Our Students Say
        </h2>
        <p className="mt-3 text-[#454545] text-[16px] md:text-[20px] xl:text-[24px] px-6 md:px-0">
          Don't just take our word for it - hear from thousands of <br className="hidden md:block" />
          satisfied students
        </p>

        {/* Cards */}
        <div className="mt-2 md:mt-14 marquee-wrapper">
          {/* Mobile slider */}
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden mt-4 pb-4 px-2 scrollbar-hide pt-8">
            {testimonials.map((item, index) => (
              <div
                key={item.id ?? index}
                className="w-[250px] snap-center flex-shrink-0 relative border border-[#17254E] rounded-xl p-4 text-left flex flex-col justify-between"
              >
                <img src="/images/quote.png" alt="quote" className="absolute -top-4 z-10 -left-2 w-10 h-6" />
                <p className="text-[#696969] text-[12px] mt-2 leading-relaxed">{item.quote}</p>
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900 text-[16px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.authorName}
                    </h4>
                    <p className="text-[#09339B] text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.authorRole}
                    </p>
                  </div>
                  <div className="flex gap-1 mt-6">
                    {[1,2,3,4,5].map((i) => (
                      <span key={i}><img src="/images/icons/star.svg" alt="" /></span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop marquee */}
          <div className='max-w-7xl mx-auto md:px-4 md:pt-6 hidden md:block'>
            <Swiper           
              spaceBetween={30}
              slidesPerView={3}            
              speed={3000}            
               autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              
                modules={[Autoplay]}
              className="testimonial-swiper"
            >
              {[...testimonials, ...testimonials].map((item, index) => (
                <SwiperSlide
                  key={`${item.id ?? index}-${index}`}
                  className=""
                >
                  <div className="relative border border-[#17254E] rounded-xl p-6 text-left h-full flex flex-col justify-between">
                    {/* <img
                      src="/images/quote.png"
                      alt="quote"
                      className="absolute -top-6 -left-2 w-14 h-10"
                    /> */}

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <img
                          key={i}
                          src="/images/icons/star.svg"
                          className="w-4 h-4"
                          alt=""
                        />
                      ))}
                    </div>

                    <p className="text-[#3a3c3e] text-[14px] mt-2 leading-relaxed min-h-[117px]">
                      {item.quote}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-[18px]">
                          {item.authorName}
                        </h4>

                        <p className="text-[#09339B] text-[14px]">
                          {item.authorRole}
                        </p>
                      </div>

                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

{/*            
          <div className="hidden md:block overflow-hidden pt-8 pl-6 marquee-wrapper">
            <div className="flex gap-8 w-max marquee-track">
              {[...testimonials, ...testimonials].map((item, index) => (
                <div
                  key={`${item.id ?? index}-${index}`}
                  className="marquee-card relative border border-[#17254E] rounded-xl p-6 text-left md:min-w-[250px] md:max-w-[350px] xl:min-w-[360px] xl:max-w-[400px] flex-shrink-0 flex flex-col justify-between"
                >
                  <img src="/images/quote.png" alt="quote" className="absolute -top-6 -left-2 w-14 h-10" />
                  <div>
                    <p
                      ref={(el) => (textRefs.current[index] = el)}
                      className={`text-[#3a3c3e]  xl:text-[20px] mt-2 leading-relaxed ${expandedIndex === index ? "" : "line-clamp-4"
                        }`}
                    >
                      {item.quote}
                    </p>

                    {showButton[index] && (
                      <button
                        onClick={() =>
                          setExpandedIndex(expandedIndex === index ? null : index)
                        }
                        className="text-[#09339B] text-sm mt-2 font-medium"
                      >
                        {expandedIndex === index ? "Read less" : "Read more"}
                      </button>
                    )}
                  </div>


                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-[30px]">{item.authorName}</h4>
                      <p className="text-[#09339B] text-[17px]">{item.authorRole}</p>
                    </div>
                    <div className="flex gap-1 mt-10">
                      {[1,2,3,4,5].map((i) => (
                        <img key={i} src="/images/icons/star.svg" className="w-4 h-4" alt="" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
