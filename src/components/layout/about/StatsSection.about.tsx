import React from 'react'

const Stats_about = () => {
    const statsData = [
        {
            title: "Founded",
            value: "2011",
            icon: "/images/founded.svg"
        },
        {
            title: "Happy Students",
            value: "50K+",
            icon: "/images/students.svg"
        },
        {
            title: "Courses",
            value: "50+",
            icon: "/images/courses.svg"
        },
        {
            title: "Instructors",
            value: "20+",
            icon: "/images/instruct.svg"
        }
    ];



  return (

      <>
          <section className="container mx-auto pt-4 md:pt-6 md:pb-12 w-[100%] px-4 text-left grid grid-cols-2 md:grid-cols-4 gap-8">

              {statsData.map((item, index) => (
                  <div
                      key={index}
                      className="p-2 md:p-4 bg-[#09339B] rounded-lg text-center flex items-center md:justify-center gap-3  md:gap-8 px-3 "
                  >
                      <img src={item.icon} alt={item.title} className='w-10 h-10 xl:w-auto xl:h-auto ' />

                      <div className="flex flex-col">
                          <h2 className="text-[14px] md:text-[16px] font-regular text-white xl:w-[110px] whitespace-nowrap">
                              {item.title}
                          </h2>

                          <p className="text-[25px] xl:text-[40px] text-white mt-1">
                              {item.value}
                          </p>
                      </div>
                  </div>
              ))}

          </section>


     
      
      
      
      
      
      </>
  )
}

export default Stats_about;
