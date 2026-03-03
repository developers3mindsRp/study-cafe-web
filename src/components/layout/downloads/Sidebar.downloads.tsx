import React from 'react'

const Sidebar_downloads = () => {
    const pdfData = [
        { id: 1, title: "ITAT Deletes Section 270A Penalty as AO Fails to Specify Misreporting Limb", duration: "December 16 @ 10:33 AM" },
        { id: 2, title: "ITAT Deletes Section 270A Penalty as AO Fails to Specify Misreporting Limb", duration: "December 16 @ 10:33 AM" },
        { id: 3, title: "ITAT Deletes Section 270A Penalty as AO Fails to Specify Misreporting Limb", duration: "December 16 @ 10:33 AM" },
        { id: 4, title: "ITAT Deletes Section 270A Penalty as AO Fails to Specify Misreporting Limb", duration: "December 16 @ 10:33 AM" },

    ];



    return (

        <>


            <section className=' px-4 p-2 bg-[#F9F9FB] rounded-lg'>
                <div >
                    <h2 className='text-[26px] font-medium text-[20px] text-[#252525] mt-4'>Recent Posts</h2>

                </div>
                <div className=" divide-y divide-[#AFAFAF]">
                    {pdfData.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-50 transition"
                        >
                            {/* Left Section */}
                            <div className="flex items-center gap-4">
                                <img
                                    src="/images/pdf.svg"
                                    alt="PDF Icon"
                                    className="w-20 h-20"
                                />
                                <div>
                                    <p className="font-normal text-[16px] text-[#454545] line-clamp-2">
                                        {item.title}
                                    </p>
                                    <p className="text-[12px] text-[#929292]">
                                        By: Nidhi
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

export default Sidebar_downloads
