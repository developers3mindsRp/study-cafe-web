import React from 'react'
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { getRecentDownloadFiles } from '@/services/downloads.service';
import { downloadFileHref, formatDownloadDateShort } from '@/utils/downloadsDisplay';

const Sidebar_downloads = () => {
    const { data } = useQuery({
        queryKey: queryKeys.downloads.recent(5),
        queryFn: () => getRecentDownloadFiles(5),
    });

    const pdfData = data?.data ?? [];

    return (

        <>


            <section className=' px-4 p-2 bg-[#F9F9FB] rounded-lg'>
                <div >
                    <h2 className='text-[26px] font-medium text-[20px] text-[#252525] mt-4'>Recent Posts</h2>

                </div>
                <div className=" divide-y divide-[#AFAFAF]">
                    {pdfData.map((item) => (
                        <Link
                            key={item.id}
                            href={downloadFileHref(item.slug, item.id)}
                            className="block"
                        >
                        <div
                            className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-50 transition"
                        >
                            {/* Left Section */}
                            <div className="flex items-center gap-4">
                                <img
                                    src="/images/pdf.svg"
                                    alt="PDF Icon"
                                    className="w-14 md:w-20 h-14 md:h-20"
                                />
                                <div>
                                    <p className="font-normal text-[16px] text-[#454545] line-clamp-2">
                                        {item.title}
                                    </p>
                                    <p className="text-[12px] text-[#929292]">
                                        {item.author_id != null ? `Ref: ${item.author_id}` : 'By: —'}
                                    </p>
                                    <span className="text-[12px] text-[#929292]">
                                        {formatDownloadDateShort(item.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        </Link>
                    ))}
                </div>

       

            </section>




        </>
    )
}

export default Sidebar_downloads
