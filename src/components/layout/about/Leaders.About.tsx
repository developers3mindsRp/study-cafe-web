import React from 'react'

const Leader_about = () => {


  return (

      <>
          <section className="md:py-4">
              <div className="container mx-auto md:pt-4  md:pb-12 w-full px-4 text-left grid grid-cols-1 md:grid-cols-2 gap-8 ">

                  <div className='text-center items-center mt-8 md:mt-24'>
                      <h1 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-4">
                          Leadership & Team
                      </h1>
                      <p className="text-[24px] text-[#454545]">
                          The people behind Studycafe's success
                      </p>
                  </div>

                  <div className="rounded-lg  bg-white grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 mx-auto">

                   
                          <div className="flex flex-col  rounded-full mb-4">
                          <img src="/images/deepak.svg" alt="" className="md:w-[350px]" />
                          <div className='flex justify-between pr-4 mt-2'>
                              <h1 className='md:text-[20px] xl:text-[25px] font-medium text-[#454545]'>CA Deepak Gupta</h1>
                              <img src="/images/linkedin.svg" alt="" className='w-6 h-6 mt-2 xl:mt-3' />
                        </div>
                          <span className='xl:text-[20px] text-[#454545]'>Founder</span>
                          </div>
                     
                          <div className="flex flex-col  rounded-full mb-4">
                          <img src="/images/pratibha.svg" alt="" className="md:w-[350px]" />
                          <div className='flex justify-between pr-4 mt-2'>
                              <h1 className='md:text-[20px] xl:text-[25px] font-medium text-[#454545]'>CA Pratibha Goyal</h1>
                              <img src="/images/linkedin.svg" alt="" className='w-6 h-6 mt-2 xl:mt-3' />
                          </div>
                          <span className='xl:text-[20px] text-[#454545]'>Co Founder</span>
                          </div>
                     

                        
                     

                  </div>

              </div>
          </section>
      </>

  )
}

export default Leader_about;
