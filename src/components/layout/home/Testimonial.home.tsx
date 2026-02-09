const testimonials = [
  {
    message:
      "StudyCafe transformed my career! The courses are practical, well-organized, well-structured, and the instructors are incredibly knowledgeable.",
    name: "Rahul Verma",
    role: "Software Developer",
    rating: 5,
  },
  {
    message:
      "What I love most  is the simplicity of learning. The dashboard is easy to use, courses are well-organized, and progress tracking keeps me motivated.",
    name: "Neha Sharma",
    role: "CA Intermediate Aspirant",
    rating: 5,
  },
  {
    message:
      "StudyCafe offers high-quality content with real-world insights. The learning experience feels premium, and the material is extremely well explained.",
    name: "Priya Jain",
    role: "MBA Student",
    rating: 5,
  },
  {
    message:
      "StudyCafe offers high-quality content with real-world insights. The learning experience feels premium, and the material is extremely well explained.",
    name: "Priya Jain",
    role: "MBA Student",
    rating: 5,
  },
  {
    message:
      "StudyCafe offers high-quality content with real-world insights. The learning experience feels premium, and the material is extremely well explained.",
    name: "Priya Jain",
    role: "MBA Student",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className=" mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-[30px] md:text-[40px] font-semibold text-gray-900">
          What Our Students Say
        </h2>
        <p className="mt-3 text-[#454545] text-[16px] md:text-[24px] px-6 md:px-0">
          Don't just take our word for it - hear from thousands of <br className="hidden md:block" />
          satisfied students
        </p>

        {/* Cards */}
        <div className="mt-2 md:mt-14 marquee-wrapper">
          {/* Mobile slider */}
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden mt-4 pb-4 px-2 scrollbar-hide  pt-8 marquee ">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="w-[250px] snap-center flex-shrink-0 relative border border-[#17254E] rounded-xl p-4 text-left"
              >
                {/* Quote */}
                <img
                  src="/images/quote.png"
                  alt="quote"
                  className="absolute -top-4 z-10 -left-2 w-10 h-6  "
                />

                {/* Message */}
                <p className="text-[#696969] text-[10px]  mt-2 leading-relaxed ">
                  {item.message}
                </p>

                {/* User + Rating Row */}
                <div className=" flex items-center justify-between mt-6">
                  {/* Left: Name & Role */}
                  <div className="">
                    <h4 className="mb-1 font-semibold text-gray-900 text-[16px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.name}
                    </h4>
                    <p className="text-[#09339B] text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.role}
                    </p>
                  </div>

                  {/* Right: Rating */}
                  <div className="flex gap-1 mt-6">
                    {Array(item.rating)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i}><img src="/images/icons/star.svg" alt="" /></span>
                      ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Desktop grid */}
   
   <div className="hidden md:block overflow-hidden pt-8 pl-6 marquee-wrapper">
  <div className="flex gap-8 w-max marquee-track">
    {[...testimonials, ...testimonials].map((item, index) => (
      <div
        key={index}
        className="marquee-card relative border border-[#17254E] rounded-xl p-6 text-left min-w-[360px] max-w-[400px] flex-shrink-0"
      >
        {/* Quote */}
        <img
          src="/images/quote.png"
          alt="quote"
          className="absolute -top-6 -left-2 w-14 h-10"
        />

        <p className="text-[#696969] text-[20px] mt-2 leading-relaxed">
          {item.message}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 text-[30px]">
              {item.name}
            </h4>
            <p className="text-[#09339B] text-[17px]">{item.role}</p>
          </div>

          <div className="flex gap-1 mt-10">
            {Array(item.rating)
              .fill(0)
              .map((_, i) => (
                <img
                  key={i}
                  src="/images/icons/star.svg"
                  className="w-4 h-4"
                />
              ))}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


        </div>
      </div>
    </section>
  );
}
