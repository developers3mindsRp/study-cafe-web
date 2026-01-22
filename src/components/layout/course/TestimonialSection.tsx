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
    //   {
    //    images: "/images/t1.png",
    //   },

];

export default function Testimonials_course() {
    return (
        <section className=" bg-white container px-4 mx-auto pb-12 ">
            <div className=" mx-auto px-4 ">
                {/* Heading */}
                <h2 className="text-[30px] md:text-[40px] font-semibold text-gray-900">
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



                                {/* User + Rating Row */}
                                <div className=" flex items-center justify-between">
                                    {/* Left: Name & Role */}
                                    <div className="">

                                        <img src={item.images} alt="" className="object-cover" />
                                    </div>


                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Desktop grid */}
                    <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-3 gap-8">
                        {testimonials.map((item, index) => (
                            <div
                                key={index}
                                className=""
                            >



                                <div className="mt-6 flex items-center justify-between">

                                    <div>
                                        <img src={item.images} alt="" width="531" height="303"
                                            className="object-cover w-[530px] h-[303px] rounded-lg"
                                        />
                                    </div>


                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
