import React from 'react'

const Feature_about = () => {


  return (

      <>
          <section className="py-4">
              <div className="container mx-auto pt-4 w-full px-4 text-left gap-8 ">

                  <div className='text-center'>
                      <h1 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-6">
                          Featured In
                      </h1>
                     
                  </div>

                  <div className="rounded-lg bg-white grid grid-cols-3 md:grid-cols-6 border">

                      <div className="p-4 border-r flex items-center justify-center">
                          <img src="/images/hc.svg" alt="" />
                      </div>

                      <div className="p-4 border-r flex items-center justify-center">
                          <img src="/images/LT.svg" alt="" />
                      </div>

                      <div className="p-4 border-r flex items-center justify-center">
                          <img src="/images/ANI.svg" alt="" />
                      </div>

                      <div className="p-4 border-r flex items-center justify-center">
                          <img src="/images/the-print.svg" alt="" />
                      </div>

                      <div className="p-4 border-r flex items-center justify-center">
                          <img src="/images/zee.svg" alt="" />
                      </div>

                      <div className="p-4 flex items-center justify-center">
                          <img src="/images/dailyhunt.svg" alt="" />
                      </div>

                  </div>


              </div>
          </section>
      </>

  )
}

export default Feature_about;
