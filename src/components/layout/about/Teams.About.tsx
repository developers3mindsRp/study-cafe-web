import React from 'react'

const Teams_about = () => {
    const teamMembers = [
        {
            name: "Saloni Kumari",
            role: "Content Writer",
            image: "/images/saloni.svg",
            social: {
                instagram: "/images/insta.png",
                twitter: "/images/x.png",
                linkedin: "/images/linkedin.svg",
            },
        },
        {
            name: "Nidhi",
            role: "Content Writer",
            image: "/images/nidhi.svg",
            social: {
                instagram: "/images/insta.png",
                twitter: "/images/x.png",
                linkedin: "/images/linkedin.svg",
            },
        },
        {
            name: "Vanshika Verma",
            role: "Content Writer",
            image: "/images/vanshika.svg",
            social: {
                instagram: "/images/insta.png",
                twitter: "/images/x.png",
                linkedin: "/images/linkedin.svg",
            },
        },
        {
            name: "Dharna Chaudhary",
            role: "Digital Marketing Executive",
            image: "/images/dharna.svg",
            social: {
                instagram: "/images/insta.png",
                twitter: "/images/x.png",
                linkedin: "/images/linkedin.svg",
            },
        },
        {
            name: "Kajal",
            role: "Digital Marketing Executive",
            image: "/images/kajal.svg",
            social: {
                instagram: "/images/insta.png",
                twitter: "/images/x.png",
                linkedin: "/images/linkedin.svg",
            },
        },
        {
            name: "Yuyuts Sisodia",
            role: "Accounts Executive",
            image: "/images/yuyuts.svg",
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
                  <h1 className="text-[25px] font-bold text-center ">Team Members</h1>

                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 md:p-6 mt-10 md:mt-6">

                      {teamMembers.map((member, index) => (
                          <div
                              key={index}
                              className={`flex flex-col border md:p-6 rounded-lg bg-white
      ${index === 4 ? "lg:col-start-2" : ""}`}
                          >

                              <img src={member.image} alt={member.name} />

                              <div className="flex justify-between items-center mt-2">
                                  <h1 className="xl:text-[18px] font-bold text-[#111318]">
                                      {member.name}
                                  </h1>

                                  {member.social && (
                                      <div className="flex gap-2">
                                          {member.social.instagram && (
                                              <a href=""><img src={member.social.instagram} className="w-4 h-4" /></a>
                                          )}
                                          {member.social.twitter && (
                                              <a href=""><img src={member.social.twitter} className="w-4 h-4" /></a>
                                          )}
                                          {member.social.linkedin && (
                                              <a href=""><img src={member.social.linkedin} className="w-4 h-4" /></a>
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

export default Teams_about;
