export default function ContactInfo() {
    return (

    
       <div className="text-center mb-10 md:mt-10">
          <h1 className="text-[30px] md:text-[42px] 2xl:text-[62px] font-semibold text-[#09339B]">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-[18px] xl:text-[24px] p-4">
            Have questions? We'd love to hear from you. Send us a message and <br className="hidden md:block" />
            we'll respond as soon as possible.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-12 mt-6 xl:h-[320px]">

                {/* Email */}
                <div className="border border-[#9FBBFF] rounded-xl p-8 bg-white text-center hover:shadow-md transition flex flex-col justify-center bg-white">

                    <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full  mb-4 ">
                        <img src="/images/email1.svg" alt="" className="w-16 h-16" />
                    </div>

                    <h3 className="text-[20px] xl:text-[30px] font-medium text-[#252525] mb-2">Email</h3>

                    <p className="text-[16px] text-gray-600">support@studycafe.in</p>
                    <p className="text-[16px] text-gray-600">contact@studycafe.in</p>

                </div>


                {/* Phone */}
                <div className="border border-[#9FBBFF] rounded-xl p-8 bg-white text-center hover:shadow-md transition flex flex-col justify-center bg-white">

                    <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full  mb-4">
                        <img src="/images/phone1.svg" alt="" className="w-16 h-16" />
                    </div>

                    <h3 className="text-[20px] xl:text-[30px] font-medium text-[#252525] mb-2">Phone</h3>

                    <p className="text-[16px] text-gray-600">+91 9625080264</p>
                    {/* <p className="text-[16px] text-gray-600">+91 9625080264</p> */}

                </div>


                {/* Office */}
                <div className="border border-[#9FBBFF] rounded-xl p-8 bg-white text-center hover:shadow-md transition flex flex-col justify-center bg-white">

                    <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full  mb-4">
                        <img src="/images/map.svg" alt="" className="w-16 h-16" />
                    </div>

                    <h3 className="text-[20px] xl:text-[30px] font-medium text-[#252525] mb-2">Office</h3>

                    <p className="text-[16px] text-gray-600">
                        1003, 10th Floor, Madi Tower 98,<br className="hidden xl:block" />
                        Nehruplace Delhi, 110019 - India
                    </p>

                </div>


                {/* Working Hours */}
                <div className="border border-[#9FBBFF] rounded-xl p-8 bg-white text-center hover:shadow-md transition flex flex-col justify-center bg-white">

                    <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full  mb-4">
                        <img src="/images/clock.svg" alt="" className="w-16 h-16" />
                    </div>

                    <h3 className="text-[20px] xl:text-[30px] font-medium text-[#252525] mb-2">Working Hours</h3>

                    <p className="text-[16px] text-gray-600">Monday to Saturday</p>
                    <p className="text-[16px] text-gray-600">10:00 AM to 06:00 PM</p>

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 xl:gap-6 mt-10 px-4 sm:px-12 md:px-8 xl:px-12 bg-white">

                {/* Box 1 */}
                <div className="border border-[#9FBBFF] rounded-lg p-5 xl:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div>
                        <p className="text-[16px] md:text-[18px] font-medium text-[#252525] text-left">
                            Talk to a member of our marketing team
                        </p>
                        <p className="text-[14px] md:text-[16px] text-gray-600 text-left">
                            marketing@studycafe.in
                        </p>
                    </div>

                    <button className="text-[#09339B] bg-[#F9F9FB] border border-[#09339B] md:px-5 py-2  xl:px-6 xl:py-3 rounded-lg hover:bg-[#09339B] hover:text-white transition w-full md:w-auto">
                        Contact Marketing Team
                    </button>

                </div>


                {/* Box 2 */}
                <div className="border border-[#9FBBFF] rounded-lg p-5 xl:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div>
                        <p className="text-[16px] md:text-[18px] font-medium text-[#252525] text-left">
                            Talk to a member of our accounts team
                        </p>
                        <p className="text-[14px] md:text-[16px] text-gray-600 text-left">
                            accounts@studycafe.in
                        </p>
                    </div>

                    <button className="text-[#09339B] bg-[#F9F9FB] border border-[#09339B] px-5 py-2 xl:px-6 md:py-3 rounded-lg hover:bg-[#09339B] hover:text-white transition w-full md:w-auto">
                        Contact Accounting Team
                    </button>

                </div>

            </div>


            {/* Follow Us Section */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm mt-8 text-center">

                <h3 className="text-[26px] md:text-[40px] font-semibold text-[#09339B] mb-2">
                    Follow Us
                </h3>

                <p className="text-[#454545] text-[16px] md:text-[24px] mb-6">
                    Stay connected for the latest updates, tips, and educational content.
                </p>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8 ">

                    <a href=""><img src="/images/ln-b.svg" className="w-8 h-8 md:w-12 md:h-12" /></a>
                    <a href=""><img src="/images/x-b.svg" className="w-8 h-8 md:w-12 md:h-12" /></a>
                    <a href=""><img src="/images/insta-b.svg" className="w-8 h-8 md:w-12 md:h-12" /></a>
                    <a href=""><img src="/images/fb-b.svg" className="w-8 h-8 md:w-12 md:h-12" /></a>
                    <a href=""><img src="/images/telegram-b.svg" className="w-8 h-8 md:w-12 md:h-12" /></a>
                    <a href=""><img src="/images/youtube-b.svg" className="w-8 h-8 md:w-12 md:h-12" /></a>

                </div>

            </div>


        </div> 

        

    )
}

