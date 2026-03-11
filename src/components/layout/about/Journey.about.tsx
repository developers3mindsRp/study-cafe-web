import React from 'react'

const Journey_about = () => {


  return (

      <>
          <section className="py-20">

              <div className="container mx-auto px-4">

                  {/* Title */}
                  <h2 className="text-center text-[40px] font-semibold mb-16">
                      Our Journey
                  </h2>

                  {/* Timeline Container */}
                  <div className="bg-[url(/images/jouney-bg.svg)] bg-no-repeat bg-cover bg-center py-24">

                      {/* notebook lines */}
                    

                      {/* Timeline Grid */}
                      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 px-32">

                          {/* Card */}
                          <div className="relative bg-[#dfe5f4] rounded-lg shadow-md p-6 text-left">

                              {/* Pin */}
                              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                  <img src="/images/pin.svg" className="w-8 h-8" />
                              </div>

                              <h4 className="font-semibold text-lg">2011</h4>
                              <h5 className="font-semibold mb-2">Website Started</h5>
                              <p className="text-sm text-gray-600">
                                  Studycafe Website Started in 2011
                              </p>

                          </div>


                          {/* Card */}
                          <div className="relative bg-[#dfe5f4] rounded-lg shadow-md p-6">

                              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                  <img src="/images/pin.svg" className="w-8 h-8" />
                              </div>

                              <h4 className="font-semibold text-lg">2018</h4>
                              <h5 className="font-semibold mb-2">App Launched</h5>

                              <p className="text-sm text-gray-600">
                                  Launched StudyCafe Mobile App on Android Platform
                              </p>

                          </div>


                          {/* Card */}
                          <div className="relative bg-[#dfe5f4] rounded-lg shadow-md p-6">

                              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                  <img src="/images/pin.svg" className="w-8 h-8" />
                              </div>

                              <h4 className="font-semibold text-lg">2018</h4>
                              <h5 className="font-semibold mb-2">E-Commerce Launched</h5>

                              <p className="text-sm text-gray-600">
                                  Launched Studycafe E-Commerce Portal in 2018
                              </p>

                          </div>


                          {/* Card */}
                          <div className="relative bg-[#dfe5f4] rounded-lg shadow-md p-6">

                              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                  <img src="/images/pin.svg" className="w-8 h-8" />
                              </div>

                              <h4 className="font-semibold text-lg">2021</h4>
                              <h5 className="font-semibold mb-2">Membership Programmes</h5>

                              <p className="text-sm text-gray-600">
                                  For a better user experience, we launched membership programs.
                              </p>

                          </div>


                          {/* Card */}
                          <div className="relative bg-[#dfe5f4] rounded-lg shadow-md p-6">

                              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                  <img src="/images/pin.svg" className="w-8 h-8" />
                              </div>

                              <h4 className="font-semibold text-lg">2020</h4>
                              <h5 className="font-semibold mb-2">Company Incorporated</h5>

                              <p className="text-sm text-gray-600">
                                  Studycafe Private Limited Company incorporated in July 2020.
                              </p>

                          </div>


                          {/* Card */}
                          <div className="relative bg-[#dfe5f4] rounded-lg shadow-md p-6">

                              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                  <img src="/images/pin.svg" className="w-8 h-8" />
                              </div>

                              <h4 className="font-semibold text-lg">2020</h4>
                              <h5 className="font-semibold mb-2">Online Courses</h5>

                              <p className="text-sm text-gray-600">
                                  Started providing online courses on GST, Income Tax & more.
                              </p>

                          </div>


                          {/* Card */}
                          <div className="relative bg-[#dfe5f4] rounded-lg shadow-md p-6 md:col-span-3 mx-auto max-w-sm">

                              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                  <img src="/images/pin.svg" className="w-8 h-8" />
                              </div>

                              <h4 className="font-semibold text-lg">2024</h4>
                              <h5 className="font-semibold mb-2">Lifetime Membership</h5>

                              <p className="text-sm text-gray-600">
                                  We launched a lifetime membership program for members.
                              </p>

                          </div>

                      </div>

                  </div>

              </div>

          </section>


     
      
      
      
      
      
      </>
  )
}

export default Journey_about;
