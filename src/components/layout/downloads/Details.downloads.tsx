import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import {
    getDownloadFileBySlugOrId,
    getDownloadFileUrl,
    recordDownloadFileView,
} from '@/services/downloads.service';
import { formatDownloadDateLong } from '@/utils/downloadsDisplay';
import type { ApiError } from '@/types/api.types';

type Props = {
    fileSlug: string;
};

const MEMBERSHIP_DOWNLOAD_MESSAGE =
    'Active membership is required to download this file.';

function MembershipDownloadModal({ onClose }: { onClose: () => void }) {
    const router = useRouter();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="membership-download-title"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-xl p-8 md:p-10 relative shadow-lg border border-[#9FBBFF]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-[#696969] hover:text-[#252525] text-2xl leading-none"
                    aria-label="Close"
                >
                    ×
                </button>
                <div className="flex items-center justify-center gap-2 mb-3">
                    <img src="/images/lock1.png" alt="" className="w-6 h-6" />
                    <span className="text-[#929292] text-sm font-medium">Members only</span>
                </div>
                <h2
                    id="membership-download-title"
                    className="text-xl md:text-2xl font-semibold text-[#252525] text-center mb-4"
                >
                    Upgrade to download
                </h2>
                <p className="text-[#696969] text-center text-[15px] leading-relaxed mb-8">
                    {MEMBERSHIP_DOWNLOAD_MESSAGE}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-[#09339B] text-[#09339B] bg-white px-6 py-2.5 rounded-lg hover:bg-[#f4f7ff] transition font-medium"
                    >
                        Not now
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            void router.push('/plans');
                        }}
                        className="bg-[#09339B] text-white px-6 py-2.5 rounded-lg hover:bg-[#07287A] transition font-medium"
                    >
                        View membership plans
                    </button>
                </div>
            </div>
        </div>
    );
}

const Details_downloads = ({ fileSlug }: Props) => {
    const router = useRouter();
    const raw = fileSlug ? decodeURIComponent(fileSlug) : '';
    const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
    const [membershipModalOpen, setMembershipModalOpen] = useState(false);
    /** Updated after client-only POST so SSR + first paint stay in sync with DB. */
    const [viewsCount, setViewsCount] = useState<number | null>(null);

    const { data: file, isLoading, isError } = useQuery({
        queryKey: queryKeys.downloads.file(raw),
        queryFn: () => getDownloadFileBySlugOrId(raw),
        enabled: Boolean(raw),
    });

    useEffect(() => {
        if (!raw || typeof window === 'undefined') return;
        // Dedupe: React 18 Strict Mode runs effects twice in dev; avoid double POST.
        const key = `downloads-view-${raw}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
        let cancelled = false;
        void recordDownloadFileView(raw)
            .then(({ views }) => {
                if (!cancelled) setViewsCount(views);
            })
            .catch(() => {
                sessionStorage.removeItem(key);
            });
        return () => {
            cancelled = true;
        };
    }, [raw]);

    const handleDownload = async () => {
        setDownloadMsg(null);
        try {
            const { url } = await getDownloadFileUrl(raw);
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (err) {
            const e = err as ApiError;
            if (e.statusCode === 401) {
                const next = encodeURIComponent(router.asPath || '/downloads');
                router.push(`/login?next=${next}`);
                return;
            }
            if (e.statusCode === 403) {
                setMembershipModalOpen(true);
                return;
            }
            setDownloadMsg(e.message || 'Download failed. Please try again.');
        }
    };

    if (isLoading || !file) {
        return (
            <section className='container mx-auto px-4 pb-6'>
                <p className="text-sm text-gray-500">Loading…</p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className='container mx-auto px-4 pb-6'>
                <p className="text-sm text-red-600">File not found or unavailable.</p>
            </section>
        );
    }
console.log(file,"file")
  return (
      <>
          {membershipModalOpen && (
              <MembershipDownloadModal onClose={() => setMembershipModalOpen(false)} />
          )}
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
                                  {file.title}
                              </h2>
                              </div>

                              <button
                                  type="button"
                                  onClick={handleDownload}
                                  className="bg-[#09339B] hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-lg "
                              >
                                  Download
                              </button>
                        
                      </div>
                      {downloadMsg && (
                          <p className="text-sm text-red-600 mb-4">{downloadMsg}</p>
                      )}

                      <hr className="mb-6" />

                      {/* Details Section */}
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 text-sm">

                          <div>
                              <p className="text-[#929292] mb-1">File Name</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md break-all">
                                  {file.title ? `${file.title}` : `file-${file.id}`}
                              </p>
                          </div>

                          {/* <div>
                              <p className="text-[#929292] mb-1">File Size</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md inline-block">—</p>
                          </div> */}

                          {/* <div>
                              <p className="text-[#929292] mb-1">Downloaded</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md inline-block">
                                  {(viewsCount ?? file.views ?? 0)} Times
                              </p>
                          </div> */}

                          {/* <div>
                              <p className="text-[#929292] mb-1">Submitted By</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md inline-block">
                                  {file.author_id != null ? String(file.author_id) : '—'}
                              </p>
                          </div> */}

                          <div>
                              <p className="text-[#929292] mb-1">Submitted Date</p>
                              <p className="text-gray-600 font-medium bg-[#F3F3F3] p-2 rounded-md inline-block whitespace-nowrap">
                                  {formatDownloadDateLong(file.created_at)}
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
