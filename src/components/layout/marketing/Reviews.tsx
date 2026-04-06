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

export default function Reviews_marketing() {
    return (
        <section className="py-4 xl:py-20 ">
            <div className=" mx-auto px-4 text-center">
                {/* Heading */}
                <h2 className="text-[30px] xl:text-[40px] font-semibold uppercase">
                    What our Course Attendees Say
                </h2>
               

                {/* Cards */}
                <div className="mt-2 md:mt-14 marquee-wrapper">
                    {/* Mobile slider */}
                    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden mt-4 pb-4 px-2 scrollbar-hide  pt-8 ">
                        {testimonials.map((item, index) => (
                            <div
                                key={index}
                                className="w-[250px] snap-center flex-shrink-0 relative border border-[#17254E] rounded-xl p-4 text-left bg-[#292738]"
                            >
                                {/* Quote */}
                                <img
                                    src="/images/quote.png"
                                    alt="quote"
                                    className="absolute -top-4 z-10 -left-2 w-10 h-6  "
                                />

                                {/* Message */}
                                <p className="text-white text-[12px]  mt-2 leading-relaxed ">
                                    {item.message}
                                </p>

                                {/* User + Rating Row */}
                                <div className=" flex items-center justify-between mt-6">
                                    {/* Left: Name & Role */}
                                    <div className="">
                                        <h4 className="mb-1 font-semibold  text-[16px] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {item.name}
                                        </h4>
                                        <p className=" text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
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

                    <div className="hidden md:block overflow-hidden pt-8 pl-6 ">
                        <div className="flex gap-8 w-max ">
                            {[...testimonials, ...testimonials].map((item, index) => (
                                <div
                                    key={index}
                                    className="marquee-track bg-[#292738] relative border border-[#17254E] rounded-xl p-6 text-left md:min-w-[250px] md:max-w-[350px] xl:min-w-[360px] xl:max-w-[400px] flex-shrink-0"
                                >
              

                                    <p className="text-white font-regular xl:text-[20px] mt-2 leading-relaxed">
                                        {item.message}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold  text-[28px]">
                                                {item.name}
                                            </h4>
                                            <p className=" text-[17px]">{item.role}</p>
                                        </div>

                                        <div className="flex gap-1 mt-10  bg-[#4E4B65] p-2 rounded-full">
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
