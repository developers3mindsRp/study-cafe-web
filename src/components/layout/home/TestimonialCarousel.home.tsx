import type { Testimonial } from '@/types/models.types';

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';

import "swiper/css";

/**
 * The desktop (md+) autoplaying testimonial carousel.
 *
 * Split out of Testimonial.home.tsx so that Swiper — ~150 KB unminified and the
 * single heaviest first-party dependency on the homepage — is not part of initial
 * hydration. It is loaded with next/dynamic and ssr:false by the parent. The section
 * heading and the mobile scroll-snap list stay server-rendered in the parent, so the
 * testimonial text is still in the HTML and mobile (which never used Swiper) pays
 * nothing for it.
 */
interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  return (
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
  );
}
