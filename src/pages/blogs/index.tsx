import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { PublicLayout } from '@/components/layout';
import BannerSection_blog from '@/components/layout/blog/BannerSection';
import Blog_list from '@/components/layout/blog/BlogList';
import Breadcrumbs from '@/components/Breadcrumb';
import {
  getArticles,
  getArticleCategories,
  ArticleListItem,
  ArticleCategoryItem,
  PaginatedArticles,
} from '@/services/platform.service';


interface BlogsPageProps {
  articles: ArticleListItem[];
  categories: ArticleCategoryItem[];
  currentPage: number;
  totalPages: number;
  total: number;
  search: string;
  category: string;
}

export default function Blogs({
  articles,
  categories,
  currentPage,
  totalPages,
  search: initialSearch,
  category: initialCategory,
}: BlogsPageProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);

  const updateQuery = useCallback(
    (params: Record<string, string | number | undefined>) => {
      setIsLoading(true);
      const query: Record<string, string | number> = {};
      const page = params.page ?? currentPage;
      const search = params.search ?? initialSearch;
      const category = params.category ?? initialCategory;

      if (page && page !== 1) query.page = page;
      if (search) query.search = search;
      if (category) query.category = category;

      router.push({ pathname: '/blogs', query }, undefined, { shallow: false }).then(() => {
        setIsLoading(false);
      });
    },
    [router, currentPage, initialSearch, initialCategory]
  );

  const handleSearchSubmit = () => {
    updateQuery({ search: searchInput.trim(), page: 1 });
  };

  const handleCategoryChange = (slug: string) => {
    setSearchInput('');
    updateQuery({ category: slug || undefined, search: undefined, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateQuery({ page });
  };

  return (
    <PublicLayout>
      {/* Breadcrumbs */}
      <div className="text-sm text-[#696969] bg-[#DDDDDD]  p-4  mx-auto">
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
        activeCategory={initialCategory}
        currentPage={currentPage}
        totalPages={totalPages}
        onCategoryChange={handleCategoryChange}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<BlogsPageProps> = async ({ query }) => {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10));
  const search = query.search ? String(query.search).trim() : '';
  const category = query.category ? String(query.category).trim() : '';

  try {
    const [articlesData, categoriesData] = await Promise.all([
      getArticles({ page, limit: 6, search: search || undefined, category: category || undefined }),
      getArticleCategories(),
    ]);

    return {
      props: {
        articles: articlesData.data || [],
        categories: categoriesData || [],
        currentPage: articlesData.page || page,
        totalPages: articlesData.totalPages || 1,
        total: articlesData.total || 0,
        search,
        category,
      },
    };
  } catch (error) {
    console.error('Error fetching blogs data:', error);
    return {
      props: {
        articles: [],
        categories: [],
        currentPage: 1,
        totalPages: 1,
        total: 0,
        search,
        category,
      },
    };
  }
};
