import React from 'react'

const Manager_about = () => {
    const managers = [
        {
            name: "Raja Mehta",
            role: "Operation Manager",
            image: "/images/raja.svg",
            social: {
                instagram: "/images/insta.png",
                twitter: "/images/x.png",
                linkedin: "/images/linkedin.svg",
            },
        },
        {
            name: "Simran Chawla",
            role: "Motion Graphic Designer",
            image: "/images/simran.svg",
            social: {
                instagram: "/images/insta.png",
                twitter: "/images/x.png",
                linkedin: "/images/linkedin.svg",
            },
        },
        {
            name: "Meetu Kumari",
            role: "Content Manager",
            image: "/images/meetu.svg",
            social: {
                instagram: "/images/insta.png",
                twitter: "/images/x.png",
                linkedin: "/images/linkedin.svg",
            },
        },
        {
            name: "Janvi",
            role: "Digital Marketing Executive",
            image: "/images/janvi.svg",
            social: {
                instagram: "/images/insta.png",
                twitter: "/images/x.png",
                linkedin: "/images/linkedin.svg",
            },
        },
    ];


  return (

      <>
          <section className="py-4 container px-4 mx-auto">
              <div>
                  <h1 className="text-[25px] font-bold text-center">Managers</h1>

                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:gap-6 md:p-6 mt-10 md:mt-6">

                      {managers.map((member, index) => (
                          <div key={index} className="flex flex-col border md:p-6 rounded-lg bg-white">

                              <img src={member.image} alt={member.name} />

                              <div className="flex justify-between items-center mt-2">
                                  <h1 className="xl:text-[18px] font-bold text-[#111318]">
                                      {member.name}
                                  </h1>

                                  {member.social && (
                                      <div className="flex gap-2">
                                          {member.social.instagram && (
                                              <a href=""> <img src={member.social.instagram} className="w-4 h-4" /></a>
                                          )}
                                          {member.social.twitter && (
                                              <a href=""><img src={member.social.twitter} className="w-4 h-4" /></a>
                                          )}
                                          {member.social.linkedin && (
                                              <a href=""> <img src={member.social.linkedin} className="w-4 h-4" /></a>
                                          )}
                                      </div>
                                  )}
                              </div>

                              <span className="text-[14px] text-[#616F89] mt-2">
                                  {member.role}
                              </span>

                          </div>
                      ))}

                  </div>
              </div>


          </section>
      </>

  )
}

export default Manager_about;
