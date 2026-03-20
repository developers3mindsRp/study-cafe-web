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
    {
        images: "/images/g1.png",
    },
    {
        images: "/images/g2.png",
    },

];

export default function Gallery_marketing({ showHeading = true }) {
    return (
        <section className=" py-4 mt-4">
            {/* Heading */}
            {showHeading && (
                <h2 className="text-center text-[30px] md:text-[40px] uppercase font-semibold">
                    Photo Gallery
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
                                    className="w-[350px] md:w-[350px] h-[350px] md:h-[350px] object-cover rounded-lg mb-8"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
