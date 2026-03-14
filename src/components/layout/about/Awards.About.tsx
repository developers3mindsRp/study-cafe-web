import React from 'react'

const Awards_about = () => {


  return (

      <>
          <section className="">
              <div className="container mx-auto pt-4 w-full px-4 text-left gap-8 ">

                  <div className='text-center'>
                      <h1 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-6">
                          Awards & Recognition
                      </h1>
                     
                  </div>

                  <div className="rounded-lg  bg-white grid grid-cols-1 md:grid-cols-2 gap-4">

                   
                          <div className="flex flex-col  rounded-full mb-4">
                          <img src="/images/certificates1.svg" alt="" className="" />
                        
                          </div>
                     
                          <div className="flex flex-col  rounded-full mb-4">
                          <img src="/images/certificates1.svg" alt="" className="" />
                       
                          </div>
                     

                        
                     

                  </div>

              </div>
          </section>
      </>

  )
}

export default Awards_about;
