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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='w-6 h-6 mr-6'>
                  <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z" fill="#49454F" />
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
