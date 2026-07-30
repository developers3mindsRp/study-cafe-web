import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Reviews_marketing = ({ data }: Props) => {

  // console.log(data,"testimonials")
  const testimonials = data.textTestimonials;
  if (!testimonials.length) return null;

  return (
    <section className="container mx-auto px-4 py-8 overflow-hidden">
      <h2 className="text-center text-[30px] md:text-[40px] mb-8 uppercase">
        What our Course Attendees Say
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="min-w-[280px] md:min-w-[320px] snap-start bg-[#1A1C26] rounded-lg p-6 flex-shrink-0"
          >
            <p className="text-white text-sm mb-4">{item.quote}</p>
            <p className="font-semibold">{item.name}</p>
            <p className="text-gray-400 text-sm">{item.role}</p>
            <div className="mt-2 text-yellow-400 text-sm">
              {"★".repeat(item.rating)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews_marketing;
