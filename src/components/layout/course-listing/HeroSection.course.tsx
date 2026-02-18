import React from 'react'

const HeroSection_courses = () => {
  return (

    <section className='bg-[url("/images/course_bg.svg")] bg-no-repeat bg-cover bg-center '>

      <div className='container mx-auto pt-10 md:pt-20 pb-12 md:pb-32 w-[100%] md:h-[580px] px-4'>

        <div className="flex items-center justify-center mb-4 mt-6">
          <p className="text-[12px] md:text-[20px] bg-white p-3 rounded-[6px] font-medium">
            The Leader in Online Learning
          </p>
        </div>


        <div className='text-center'>
          <h1 className='text-[30px] md:text-[62px] font-bold text-[#09339B] mb-4'>Explore Our Courses</h1>
          <h3 className='text-[#252525] text-[16px] md:text-[24px] px-4'>Find the perfect course to advance your skills and career</h3>

          <div className="mt-4 md:mt-10 w-full max-w-2xl mx-auto">
            <div className="relative px-4">
              <input
                type="text"
                placeholder="Search Courses..."
                className="w-full bg-white border text-[16px] border-gray-300 rounded-[10px] py-4 pl-4 pr-10 text-gray-800 placeholder-[#49454F] focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {/* magnifying glass icon (SVG) */}
      
                <img src="/images/search-icon.svg" alt=""width="24" height="24"  className='w-12 h-12 mr-6'/>
              </button>
            </div>
          </div>

        </div>


      </div>


    </section>
  )
}

export default HeroSection_courses
