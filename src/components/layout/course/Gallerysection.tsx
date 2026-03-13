const testimonials = [
  {
   images: "/images/g1.png",
   
  },
  {
   images: "/images/g2.png",
  },
  {
   images: "/images/g3.png",
  },
  {
   images: "/images/g4.png",
  },

];

export default function Gallery({ showHeading = true }) {
    return (
        <section className="bg-white py-4 mt-4">
            {/* Heading */}
            {showHeading && (
                <h2 className="text-[20px] md:text-[40px] font-medium 
        text-white md:text-gray-900
        bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none 
        px-4 md:px-8 md:container md:mx-auto 
        py-3 md:py-0 mx-4 md:mx-0">
                    Gallery
                </h2>
            )}

            <div>

                {/* Marquee */}
                <div className="marquee-wrapper mt-6 md:mt-10">
                    <div className="marquee gap-6">
                        {/* duplicate array for seamless loop */}
                        {[...testimonials, ...testimonials].map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0"
                            >
                                <img
                                    src={item.images}
                                    alt=""
                                    className="w-[350px] md:w-[350px] h-[350px] md:h-[350px] object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
  );
}
