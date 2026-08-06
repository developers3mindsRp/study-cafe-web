import { PublicLayout } from "@/components/layout";
import React, { useState } from "react";
import type { FAQ } from "@/types/models.types";
import { motion, AnimatePresence } from "framer-motion";


const FALLBACK_FAQS: FAQ[] = [
  { id: '1', question: "Is Studycafe a Legal Company?", answer: "Yes, it is legal company. You can find Studycafe Private Limited on the official website of the Ministry of Corporate Affairs, and you can check the registration details on the same." },
  {id: '2', question: "What are the Application Criteria?", answer:"There are no requirements to apply with us. It does not necessitate any prior knowledge or educational qualification. You only need your phone or Laptop to find out the information."},
  {id: '3', question: "Are there any fees to join the Studycafe affiliate program?",answer:"No there is no Fees to Join Studycafe affiliate program."},
  {id: '4', question: "How can I track my affiliate earnings and performance?",answer:"Our state-of-the-art tracking system ensures that you receive credit for all the traffic and conversions generated through your affiliate efforts. You can monitor your performance in real-time in My Account page under earning section and see how your efforts translate into earnings."},
  {id: '5', question: "How Much Revenue we will Earn through Studycafe Affiliate Program?",answer:"Every time someone clicks on your affiliate link and makes a purchase on Studycafe through your link, you earn a commission. The more successful referrals you make, the higher your earnings potential. Studycafe offers competitive commission rates, allowing you to earn from 25% to 50% on each sale."},
  {id:'6',question:"When and how do affiliates get paid from Studycafe Affiliate Program?", answer:"Studycafe pays out commissions on a regular basis, ensuring that you receive your earnings promptly and hassle-free. This extra income can be a valuable addition to your financial resources. Once your consolidated earning reaches Rs. 1000 we will make the payout." }
];

interface FAQSectionProps {
  faqs?: FAQ[];
}
export default function Affiliates() {
     const faqs =  FALLBACK_FAQS;
    
      const [openIndex, setOpenIndex] = useState<number | null>(null);
    return(        
        <PublicLayout>
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-6">Studycafe Affiliate Program</h1>
                <p className="mb-4 text-[16px]">
                   <b>Unlock Earnings and Empower Education with the Studycafe Affiliate Program</b> 
                    <br />In today’s digital age, online learning has become an integral part of our personal and professional growth. It provides unparalleled access to knowledge and skills that can transform lives and careers. Studycafe, a leading online education platform, recognizes the importance of quality education and is committed to making it accessible to as many people as possible. To further this mission, Studycafe has launched its Affiliate Program, an exciting opportunity for individuals to not only enhance their own education but also 
                    <b>earn commissions of up to 40%</b>.
                </p>
                <b>The Studycafe Affiliate Program</b>
                <p className="mb-4 text-[16px]">The Studycafe Affiliate Program is designed to reward those who share our passion for education. Here’s how it works:</p>
                <p className="mb-4 text-[16px]"><strong>1. Joining the Program:</strong> Becoming a Studycafe affiliate is a straightforward process. Interested individuals can sign up for the program through our website. Affiliates gain access to a range of Courses Links in the My Account Section to kickstart their promotional efforts.</p>
                <p className="mb-4 text-[16px]"><strong>2. Promote Studycafe Courses:</strong> As affiliates, you will have access to a wide variety of promotional materials, including banners, text links, and course information. Your role is to share these Courses Links across your social networks, blogs, websites, or through other marketing channels.</p>
                <p className="mb-4 text-[16px]"><strong>Why Choose the Studycafe Affiliate Program</strong></p>
                <p className="mb-4 text-[16px]">There are several compelling reasons to consider joining the Studycafe Affiliate Program:</p>
                <p className="mb-4 text-[16px]"><strong>1. High-Quality Courses:</strong> Studycafe offers a vast library of courses that cover in-demand topics, ensuring that you are promoting valuable content that appeals to a broad audience.</p>
                <p className="mb-4 text-[16px]"><strong>2. Lucrative Commissions:</strong> With the potential to earn up to 50% in commissions, the Studycafe Affiliate Program stands out as a high-earning opportunity in the affiliate marketing space.</p>
                <p className="mb-4 text-[16px]"><strong>3. Diverse Marketing Materials:</strong> We provide a range of customized linking tools and resources to help you effectively promote our courses, making it easier for you to succeed as an affiliate.</p>
                <p className="mb-4 text-[16px]"><strong>4. Real-Time Tracking:</strong> Our tracking system provides transparency and accountability, allowing you to see the direct impact of your promotional efforts.</p>
                <p className="mb-4 text-[16px]"><strong>5. Supportive Community:</strong> Join a community of like-minded affiliates who share your passion for education and self-improvement. Connect, learn, and grow together.</p>
                <p className="mb-4 text-[16px]"><strong>Conclusion</strong>The Studycafe Affiliate Program offers an exciting chance to earn while empowering others through education. By joining our program, you become an integral part of our mission to make quality education accessible to all. Whether you're a seasoned affiliate marketer or someone new to the world of affiliate programs, Studycafe welcomes you to be a part of our educational journey. Start promoting our courses, share the gift of knowledge, and unlock your potential for financial success with Studycafe's Affiliate Program. Together, we can make a significant impact on education and professional development. Join us today and Become an entrepreneur with us today!</p>
            </div>
                <section className="container mx-auto px-4 py-2 mb-8">
                    <div className="grid md:grid-cols-1 gap-2">
                        <div>
                            <h3 className="text-2xl mb-6">Our Products</h3>
                            <div className="mb-6">
                                <a className="mgt10 mgl10 bg-[#fff] text-[#09339B] border border-[#09339B] p-4 md:px-4 xl:px-4 py-2 rounded-md bold" title="Online Courses" href="https://studycafe.in/courses/">Online Courses</a>
                                <a className="mgt10 mgl10 bg-[#09339B] text-white border border-[#09339B] p-4 md:px-4 xl:px-4 py-2 rounded-md bold ml-2" title="StudyCafe Membership" href="https://studycafe.in/plans/">StudyCafe Membership</a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl mb-6">Become a StudyCafe Affiliate Partner</h3>
                            <div>
                                <a className="bg-[#fff] text-[#09339B] border border-[#09339B] p-4 md:px-4 xl:px-4 py-2 rounded-md" href="https://studycafe.in/user/register.php">Register Now</a> 
                                <a className="bg-[#09339B] text-white p-4 md:px-4 xl:px-4 py-2 rounded-md ml-4" href="https://studycafe.in/wp-login.php">Login</a>
                            </div>

                        </div>
                    </div>
                    
                    
                </section>   
                <section className="container mx-auto px-4 py-2 mb-8"> 
                     <h3 className="text-2xl mb-6">Top Selling Courses</h3>
                    <div className="grid md:grid-cols-3 gap-10">
                        <a href="/course/certification-course-on-ai-powered-ca-practice-automation">
                            <div className="bg-white shadow-md rounded-md overflow-hidden h-full">
                                <div className="relative">
                                    <img
                                        src="https://assets.studycafe.in/uploads/2026/07/1785226334038-qt4w8nis.jpeg"
                                        alt="Certification Course on AI-Powered CA Practice Automation"
                                        width="100%"
                                        className="w-full h-[250px] sm:h-[180px] md:h-[200px] xl:h-[280px]"
                                    /><span
                                        className="absolute flex gap-1 top-2 right-4 bg-white px-2 py-1 rounded-full text-sm shadow font-normal mt-2"
                                        ><img src="/images/icons/star.svg" alt="" className="w-4 h-4 mt-1" />
                                        4.7</span>
                                </div>
                                <div className="p-3">
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-4 text-[#6a6969] text-[14px] md:text-[16px]">
                                            <span className="flex items-center gap-1"
                                                ><img src="/images/clock-02.svg" alt="" width="20" height="20" />2 hr</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[#6a6969] text-[14px] md:text-[16px] ml-4">
                                            <span className="flex items-center gap-1"
                                                ><img src="/images/eng-dark.svg" alt="" width="20" height="20" />English</span>
                                        </div>
                                    </div>
                                    <h3 className="text-[16px] xl:text-[26px] font-normal text-[#252525] mt-2 mb-2 line-clamp-2 md:h-20">
                                        Certification Course on AI-Powered CA Practice Automation
                                    </h3>
                                    <div className="flex items-center gap-2 text-[#6a6969] text-[14px] md:text-[16px]">
                                        <img src="/images/user-dark.svg" alt="" width="20" height="20" />592
                                        students
                                    </div>
                                    <div className="flex justify-between items-center mt-2 md:mt-4">
                                        <div>
                                            <span className="line-through text-gray-400 xl:text-[26px]">₹ 1,999</span>
                                            <span className="text-[#252525] font-normal text-[16px] xl:text-[26px] ml-2">₹ 0</span>
                                        </div>
                                        <button className="bg-[#09339B] text-white p-4 md:px-4 xl:px-4 py-2 rounded-md">View Course</button>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                </section>
                <section className="container mx-auto px-4 py-2 mb-8">
                    <h3 className="text-2xl mb-6">Comission Slab by Membership Level</h3>
                    <div className="table-responsive">
                        <table className="w-full border-collapse bg-white shadow-sm rounded-lg border-l border-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-center md:sticky left-0 bg-gray-100 z-10">Plan Name</th>
                                    <th className="py-3 px-4 text-center md:sticky left-0 bg-gray-100 z-10">Commission</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-300">
                                    <td className="py-3 font-medium text-[#252525] text-[16px] text-center md:sticky left-0 bg-white z-10 border-r border-gray-300">Free Members</td>
                                    <td className="py-3 font-medium text-[#252525] text-[16px] text-center md:sticky left-0 bg-white z-10 border-r border-gray-300">20%</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="py-3 font-medium text-[#252525] text-[16px] text-center md:sticky left-0 bg-white z-10 border-r border-gray-300">Basic Members</td>
                                    <td className="py-3 font-medium text-[#252525] text-[16px] text-center md:sticky left-0 bg-white z-10 border-r border-gray-300">25%</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="py-3 font-medium text-[#252525] text-[16px] text-center md:sticky left-0 bg-white z-10 border-r border-gray-300">Premium Members</td>
                                    <td className="py-3 font-medium text-[#252525] text-[16px] text-center md:sticky left-0 bg-white z-10 border-r border-gray-300">30%</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="py-3 font-medium text-[#252525] text-[16px] text-center md:sticky left-0 bg-white z-10 border-r border-gray-300">Ultimate Members</td>
                                    <td className="py-3 font-medium text-[#252525] text-[16px] text-center md:sticky left-0 bg-white z-10 border-r border-gray-300">40%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <section className="container mx-auto px-4 py-2 mb-8">
                    <h3 className="text-2xl mb-6">Become a StudyCafe Affiliate Partner</h3>
                    <div>
                        <a className="bg-[#fff] text-[#09339B] border border-[#09339B] p-4 md:px-4 xl:px-4 py-2 rounded-md" href="https://studycafe.in/user/register.php">Register Now</a> 
                        
                        <a className="bg-[#09339B] text-white p-4 md:px-4 xl:px-4 py-2 rounded-md ml-4" href="https://studycafe.in/wp-login.php">Login</a>
                    </div>
                </section>   
                <section  className="container mx-auto px-4 py-2 mb-8">
                    <h3 className="text-2xl mb-6">Top Earners</h3>
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="border border-[#ddd] p-[20px_20px] rounded-[10px]">
                            <div >
                                <div className="profile-caption">
                                    <h2>Shabir Virk</h2>
                                    <p className="mb-4 text-[16px]">Finance Professional</p>
                                    <div className="course-profile-img">
                                        <img src="https://studycafe.in/wp-content/uploads/2023/11/Shabir-Virk.jpg" alt="Shabir Virk" />
                                    </div>
                                    <div className="profile-details">
                                        <p className="mb-4 text-[16px]">
                                            I was skeptical at first about affiliate marketing, but after signing up for Studycafe
                                            affiliate program, I was pleasantly surprised at how easy it was to get started and start
                                            earning money. My first month, I made over Rs. 40,000, and I've been making consistently
                                            over 50,000 per month ever since. I highly recommend Studycafe affiliate program to anyone
                                            looking to make a serious income online.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border border-[#ddd] p-[20px_20px] rounded-[10px]">
                            <div >
                                <div className="profile-caption">
                                    <h2>Prabhat</h2>
                                    <p className="mb-4 text-[16px]">CA Final</p>
                                    <div className="course-profile-img">
                                        <img src="https://studycafe.in/wp-content/uploads/2023/11/Prabhat-Goyal.jpg" alt="Prabhat" />
                                    </div>
                                    <div className="profile-details">
                                        <p className="mb-4 text-[16px]">
                                            I am CA Final Student, but I've never made as much money as I have since joining Studycafe
                                            affiliate program. The team is incredibly supportive and helpful, and the affiliate program
                                            is very generous. I've made over Rs. 50,000 each month for the past few months, and I'm on
                                            track to make even more this month. If you're looking for an affiliate program that can help
                                            you achieve your financial goals, look no further than Studycafe affiliate program.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border border-[#ddd] p-[20px_20px] rounded-[10px]">
                            <div >
                                <div className="profile-caption">
                                    <h2>Monika</h2>
                                    <p className="mb-4 text-[16px]">CA</p>
                                    <div className="course-profile-img">
                                        <img src="" alt="Monika" />
                                    </div>
                                    <div className="profile-details">
                                        <p className="mb-4 text-[16px]">
                                            I was looking for a way to make money while I'm in working. I tried a few different
                                            affiliate programs, but they all required a lot of upfront investment. Then I joined
                                            Studycafe affiliate program. It's completely free to join, and I've been making over Rs.
                                            50,000 per month without having to spend a dime. Studycafe affiliate program is the best way
                                            to make money online.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section  className="bg-[url('/images/alumini-bg.png')] bg-no-repeat bg-cover py-3 md:py-12 px-4 md:px-8 pb-8 md:pb-20 mb-8">
                    <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium text-center mb-6 text-white px-2 mt-4">
                        Featured In
                    </h2>
                    <div className="container mx-auto px-2 md:px-0">
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-10">
                            <div className="col-md-2">
                                <div className="card user-card">
                                    <div className="card-block">
                                        <div className="bg-white p-[15px] rounded-[10px]">
                                            <a
                                                target="_blank"
                                                title="Featured In Studycafe Courses Unveils Premier ChatGPT Program: Shaping the Next Generation of Students and Professionals"
                                                href="https://www.hindustantimes.com/brand-stories/studycafe-courses-unveils-premier-chatgpt-program-shaping-the-next-generation-of-students-and-professionals-101698658445763.html"
                                            >
                                                <img
                                                    src="https://old.studycafe.in/wp-content/uploads/2023/10/ht-media_1.png"
                                                    className="img-radius"
                                                    alt="Featured In Studycafe Courses Unveils Premier ChatGPT Program: Shaping the Next Generation of Students and Professionals"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="card user-card">
                                    <div className="card-block">
                                        <div className="bg-white p-[15px] rounded-[10px]">
                                            <a
                                                target="_blank"
                                                title="Featured In Studycafe Courses Unveils Premier ChatGPT Program: Shaping the Next Generation of Students and Professionals"
                                                href="https://www.lokmattimes.com/business/studycafe-courses-unveils-premier-chatgpt-program-shaping-the-next-generation-of-students-and/"
                                            >
                                                <img
                                                    src="https://old.studycafe.in/wp-content/uploads/2023/10/Lt-media.png"
                                                    className="img-radius"
                                                    alt="Featured In Studycafe Courses Unveils Premier ChatGPT Program: Shaping the Next Generation of Students and Professionals"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="card user-card">
                                    <div className="card-block">
                                        <div className="bg-white p-[15px] rounded-[10px]">
                                            <a
                                                target="_blank"
                                                title="Featured In Studycafe Launches Practical GST Return Filing program"
                                                href="https://aninews.in/news/business/business/studycafe-launches-practical-gst-return-filing-program20230113170807/"
                                            >
                                                <img
                                                    src="https://old.studycafe.in/wp-content/uploads/2023/03/ANI.png"
                                                    className="img-radius"
                                                    alt="Featured In Studycafe Launches Practical GST Return Filing program"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="card user-card">
                                    <div className="card-block">
                                        <div className="bg-white p-[15px] rounded-[10px]">
                                            <a
                                                target="_blank"
                                                title="Featured In Studycafe Launches Practical GST Return Filing program"
                                                href="https://theprint.in/ani-press-releases/studycafe-launches-practical-gst-return-filing-program/1313085/"
                                            >
                                                <img
                                                    src="https://old.studycafe.in/wp-content/uploads/2023/03/The-Print.png"
                                                    className="img-radius"
                                                    alt="Featured In Studycafe Launches Practical GST Return Filing program"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="card user-card">
                                    <div className="card-block">
                                        <div className="bg-white p-[15px] rounded-[10px]">
                                            <a
                                                target="_blank"
                                                title="Featured In Studycafe Launches Practical GST Return Filing program"
                                                href="https://www.zee5.com/articles/studycafe-launches-practical-gst-return-filing-program"
                                            >
                                                <img
                                                    src="https://old.studycafe.in/wp-content/uploads/2023/08/Zee5_Official_logo.svg_.png"
                                                    className="img-radius"
                                                    alt="Featured In Studycafe Launches Practical GST Return Filing program"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="card user-card">
                                    <div className="card-block">
                                        <div className="bg-white p-[15px] rounded-[10px]">
                                            <a
                                                target="_blank"
                                                title="Featured In Studycafe Launches Practical GST Return Filing program"
                                                href="https://m.dailyhunt.in/news/india/english/ani+english-epaper-anieng/studycafe+launches+practical+gst+return+filing+program-newsid-n461748852?sm=Y"
                                            >
                                                <img
                                                    src="https://old.studycafe.in/wp-content/uploads/2023/08/Dailyhunt.png"
                                                    className="img-radius"
                                                    alt="Featured In Studycafe Launches Practical GST Return Filing program"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   

                </section>
                
                <section className=" text-center   mb-8">
                    <div className="container mx-auto px-2 md:px-0">
                        <h2 className="text-[32px] xl:text-[40px] font-semibold text-[#1A1A1A]">Frequently
                            Asked Questions</h2>
                        <p className="text-[16px] xl:text-[24px] text-[#454545] mt-3">
                            Got questions? We've got answers. Find everything you need to
                            know about StudyCafe.
                        </p>

                        <div className="text-left py-[25px]">
                            {faqs.map((item, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div
                                key={item.id ?? index}
                                className="border border-[#AFAFAF] rounded-lg overflow-hidden mb-2"
                                >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex justify-between items-start gap-3 p-4 bg-white"
                                >
                                    <span className="flex-1 font-medium md:text-[18px] xl:text-[20px] text-black text-left leading-[140%]">
                                    {index + 1}. {item.question}
                                    </span>

                                    <motion.svg
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-5 h-5 flex-shrink-0 mt-1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                    </motion.svg>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-3 xl:text-[16px] text-[#3a3c3e] leading-relaxed border-t bg-white">
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: item.answer }}
                                        />
                                        </div>
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                                </div>
                            );
                            })}
                        </div>
                    </div>
                </section>
                <section className="mb-8">
                    <div className="container mx-auto  mt-10 px-2 md:px-0">
                        <h2 className=" text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4 px-4 py-3 text-white  bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto ">Founders</h2>
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className=" rounded p-2 md:p-3   bg-[#F9F9FB]">
                                <div className="flex flex-row items-center gap-6 md:gap-4 ml-6">
                                    <div className="w-[100px] h-[100px] rounded-full relative overflow-hidden">
                                    <img src="https://assets.studycafe.in/uploads/2023/10/Deepak-Gupta-Profile-Pic_1.jpg" alt="Deepak Gupta" className="absolute w-full h-full left-0 top-0"  />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-[18px] md:text-[20px] text-[#252525]">Deepak Gupta</h3>
                                        <h3 className="text-[#09339B] text-[16px] md:text-[20px]">Co Founder</h3>
                                    </div>
                                </div>
                                <hr className="m-4 border border-[#AFAFAF]" />
                                <div className="text-[#6C6C6C] text-[14px] md:text-[17px] mt-1 leading-[32px] m-6 font-light">
                                    <a className="flex items-center" target="_blank" title="Deepak Gupta Linkedin" href="https://www.linkedin.com/in/deepak-gupta-33789936/"><img src="/images/icons/linkedin.svg" alt="LinkedIn" className="mr-2"/> /deepak-gupta</a>
                                </div>
                            </div>
                            <div className=" rounded p-2 md:p-3   bg-[#F9F9FB]">
                                <div className="flex flex-row items-center gap-6 md:gap-4 ml-6">
                                    <div className="w-[100px] h-[100px] rounded-full relative overflow-hidden">
                                    <img src="https://old.studycafe.in/wp-content/uploads/2023/10/CA-Pratibha-Goyal-Profile-Pic.png" alt="Deepak Gupta" className="absolute w-full h-full left-0 top-0"  />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-[18px] md:text-[20px] text-[#252525]">CA Pratibha Goyal</h3>
                                        <h3 className="text-[#09339B] text-[16px] md:text-[20px]">Co Founder</h3>
                                    </div>
                                </div>
                                <hr className="m-4 border border-[#AFAFAF]" />
                                <div className="text-[#6C6C6C] text-[14px] md:text-[17px] mt-1 leading-[32px] m-6 font-light">
                                    <a className="flex items-center" target="_blank" title="CA Pratibha Goyal Linkedin" href="https://www.linkedin.com/in/pratibha-goyal-269b27186/"><img src="/images/icons/linkedin.svg" alt="LinkedIn" className="mr-2"/> /pratibha-goyal</a>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="mb-8">
                    <div className="container mx-auto  mt-10 px-2 md:px-0">
                        <h3 className="text-2xl mb-6">Connect With Us</h3>
                        <p className="mb-4 text-[16px]"><strong>Address</strong><br/>
                        <strong>Studycafe Private Limited</strong><br/>
                        1003, 10th Floor, Modi Tower 98, Nehruplace
                        Delhi, 110019 - India
                        </p>
                        <strong className="block mb-4">Social Profiles</strong>
                        <div className="flex gap-4">
                            <a
                                href="https://x.com/studycafe_in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full flex items-center justify-center"
                                ><img src="/images/icons/x.svg" alt="Twitter" /></a
                            ><a
                                href="https://www.instagram.com/studycafe.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full flex items-center justify-center"
                                ><img src="/images/icons/insta.svg" alt="Instagram" /></a
                            ><a
                                href="https://www.linkedin.com/company/studycafe/?originalSubdomain=in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full flex items-center justify-center"
                                ><img src="/images/icons/linkedin.svg" alt="LinkedIn" /></a
                            ><a
                                href="https://www.facebook.com/Studycafe.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full flex items-center justify-center"
                                ><img src="/images/icons/fb.svg" alt="Facebook" /></a
                            ><a
                                href="https://www.youtube.com/@studycafeoriginal"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full flex items-center justify-center"
                                ><img src="/images/icons/yt.svg" alt="YouTube" /></a
                            ><a
                                href="https://t.me/studycafe_in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full flex items-center justify-center"
                                ><img src="/images/icons/telegram.svg" alt="Telegram"
                            /></a>
                        </div>

                    </div>      
                </section>



        
        </PublicLayout>
    )
}