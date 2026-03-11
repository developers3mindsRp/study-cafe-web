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
          <section className="container mx-auto pt-4 md:pt-6 pb-12 w-[100%] px-4 text-left grid grid-cols-1 md:grid-cols-4 gap-8">

              {statsData.map((item, index) => (
                  <div
                      key={index}
                      className="p-4 bg-[#09339B] rounded-lg text-center flex items-center justify-center gap-8"
                  >
                      <img src={item.icon} alt={item.title} />

                      <div className="flex flex-col">
                          <h2 className="text-[30px] md:text-[16px] font-regular text-white">
                              {item.title}
                          </h2>

                          <p className="text-[16px] md:text-[40px] text-white">
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
