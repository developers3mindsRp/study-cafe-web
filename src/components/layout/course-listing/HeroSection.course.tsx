import React from 'react'

const HeroSection_courses = () => {
  return (
    
   <section className='bg-[url("/images/course_bg.svg")] bg-no-repeat bg-cover bg-center '>
          <div className="  mx-auto px-14 py-3 text-sm text-gray-500 bg-[#DDDDDD]">
        Home ›  <span className="text-blue-600"> Course </span>
      </div>
   <div className='container mx-auto pt-20 pb-32 w-[100%] h-[580px] px-4'>
 
<div className="flex items-center justify-center mb-4 mt-6">
  <p className="text-[20px] bg-white p-3 rounded-md">
   The Leader in Online Learning
  </p>
</div>


    <div className='text-center'>
        <h1 className='text-[62px] font-bold text-[#09339B] mb-4'>Explore Our Courses</h1>
        <h3 className='text-[#252525] text-[24px]'>Find the perfect course to advance your skills and career</h3>
    
   <div className="mt-10 w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search Courses..."
          className="w-full bg-white border border-gray-300 rounded-md py-3 pl-4 pr-10 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {/* magnifying glass icon (SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg"
               className="h-5 w-5 mr-4"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </div>

    </div>


   </div>


   </section>
  )
}

export default HeroSection_courses
