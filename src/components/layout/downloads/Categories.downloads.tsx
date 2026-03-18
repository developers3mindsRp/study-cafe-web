

import React from 'react'
import Link from 'next/link';

const Categories_downloads = ({ showSearch = true }) => {
    const fileData = [
        { id: 1, title: "Accounts", totalFiles: 6 },
        { id: 2, title: "Audit", totalFiles: 12 },
        { id: 3, title: "Budget", totalFiles: 4 },
        { id: 4, title: "CA", totalFiles: 9 },
        { id: 4, title: "CA Final Notes", totalFiles: 9 },
        { id: 4, title: "Company Law", totalFiles: 9 },
        { id: 4, title: "CS", totalFiles: 9 },
        { id: 4, title: "Custom", totalFiles: 9 },
   
    ];
   

  return (

      <>
          <section className='container mx-auto px-4 '>
              <div>
                  <div>
                      {showSearch && (
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
                      )}
                  </div>

                  <h2 className='text-[26px] font-normal text-[#252525] mb-4'>Download Categories</h2>
                  <p className='text-[#454545] text-[16px] mb-6'>All Files Grouped by Category</p>
              </div>
              <Link href="/downloads/accounts">
              <div className="grid md:grid-cols-2 gap-4">
                  {fileData.map((item) => (
                      <div
                          key={item.id}
                          className="flex items-center justify-between border px-4 py-3 rounded-lg hover:shadow-md transition bg-white shadow-md cursor-pointer hover:border-[#9FBBFF]"
                      >
                          {/* Left Section */}
                         
                          <div className="flex items-center gap-4 ">
                              <img
                                  src="/images/file.svg"
                                  alt="File Icon"
                                  className="w-10 h-10"
                              />
                            
                                  <div>
                                      <p className="font-medium">{item.title}</p>
                                      <span className="text-sm text-gray-500">
                                          Total Files - {item.totalFiles}
                                      </span>
                                  </div>
                          </div>

                          {/* Right Arrow */}
                          <img
                              src="/images/arrow-black.svg"
                              alt="Arrow Icon"
                              className="w-5 h-5"
                          />
                      </div>
                  ))}
                  </div>
              </Link>

          </section>

     
      
      
      
      
      
      </>
  )
}

export default Categories_downloads
