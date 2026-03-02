

import React from 'react'

const Accounts_downloads = () => {
    const fileData = [
        { id: 1, title: "Supreme Court: COVID Extension Saves Arbitration Claim Filed After 3 Years", duration: "December 16 @ 10:33 AM" },
        { id: 2, title: "ICAI Imposes Rs. 2 Lakh Fine on Chartered Accountant for Professional Misconduct in..", duration: "December 16 @ 10:33 AM" },
        { id: 3, title: "Amended Schedule III of Companies Act 2013", duration: "December 16 @ 10:33 AM" },
        { id: 4, title: "New Rules for Tax Audit under Section 44AB", duration: "December 16 @ 10:33 AM" },
        { id: 5, title: "ICAI release Guidance Note on Accounting for Share-based Payments", duration: "December 16 @ 10:33 AM" },
        { id: 6, title: "AO cannot made additions by ignoring method of accounting", duration: "December 16 @ 10:33 AM" },
   
    ];

  return (

      <>
          <section className='container mx-auto px-4 '>
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

                  <h2 className='text-[26px] font-normal text-[#252525] mb-4'>Accounts</h2>
          
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                  {fileData.map((item) => (
                      <div
                          key={item.id}
                          className="flex items-center justify-between border px-4 py-3 rounded-lg hover:shadow-md transition bg-white shadow-md cursor-pointer hover:border-[#9FBBFF]"
                      >
                          {/* Left Section */}
                          <div className="flex items-center gap-4 ">
                              <img
                                  src="/images/pdf.svg"
                                  alt="File Icon"
                                  className="w-15 h-15"
                              />
                              <div>
                                  <p className="font-normal text-[16px] text-[#454545]">
                                      {item.title}
                                  </p>
                                  <p className="text-[12px] text-[#929292]">
                                      By Nidhi
                                  </p>
                                  <span className="text-[12px] text-[#929292]">
                                      {item.duration}
                                  </span>
                              </div>
                          </div>

              
                      </div>
                  ))}
              </div>

          </section>

     
      
      
      
      
      
      </>
  )
}

export default Accounts_downloads
