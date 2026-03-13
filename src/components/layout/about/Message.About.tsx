import React from 'react'

const Message_about = () => {


  return (

      <>
          <section className="py-12 ">
              <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Left Card */}
                  <div className="bg-white rounded-xl border p-8 text-center shadow-sm">
                      <h2 className="text-[25px] font-bold  mb-6">Get In Touch</h2>

                      {/* Social Icons */}
                      <div className="flex justify-center gap-12 mb-6 flex-wrap">
                          <img src="/images/fb-circle.svg" className="w-14 h-14" />
                          <img src="/images/twitter-circle.svg" className="w-14 h-14" />
                          <img src="/images/linkedin-circle.svg" className="w-14 h-14" />
                          
                      </div>
                      <div className="flex justify-center gap-12 mb-6 flex-wrap ">
                          <img src="/images/insta-circle.svg" className="w-14 h-14" />
                          <img src="/images/mail-circle.svg" className="w-14 h-14" />
                      </div>

                      <h3 className="text-[20px] font-medium mt-10 text-[#454545]">
                          StudyCafe Private Limited
                      </h3>

                      <p className="text-[14px] text-[#454545] mt-2">
                          1003, 10th Floor, Modi Tower 98, Nehru place,
                          Delhi, 110019 - India
                      </p>
                  </div>


                  {/* Right Card */}
                  <div className="bg-[url('/images/about-bg.svg')] bg-cover bg-no-repeat rounded-xl p-8 text-white relative">

                      <h2 className="text-[26px] font-semibold mb-6 text-center hidden md:block">
                          A Message from Our Founder 
                      </h2>

                      <div className="flex flex-col md:flex-row gap-6 items-start">

                          {/* Founder Image */}
                          <div className="bg-white rounded-xl flex-shrink-0 mx-auto ">
                              <img
                                  src="/images/founder.svg"
                                  alt="Founder"
                                  className="w-[250px] md:w-full md:h-auto rounded-lg object-cover md:mt-16 "
                              />
                          </div>

                          <h2 className="text-[26px] font-semibold text-center block md:hidden">
                              A Message from Our Founder
                          </h2>



                          {/* Text */}
                          <div>
                              <p className="text-[15px] leading-relaxed font-regular text-center md:text-left">
                                  Studycafe is D2C Edtech Company. Studycafe provides a range of industry-specific modern courses on ChatGPT, AI Tools, CA Practice Automation, How to Grow CA Practice, Business Automation, Power BI, Advance Microsoft Excel, Microsoft PowerPoint, Income Tax, TDS, GST, SAP, and Business Communication, etc. The membership subscription provided by Studycafe helps in availing highly customized and curated services catering to the needs of the member. The platform strives to empower its learning community and open several opportunities for them in the modern market.
                              </p>

                              <h3 className="text-[20px] font-medium mt-6">
                                  CA Deepak Gupta
                              </h3>

                              <p className="text-[15px] mt-2 opacity-90">Founder</p>
                          </div>
                      </div>

                      {/* Linkedin Icon */}
                      <div className="bg-white rounded-[18px]  w-10 h-10 flex items-center justify-center absolute bottom-14 right-6">
                          <img
                              src="/images/linkedin.svg"
                              alt="Linkedin"
                              className="w-4 h-4"
                          />
                      </div>


                  </div>

              </div>
          </section>
      </>

  )
}

export default Message_about;
