import React from 'react'

const HeroSection = () => {
  return (
   <section className='bg-[url("/images/hero_banner.png")] bg-no-repeat bg-cover bg-center '>
   <div className='container mx-auto pt-20 pb-32 w-[100%] h-[800px] px-4'>
 
<div className="flex items-center justify-center mb-4">
  <p className="text-[20px] bg-white p-3 rounded-md">
    Welcome to StudyCafe Learning Platform
  </p>
</div>


    <div className='text-center'>
        <h1 className='text-[40px] font-bold text-[#252525] mb-4'>Master Your Skills with <br /> Professional Courses</h1>
        <h3 className='text-[#252525] text-[24px]'>Learn from industry experts, get certified, and boost your career with our comprehensive online courses</h3>
    
   <div className="mt-4 space-x-4">
  <button
    className="
      py-2 px-4
      bg-transparent
      border-2 border-[#252525]
      text-[#252525]
      rounded-md
      font-semibold
      
      hover:bg-blue-50
      hover:shadow-sm
      focus:outline-none focus:ring-2 focus:ring-blue-300
    "
  >
    View Memberships
  </button>

  <button
    className="
      py-2 px-4
      bg-[#09339B] text-white
      border-2 border-transparent
      rounded-md
      font-semibold
     
      hover:bg-blue-800
      hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-blue-500
    "
  >
    Browse Courses
  </button>
</div>

    </div>

       <div className='flex items-center justify-center mt-4'>
    <img src="/images/img1.svg" alt="" width="" height="" />
   </div>
   </div>


   </section>
  )
}

export default HeroSection
