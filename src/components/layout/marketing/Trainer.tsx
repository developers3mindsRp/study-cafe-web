import Image from "next/image";

export default function Trainer_marketing() {
    return (
        <section>
            {/* Heading */}
            <div className="text-white text-center py-4 mb-6 md:mb-10">
                <h2 className="text-[30px] md:text-[40px] font-semibold tracking-wide">
                    KNOW YOUR TRAINER
                </h2>
            </div>

            {/* Main Content */}
            <div className="bg-white py-6 md:py-10">
                <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 
                    grid grid-cols-1 md:grid-cols-2 
                    gap-8 md:gap-12 items-center">

                    {/* Left Image */}
                    <div className="w-full flex justify-center">
                        <div className="rounded-xl overflow-hidden w-full max-w-[500px]">
                            <Image
                                src="/images/trainer.svg"
                                alt="Trainer"
                                width={500}
                                height={500}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div>

                        {/* Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 text-black">

                            {[
                                "350K+ Followers",
                                "Co-founder of Studycafe",
                                "ICAI AICA Certified",
                                "Trained 30,000+ Participants"
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 border border-green-400 
                         rounded-lg px-3 py-2 xl:px-4 xl:py-2 bg-white"
                                >
                                    <img src="/images/tick1.png" alt="" className="w-5 h-5" />
                                    <p className="text-[14px] xl:text-[16px] font-semibold">
                                        {item}
                                    </p>
                                </div>
                            ))}

                        </div>

                        {/* Description */}
                        <ul className="space-y-3 md:space-y-4 text-black 
                       text-[14px] md:text-[14px] xl:text-[18px] 
                       leading-relaxed list-disc pl-5">

                            <li>
                                Deepak Gupta is a highly <b>experienced Chartered Accountant</b> with over 15 years of professional expertise. He specializes in AI Tools, Chat GPT, Microsoft Excel, PowerPoint, Excel Dashboard.
                            </li>

                            <li>
                                Deepak is a <b>co-founder of Studycafe</b>, an educational platform that aims to empower students and professionals through comprehensive training programs.
                            </li>

                            <li>
                                Throughout his career, Deepak has <b>worked with renowned companies</b> such as Wipro, Hero, and Ericsson.
                            </li>

                            <li>
                                With an impressive track record, Deepak has <b>trained over 30,000 students</b>.
                            </li>

                            <li>
                                He is a recognized <b>Influencer</b> with 300K+ followers on social media.
                            </li>

                        </ul>

                    </div>
                </div>
            </div>
        </section>

    );
}
