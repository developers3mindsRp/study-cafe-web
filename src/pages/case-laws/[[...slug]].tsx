import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { PublicLayout } from "@/components/layout";
import BannerSectionCaseLaws from "@/components/layout/case-laws/bannerSection";
import Breadcrumbs from "@/components/Breadcrumb";
import JudgementCard from "@/components/layout/case-laws/JudgementCard";

import { appConfig } from "@/config/app.config";
import { fetchSiteDisplayAdsSSR } from "@/lib/serverArticle";
import { runWithServerApiBase } from "@/lib/serverApiContext";


import {
  getAllCaseLaws,
  CaseLawItem,
} from "@/services/platform.service";

import type { SiteDisplayAds } from "@/types/models.types";

interface CaseLawsProps {
  caseLaws: CaseLawItem[];
  currentPage: number;
  totalPages: number;
  total: number;
  search: string;
  siteAds: SiteDisplayAds | null;
}
export default function CaseLaws({
  caseLaws,
  currentPage,
  totalPages,
  search,
}: CaseLawsProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearchSubmit = async () => {
    const value = searchInput.trim();

    setIsLoading(true);

    try {
      await router.push(
        value
          ? {
              pathname: "/case-laws",
              query: {
                search: value,
              },
            }
          : "/case-laws"
      );
    } finally {
      setIsLoading(false);
    }
  };
const handlePageChange = async (page: number) => {
  setIsLoading(true);

  try {
    const query =
      searchInput.trim() !== ""
        ? { search: searchInput.trim() }
        : {};

    await router.push(
      {
        pathname:
          page === 1
            ? "/case-laws"
            : `/case-laws/page/${page}`,
        query,
      },
      undefined,
      {
        shallow: false,
      }
    );
  } finally {
    setIsLoading(false);
  }
};

  const MAX_VISIBLE_PAGES = 6;

  const currentGroup = Math.floor((currentPage - 1) / MAX_VISIBLE_PAGES);

  const startPage = currentGroup * MAX_VISIBLE_PAGES + 1;

  const endPage = Math.min(
    startPage + MAX_VISIBLE_PAGES - 1,
    totalPages
  );

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
console.log(caseLaws,"caseLaws")
console.log(typeof document === 'undefined',"typeof document === 'undefined'")
  return (
    <PublicLayout>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4">
        <Breadcrumbs />
      </div>

      <BannerSectionCaseLaws  searchValue={searchInput}
      onSearchChange={setSearchInput}
      onSearchSubmit={handleSearchSubmit}/>

      <section className="w-full py-6 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseLaws.length > 0 ? (
              caseLaws.map((item) => (
                <JudgementCard
                  key={item.id}
                  title={item.title}
                  appealNumber={item.appeal_number}
                  judgementDate={item.judgement_date}
                  assessmentYear={item.assessment_year}
                  court={item.court}
                  onReadMore={() =>
                    router.push(`/${item.slug}.html`)
                  }
                  access={item.access}
                  onDownload={() => {
                    if (item.download_url) {
                      window.open(item.download_url, "_blank");
                    }
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                No Case Laws Found
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">

              {/* Previous */}
              <button
                disabled={currentPage === 1 || isLoading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded-full border  h-10 w-10  disabled:opacity-50"
              >
                 <img src="/images/f-left.svg" alt="Previous" className="block m-auto" />
              </button>

              {/* First Page */}
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="h-10 w-10 rounded-full border hover:bg-gray-100"
                  >
                    1
                  </button>

                  {startPage > 2 && (
                    <span className="px-1">...</span>
                  )}
                </>
              )}

              {/* Visible Pages */}
              {visiblePages.map((page) => (
                <button
                  key={page}
                  disabled={isLoading}
                  onClick={() => handlePageChange(page)}
                  className={`h-10 w-10 rounded-full border transition ${
                    currentPage === page
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Last Page */}
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="px-1">...</span>
                  )}

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="h-10 w-10 rounded-full border hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Next */}
              <button
                disabled={currentPage === totalPages || isLoading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded-full border  h-10 w-10  disabled:opacity-50"
              >
               <img src="/images/f-right.svg" alt="Next" className="block m-auto" />
              </button>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
export const getServerSideProps: GetServerSideProps<CaseLawsProps> = async (
  ctx
) => {
  return runWithServerApiBase(ctx.req, async () => {
    const slug = (ctx.params?.slug as string[] | undefined) || [];

    let page = 1;

    if (slug.length === 2 && slug[0] === "page") {
      page = Number(slug[1]) || 1;
    }

    const search =
      typeof ctx.query.search === "string"
        ? ctx.query.search.trim()
        : "";

    const token = ctx.req.cookies.auth_token;

    try {
      const [caseLawData, siteAds] = await Promise.all([
        getAllCaseLaws({
          page,
          limit: 6,
          search: search || undefined,
        },token),
        fetchSiteDisplayAdsSSR({
          baseUrl: appConfig.apiBaseUrl,
        }),
      ]);

      console.log(caseLawData.data,"caseLawData.data")

      return {
        props: {
          caseLaws: caseLawData.data || [],
          currentPage: caseLawData.page || page,
          totalPages: caseLawData.totalPages || 1,
          total: caseLawData.total || 0,
          search,
          siteAds: siteAds ?? null,
        },
      };
    } catch (error) {
      console.error("Case Laws Error:", error);

      return {
        props: {
          caseLaws: [],
          currentPage: 1,
          totalPages: 1,
          total: 0,
          search,
          siteAds: null,
        },
      };
    }
  });
};