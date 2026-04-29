import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import { getDownloadCategories } from "@/services/downloads.service";

const Categories_downloads = ({ showSearch = true }) => {
  const [search, setSearch] = useState("");
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.downloads.categories(),
    queryFn: getDownloadCategories,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.slug && c.slug.toLowerCase().includes(q)),
    );
  }, [categories, search]);

  return (
    <>
      <section className="container mx-auto px-4 ">
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
                  placeholder="Search categories by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border border-[#EDF1F3] rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-[#49454F]"
                />
              </div>
            )}
          </div>

          <h2 className="text-[26px] font-normal text-[#252525] mb-4">
            Download Categories
          </h2>
          <p className="text-[#454545] text-[16px] mb-6">
            All Files Grouped by Category
          </p>
          {isLoading && (
            <p className="text-sm text-gray-500 mb-4">Loading categories…</p>
          )}
          {isError && (
            <p className="text-sm text-red-600 mb-4">
              Could not load categories. Please try again later.
            </p>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/files_cats/${encodeURIComponent(item.slug)}`}
              className="block"
            >
              <div className="flex items-center justify-between border px-4 py-3 rounded-lg hover:shadow-md transition bg-white shadow-md cursor-pointer hover:border-[#9FBBFF]">
                {/* Left Section */}

                <div className="flex items-center gap-4 ">
                  <img
                    src="/images/file.svg"
                    alt="File Icon"
                    className="w-10 h-10"
                  />

                  <div>
                    <p className="font-medium">{item.name}</p>
                    <span className="text-sm text-gray-500">
                      Total Files - {item.file_count}
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
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Categories_downloads;
