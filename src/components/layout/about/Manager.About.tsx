import React from 'react'

const Manager_about = () => {


  return (

      <>
          <section className="py-4 container px-4 mx-auto">
              <div>
                  <h1 className='text-[25px] font-bold text-center'>Managers</h1>
                    
                  <div className='grid grid-cols-4 p-6 '>
                      <div className="flex flex-col  mb-4 p-4 border p-8">
                          <img src="/images/raja.svg" alt="" className="" />
                          <h1 className='text-[25px] font-medium text-[#454545]'>Raja Mehta</h1>
                          <span className='text-[20px] text-[#454545]'>Operation Manager</span>
                      </div>
                      <div className="flex flex-col  mb-4 p-4 border p-8">
                          <img src="/images/simran.svg" alt="" className="" />
                          <h1 className='text-[25px] font-medium text-[#454545]'>Simran Chawla</h1>
                          <span className='text-[20px] text-[#454545]'>Motion Graphic Designer</span>
                      </div>
                      <div className="flex flex-col  mb-4 p-4 border p-8">
                          <img src="/images/meetu.svg" alt="" className="" />
                          <h1 className='text-[25px] font-medium text-[#454545]'>Meetu Kumari</h1>
                          <span className='text-[20px] text-[#454545]'>Content Manager</span>
                      </div>
                      <div className="flex flex-col  mb-4 p-4 border p-8">
                          <img src="/images/janvi.svg" alt="" className="" />
                          <h1 className='text-[25px] font-medium text-[#454545]'>Janvi</h1>
                          <span className='text-[20px] text-[#454545]'>Digital Marketing Executive</span>
                      </div>
                     
                  </div>

              </div>
       
          </section>
      </>

  )
}

export default Manager_about;
