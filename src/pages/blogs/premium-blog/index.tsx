import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { queryKeys } from '@/lib/react-query';
import * as coursesService from '@/services/courses.service';
import { Header, PublicLayout } from '@/components/layout';
import HeroSection_blog from '@/components/layout/blog-list/HeroSection-blog';
import BlogDesc from '@/components/layout/blog-list/BlogDesc';
import SidebarBlog from '@/components/layout/blog-list/SidebarBlog';
import Breadcrumbs from '@/Breadcrumb';
import BlogHighlightCard from '@/components/layout/blog-list/BlogHighlightCard';
import Premium_user from '@/components/layout/blog-list/PremiumUser';

export const blogData = [
  // #1--------
  {
    title: "Debt Mutual Funds for Monthly Income",
    subtitle: "How It Works?",
    description:
      "For many investors, especially retirees or those seeking regular cash flow, generating steady monthly income from investments is a key financial goal. While fixed deposits, government savings schemes, or annuities are traditional options, debt funds have increasingly become a popular alternative. They offer the potential for stable returns, liquidity, and tax efficiency — all while providing the flexibility to structure monthly income through specific strategies.",
    author: "Janvi",
    date: "Jul 21, 2025",
    image: "/images/b4.png",

  }



];



export default function Premium_Blog() {
  const router = useRouter();
  // Use the hook on the client side - data is already prefetched on the server
  const { data: featuredCourses, isLoading, error } = useFeaturedCourses();



  return (

    <PublicLayout>

      {/* Breadcrumbs */}
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4">
        <Breadcrumbs />
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-10 mt-6">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-10">

          {blogData.map((blog, index) => (
            <div key={index} className="space-y-10">

              {/* Blog Hero */}
              <HeroSection_blog
                title={blog.title}
                subtitle={blog.subtitle}
                description={blog.description}
                // para1={blog.para1}
                // para2={blog.para2}
                author={blog.author}
                date={blog.date}
                image={blog.image}
              />

              <Premium_user/>




        
                             {/* Show Sidebar *after first blog* on mobile */}
          {index === 0 && (
            <div className="block lg:hidden">
              <SidebarBlog />
            </div>
          )}

            </div>
          ))}
          

          {/* Blog Description */}
          {/* <BlogDesc /> */}

        </div>

        <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <SidebarBlog />
        </div>


      </div>

    </PublicLayout>

  );
}

/**
 * Static Site Generation (SSG)
 * Prefetch data at build time for SEO and performance
 */
export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  try {
    // Prefetch featured courses
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.courses.all, 'featured', 6],
      queryFn: () => coursesService.getFeaturedCourses(6),
    });
  } catch (error) {
    console.error('Error prefetching data:', error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    // Revalidate every 10 minutes
    revalidate: 600,
  };
};
