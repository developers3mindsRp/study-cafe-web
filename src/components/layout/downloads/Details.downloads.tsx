

import React from 'react'

const Details_downloads = () => {


  return (

      <>
          <section className='container mx-auto px-4 pb-6'>
              <div>
                  <div className="relative mb-8 gap-2">

                      {/* Search Icon */}
                      <img
                          src="/images/search-icon.svg"
                          alt="Search"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10"
                      />

                      {/* Input */}
                      <input
                          type="text"
                          placeholder="Search by file name or author..."
                          className="w-full pl-14 pr-4 py-3 border border-[#EDF1F3] rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-[#49454F]"
                      />

                  </div>

                  <div className="bg-white border border-[#9FBBFF] rounded-xl p-6 shadow-md ">

                      {/* Header Section */}
                      <div className="flex items-start gap-4 mb-6 justify-between flex-wrap">
                          <div className='flex gap-4 md:gap-8'>
                              <img src="/images/pdf.svg" alt="PDF Icon" className="w-16 h-16" />


                              <h2 className="text-[14px] md:text-2xl font-bold text-[#252525] mb-4 ">
                                  ITAT Deletes Section 270A Penalty as AO Fails <br className='hidden md:block'/> to Specify Misreporting Limb
                              </h2>
                              </div>

                              <button className="bg-[#09339B] hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-lg ">
                                  Download
                              </button>
                        
                      </div>

                      <hr className="mb-6" />

                      {/* Details Section */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">

                          <div>
                              <p className="text-[#929292] mb-1">File Name</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md inline-block ">Sas-fashion.pdf</p>
                          </div>

                          <div>
                              <p className="text-[#929292] mb-1">File Size</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md inline-block">2.5 MB</p>
                          </div>

                          <div>
                              <p className="text-[#929292] mb-1">Downloaded</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md inline-block">1248 Times</p>
                          </div>

                          <div>
                              <p className="text-[#929292] mb-1">Submitted By</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md inline-block">Nidhi</p>
                          </div>

                          <div>
                              <p className="text-[#929292] mb-1">Submitted Date</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md inline-block whitespace-nowrap">
                                  Tuesday December 16, 2025
                              </p>
                          </div>

                      </div>
                  </div>


           
          
              </div>
         

          </section>

     
      
      
      
      
      
      </>
  )
}

export default Details_downloads
