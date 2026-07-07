import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { PublicLayout } from "@/components/layout";
import BannerSection_blog from "@/components/layout/blog/BannerSection";
import Blog_list from "@/components/layout/blog/BlogList";
import Breadcrumbs from "@/components/Breadcrumb";

import { appConfig } from "@/config/app.config";
import { fetchSiteDisplayAdsSSR } from "@/lib/serverArticle";
import { runWithServerApiBase } from "@/lib/serverApiContext";

import {
  getArticles,
  getArticleCategories,
  ArticleListItem,
  ArticleCategoryItem,
} from "@/services/platform.service";

import type { SiteDisplayAds } from "@/types/models.types";

interface BlogsPageProps {
  articles: ArticleListItem[];
  categories: ArticleCategoryItem[];
  currentPage: number;
  totalPages: number;
  total: number;
  search: string;
  category: string;
  siteAds: SiteDisplayAds | null;
}

export default function CategoryPage({
  articles,
  categories,
  currentPage,
  totalPages,
  search: initialSearch,
  category,
  siteAds,
}: BlogsPageProps) {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchSubmit = () => {
    setIsLoading(true);

    const query: Record<string, string> = {};

    if (searchInput.trim()) {
      query.search = searchInput.trim();
    }

    router
      .push(
        {
          pathname: `/category/${category}`,
          query,
        },
        undefined,
        { shallow: false }
      )
      .finally(() => setIsLoading(false));
  };

  const handleCategoryChange = (slug: string) => {
    setSearchInput("");
    setIsLoading(true);

    router
      .push(`/category/${slug}`)
      .finally(() => setIsLoading(false));
  };
const handlePageChange = (page: number) => {
  setIsLoading(true);

  let url =
    page <= 1
      ? `/category/${category}`
      : `/category/${category}/page/${page}`;

  if (searchInput.trim()) {
    url += `?search=${encodeURIComponent(searchInput.trim())}`;
  }

  router.push(url).finally(() => setIsLoading(false));
};

  return (
    <PublicLayout>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4 mx-auto">
        <Breadcrumbs />
      </div>

      <BannerSection_blog
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <Blog_list
        articles={articles}
        categories={categories}
        activeCategory={category}
        currentPage={currentPage}
        totalPages={totalPages}
        onCategoryChange={handleCategoryChange}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        listingSidebarAd={siteAds?.article_listing_sidebar ?? null}
        paginationMode="path"
      />
    </PublicLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return runWithServerApiBase(ctx.req, async () => {
    const slugParts = (ctx.params?.slug as string[]) || [];

    const category = slugParts[0] || "";

    let page = 1;

    if (slugParts[1] === "page" && slugParts[2]) {
      page = parseInt(slugParts[2], 10) || 1;
    }

    const search = String(ctx.query.search || "").trim();

    try {
      const [articlesData, categoriesData, siteAds] = await Promise.all([
        getArticles({
          page,
          limit: 6,
          category,
          search: search || undefined,
        }),
        getArticleCategories(),
        fetchSiteDisplayAdsSSR({
          baseUrl: appConfig.apiBaseUrl,
        }),
      ]);

      return {
        props: {
          articles: articlesData.data || [],
          categories: categoriesData || [],
          currentPage: page,
          totalPages: articlesData.totalPages || 1,
          total: articlesData.total || 0,
          search,
          category,
          siteAds: siteAds ?? null,
        },
      };
    } catch (error) {
      return {
        props: {
          articles: [],
          categories: [],
          currentPage: 1,
          totalPages: 1,
          total: 0,
          search,
          category,
          siteAds: null,
        },
      };
    }
  });
};