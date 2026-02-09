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

export default function Testimonials_course() {
    return (
        <section className=" bg-white container px-4 mx-auto pb-12 ">
            <div className=" md:mx-auto  ">
                {/* Heading */}
                <h2 className="text-[20px] md:text-[40px] font-semibold  mb-6 md:mb-4
            px-4 py-3 text-white
           
            bg-gradient-to-r from-[#253D8E] to-transparent
            md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto" id='testimonials'>
                    Testimonials
                </h2>


                {/* Cards */}
                <div className="">
                    {/* Mobile slider */}
                    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden mt-4 pb-4 px-2 scrollbar-hide">
                        {testimonials.map((item, index) => (
                            <div
                                key={index}
                                className="w-[250px] snap-center flex-shrink-0 text-left"
                            >

                                <div className="mt-6 relative  flex items-center justify-between">
                                    {/* Image */}
                                    <img
                                        src={item.images}
                                        alt=""
                                        className="object-cover w-full h-full rounded-lg gap-6"
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
                        className="min-w-[460px] relative"
                    >
                        <div className="mt-6 relative flex items-center justify-between">
                        {/* Image */}
                        <img
                            src={item.images}
                            alt=""
                            className="object-cover w-full h-[280px] rounded-lg"
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
