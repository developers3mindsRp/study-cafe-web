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

export const blogData = [
  // #1--------
  {
    title: "Debt Mutual Funds for Monthly Income",
    subtitle: "How It Works?",
    description:
      "For many investors, especially retirees or those seeking regular cash flow, generating steady monthly income from investments is a key financial goal. While fixed deposits, government savings schemes, or annuities are traditional options, debt funds have increasingly become a popular alternative. They offer the potential for stable returns, liquidity, and tax efficiency — all while providing the flexibility to structure monthly income through specific strategies.",
    author: "Meetu Kumari",
    date: "Nov 18, 2025",
    update: "Nov 20, 2025",
    image: "/images/b4.png",

    cards: [
      {
        title: "Debt Mutual Funds for Monthly Income: How It Works?",
        description:
          "For many investors, especially retirees or those seeking regular cash flow, generating steady monthly income from investments is a key financial goal. While fixed deposits, government savings schemes, or annuities are traditional options, debt funds have increasingly become a popular alternative. They offer the potential for stable returns, liquidity, and tax efficiency — all while providing the flexibility to structure monthly income through specific strategies.",
        subDescription:
          "This article explains how debt mutual funds work, how you can use them for monthly income, and why understanding the expense ratio in mutual fund is crucial for maximising your returns.",
      },

    ],
  },

  // #2--------
  {
    title:
      "PSBs Approve Rs 52,300 Crore in MSME Loans Using New Credit Assessment Model",
    subtitle: "",
    description:
      "PSBs Approve Rs 52,300 Crore in MSME Loans Using New Credit Assessment Model",
    para1:
      "The Ministry of Finance recently shared a press release regarding MSME loan application approval under the new Credit Assessment Model.",
    para2:
      "In 2025, the Public Sector Banks (PSBs) launched the Credit Assessment Model (CAM) to decide loans for Micro, Small & Medium Enterprises (MSMEs) by looking at their digital footprints.",
    author: "Meetu Kumari",
    date: "Nov 18, 2025",
    update: "Nov 18, 2025",
    image: "/images/bank-loan.png",

    cards: [
      {
        title: "",
        description:
          "Between April 1 and December 31, 2025, public sector banks approved nearly 3.96 lakh loans for small and medium businesses using digital systems and sanctioned over Rs 52,300 crore.",
        subDescription:
          "This credit assessment model uses digitally sourced and verifiable data from the ecosystem to create automated workflows for evaluating MSME loan applications. It enables objective decision-making for all loan requests and provides model-driven limit recommendations for both Existing-to-Bank (ETB) and New-to-Bank (NTB) MSME borrowers.",
      },

    ],
  },
  // #3--------
  {
    title:
      "PSBs Approve Rs 52,300 Crore in MSME Loans Using New Credit Assessment Model",
    subtitle: "",
    description:
      "PSBs Approve Rs 52,300 Crore in MSME Loans Using New Credit Assessment Model",
    para1:
      "The Ministry of Finance recently shared a press release regarding MSME loan application approval under the new Credit Assessment Model.",
    para2:
      "In 2025, the Public Sector Banks (PSBs) launched the Credit Assessment Model (CAM) to decide loans for Micro, Small & Medium Enterprises (MSMEs) by looking at their digital footprints.",
    author: "Meetu Kumari",
    date: "Nov 18, 2025",
     update: "Nov 18, 2025",
    image: "/images/bank-loan.png",

    cards: [
      {
        title: "",
        description:
          "Between April 1 and December 31, 2025, public sector banks approved nearly 3.96 lakh loans for small and medium businesses using digital systems and sanctioned over Rs 52,300 crore.",
        subDescription:
          "This credit assessment model uses digitally sourced and verifiable data from the ecosystem to create automated workflows for evaluating MSME loan applications. It enables objective decision-making for all loan requests and provides model-driven limit recommendations for both Existing-to-Bank (ETB) and New-to-Bank (NTB) MSME borrowers.",
      },

    ],
  },
];



export default function Blog_detail() {
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
                para1={blog.para1}
                para2={blog.para2}
                author={blog.author}
                date={blog.date}
                update={blog.update}
                image={blog.image}
              />



              {/* Blog Cards */}
              {blog.cards?.map((card, cardIndex) => (
                <BlogHighlightCard
                  key={cardIndex}
                  title={card.title}
                  description={card.description}
                  subDescription={card.subDescription}
                  // showUpNext={cardIndex !== (blog.cards?.length ?? 0) - 1}

               
                />
              ))}
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
