const testimonials = [
    {
        images: "/images/t1.png",

    },
    {
        images: "/images/t2.png",
    },
    {
        images: "/images/t3.jpg",
    },


];

export default function Testimonials_marketing() {
    return (
        <section className=" ">
            <div className="  ">
                {/* Heading */}
                <h2 className="text-[30px] xl:text-[40px] font-semibold uppercase text-center mb-2">
                   Testimonials
                </h2>


                {/* Cards */}
                <div className="">
                    {/* Mobile slider */}
                    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden md:mt-4 md:pb-4 px-2 scrollbar-hide mb-12">
                        {testimonials.map((item, index) => (
                            <div
                                key={index}
                                className="w-[250px] snap-center flex-shrink-0 text-left "
                            >

                                <div className="mt-6 relative  flex items-center justify-between">
                                    {/* Image */}
                                    <img
                                        src={item.images}
                                        alt=""
                                        className="object-cover w-full h-[210px] rounded-lg gap-6"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0   flex items-center justify-center rounded-lg">
                                        <button className="bg-black w-12 h-12 flex items-center justify-center rounded-full">
                                            <span className="text-[white] text-[20px] ">▶</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Desktop grid */}

                    <div className="hidden md:block overflow-hidden relative ">
                        <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused]">

                            {[...testimonials, ...testimonials].map((item, index) => (
                                <div
                                    key={index}
                                    className="md:min-w-[350px] xl:min-w-[460px] relative"
                                >
                                    <div className="mt-6 relative flex items-center justify-between">
                                        {/* Image */}
                                        <img
                                            src={item.images}
                                            alt=""
                                            className="object-fit w-full h-[280px] rounded-lg"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                                            <button className="bg-black w-16 h-16 flex items-center justify-center rounded-full">
                                                <span className="text-white text-[30px]">▶</span>
                                            </button>
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
