import React from 'react'

const Mission_about = () => {


  return (

      <>
          <section className="py-8 md:py-12">

              <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 border rounded-lg shadow-md p-6 md:p-10">

                  {/* Left Content */}
                  <div>
                      <h1 className="text-[28px] xl:text-[40px] lg:text-[56px] font-semibold text-[#252525] mb-4">
                          Our Mission
                      </h1>

                      <p className="text-[15px] md:text-[17px] text-[#454545] leading-relaxed">
                          Our mission is to empower professionals and students alike by providing them with access to the most comprehensive and relevant content and courses across a diverse range of fields, including ChatGPT, AI Tools, CA Practice Automation, Business Automation, Power BI, Advanced Microsoft Excel, Microsoft PowerPoint, Income Tax, TDS, GST, SAP, and Business Communication. We believe in equipping individuals with the knowledge and skills they need to excel in today's dynamic and ever-evolving professional landscape. Our vision is to become the go-to platform where learners can discover, acquire, and master the tools and expertise necessary to thrive in their careers, making a positive impact on their organizations and the world at large.
                      </p>
                  </div>

                  {/* Right Cards */}
                  <div className="grid sm:grid-cols-1 xl:grid-cols-2  gap-4">

                      {/* Card 1 */}
                      <div className="border border-[#9FBBFF] rounded-xl p-6 xl:p-8 bg-[#FAFAFA] hover:shadow-md transition flex flex-col">

                          <div className="w-12 h-12 md:w-16 md:h-16 mb-4">
                              <img src="/images/email.png" alt="" className="w-full h-full object-contain" />
                          </div>

                          <h3 className="text-[16px] md:text-[18px] font-bold text-[#252525] mb-2">
                              Empower <br className='hidden md:block'/> Professionals
                          </h3>

                          <p className="text-[13px] md:text-[14px] text-gray-600">
                              To provide affordable, high-
                              quality technical education
                              accessible to everyone,
                              everywhere.
                          </p>

                      </div>

                      {/* Card 2 */}
                      <div className="border border-[#9FBBFF] rounded-xl p-6 xl:p-8 bg-[#FAFAFA] hover:shadow-md transition flex flex-col">

                          <div className="w-12 h-12 md:w-16 md:h-16 mb-4">
                              <img src="/images/email.png" alt="" className="w-full h-full object-contain" />
                          </div>

                          <h3 className="text-[16px] md:text-[18px] font-bold text-[#252525] mb-2">
                              Career Growth
                          </h3>

                          <p className="text-[13px] md:text-[14px] text-gray-600">
                              To become the leading platform for career upskilling in finance,
                              accounting, and future tech.
                          </p>

                      </div>

                  </div>

              </div>

          </section>


     
      
      
      
      
      
      </>
  )
}

export default Mission_about;
