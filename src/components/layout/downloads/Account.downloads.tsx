

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { getCategoryFiles, getDownloadCategories } from '@/services/downloads.service';
import { downloadFileHref, formatDownloadDateShort } from '@/utils/downloadsDisplay';

const FILES_PAGE_SIZE = 12;

type Props = {
    categorySlug: string;
};

const Accounts_downloads = ({ categorySlug }: Props) => {
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const slug = categorySlug ? decodeURIComponent(categorySlug) : '';

    useEffect(() => {
        const t = window.setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 400);
        return () => window.clearTimeout(t);
    }, [searchInput]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        setPage(1);
        setSearchInput('');
        setDebouncedSearch('');
    }, [slug]);

    const { data: categories = [] } = useQuery({
        queryKey: queryKeys.downloads.categories(),
        queryFn: getDownloadCategories,
    });

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: queryKeys.downloads.categoryFiles(slug, {
            page,
            limit: FILES_PAGE_SIZE,
            search: debouncedSearch,
        }),
        queryFn: () =>
            getCategoryFiles(slug, {
                page,
                limit: FILES_PAGE_SIZE,
                search: debouncedSearch || undefined,
            }),
        enabled: Boolean(slug),
        placeholderData: (prev) => prev,
    });

    const files = data?.data ?? [];
    const meta = data?.meta;

    const heading =
        categories.find((c) => c.slug === slug)?.name ??
        files[0]?.FileCats?.[0]?.name ??
        slug.replace(/-/g, ' ');

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

                      {/* Input — server-side search via API */}
                      <input
                          type="text"
                          placeholder="Search files in this category by title..."
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          className="w-full pl-14 pr-4 py-3 border border-[#EDF1F3] rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-[#49454F]"
                      />

                  </div>

                  <h2 className='text-[26px] font-normal text-[#252525] mb-4 capitalize'>
                      {heading || 'Downloads'}
                  </h2>
                  {meta != null && (
                      <p className="text-sm text-gray-500 mb-2">
                          {meta.total} file{meta.total === 1 ? '' : 's'}
                          {debouncedSearch ? ` matching “${debouncedSearch}”` : ''}
                      </p>
                  )}
                  {isLoading && !data && (
                      <p className="text-sm text-gray-500 mb-4">Loading files…</p>
                  )}
                  {isError && (
                      <p className="text-sm text-red-600 mb-4">Could not load files for this category.</p>
                  )}
          
              </div>
           
              <div className="grid md:grid-cols-2 gap-4">
                  {files.map((item) => (
                      <Link
                          key={item.id}
                          href={downloadFileHref(item.slug, item.id)}
                          className="block"
                      >
                      <div
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

              {!isLoading && files.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                      No files found{debouncedSearch ? ' for your search.' : ' in this category.'}
                  </p>
              )}

              {meta != null && meta.totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                      <button
                          type="button"
                          disabled={!meta.hasPreviousPage || isFetching}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className="px-4 py-2 rounded-lg border border-[#EDF1F3] bg-white text-[#454545] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#9FBBFF]"
                      >
                          Previous
                      </button>
                      <span className="text-sm text-[#454545]">
                          Page {meta.page} of {meta.totalPages}
                      </span>
                      <button
                          type="button"
                          disabled={!meta.hasNextPage || isFetching}
                          onClick={() => setPage((p) => p + 1)}
                          className="px-4 py-2 rounded-lg border border-[#EDF1F3] bg-white text-[#454545] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#9FBBFF]"
                      >
                          Next
                      </button>
                  </div>
              )}

          </section>

     
      
      
      
      
      
      </>
  )
}

export default Accounts_downloads
