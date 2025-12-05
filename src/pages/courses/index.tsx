import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { queryKeys } from '@/lib/react-query';
import * as coursesService from '@/services/courses.service';
import { Header, PublicLayout } from '@/components/layout';

import GSTRCoursePage from '@/components/layout/course/CourseDetail';
import BannerSection from '@/components/layout/course/BannerSection';
import CourseTabs from '@/components/layout/course/CourseDesc';
import Breadcrumb from '@/Breadcrumb';
import SidebarCourseCard from '@/components/layout/course/Sidebar';
import TrendingCourses from '@/components/layout/course/TrendingCourses';

/**
 * Home Page - Course Listing
 * 
 * This example shows how to use React Query with SSG (Static Site Generation)
 * for SEO-optimized course listings
 */

export default function Course() {
  const router = useRouter();
  // Use the hook on the client side - data is already prefetched on the server
  const { data: featuredCourses, isLoading, error } = useFeaturedCourses();



  return (
    <PublicLayout>
   <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-10 mt-6 container">

        {/* LEFT CONTENT AREA */}
        <div className="lg:col-span-2 space-y-10">
          <BannerSection />
          <CourseTabs />
          <GSTRCoursePage />
        </div>

        {/* RIGHT SIDEBAR (COMMON + STICKY) */}
        <div className="lg:col-span-1">
          <SidebarCourseCard/>
        </div>
  

      </div>
            <TrendingCourses/>
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
