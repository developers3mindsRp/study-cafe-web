import React from 'react'

const Mission_about = () => {


  return (

      <>
          <section className='py-4'>

              <div className='container mx-auto pt-4 md:pt-6 pb-12  w-[100%]  px-4 text-left grid grid-cols-1 md:grid-cols-2 gap-8 border box-shadow: 0px 1px 2px 0px #0000000D;
] rounded-lg shadow-md'>
                  <div>

                      <h1 className='text-[30px] md:text-[62px] font-semibold text-[#252525] mb-4'>Our Mission</h1>
                      <p className="text-[18px] text-[#454545]">Our mission is to empower professionals and students alike by providing them with access to the most comprehensive and relevant content and courses across a diverse range of fields, including ChatGPT, AI Tools, CA Practice Automation, Business Automation, Power BI, Advanced Microsoft Excel, Microsoft PowerPoint, Income Tax, TDS, GST, SAP, and Business Communication. We believe in equipping individuals with the knowledge and skills they need to excel in today's dynamic and ever-evolving professional landscape. Our vision is to become the go-to platform where learners can discover, acquire, and master the tools and expertise necessary to thrive in their careers, making a positive impact on their organizations and the world at large.</p>
                  </div>

                  <div className=" rounded-lg p-12 bg-white  grid grid-cols-2 gap-4">
                   
                      <div className="border border-[#9FBBFF] rounded-xl p-8 bg-white  hover:shadow-md transition flex flex-col bg-[#FAFAFA]">

                          <div className="w-16 h-16  flex items-center rounded-full  mb-4 ">
                              <img src="/images/email.png" alt="" className="w-16 h-16" />
                          </div>

                          <h3 className="text-[18px] font-bold text-[#252525] mb-2">Empower <br />
                              Professionals</h3>

                          <p className="text-[14px] text-gray-600">To provide affordable, high-
                              quality technical education
                              accessible to everyone,
                              everywhere.</p>
                        

                      </div>
                      <div className="border border-[#9FBBFF] rounded-xl p-8 bg-white  hover:shadow-md transition flex flex-col justify-center bg-[#FAFAFA]">

                          <div className="w-16 h-16  flex items-center justify-center rounded-full  mb-4 ">
                              <img src="/images/email.png" alt="" className="w-16 h-16" />
                          </div>

                          <h3 className="text-[18px] font-bold text-[#252525] mb-2">Career Growth</h3>

                          <p className="text-[14px] text-gray-600">To become the leading
                              platform for career
                              upskilling in finance,
                              accounting, and future tech.</p>
                       

                      </div>

                  </div>


              </div>

          </section>

     
      
      
      
      
      
      </>
  )
}

export default Mission_about;
