import { GetStaticPaths, GetStaticProps } from 'next';
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
import CourseOverview from '@/components/layout/course/CourseOverview';
import ReviewForm from '@/components/layout/course/WriteReview';
import ReviewSection from '@/components/layout/course/ReviewSection';
import Testimonials_course from '@/components/layout/course/TestimonialSection';
import Gallery from '@/components/layout/course/Gallerysection';
import Breadcrumbs from '@/Breadcrumb';

/**
 * Home Page - Course Listing
 * 
 * This example shows how to use React Query with SSG (Static Site Generation)
 * for SEO-optimized course listings
 */

export default function Course() {
  const router = useRouter();
  const { data: featuredCourses, isLoading, error } = useFeaturedCourses();

  return (
    <PublicLayout>

      {/* Breadcrumbs banner se pehle */}
      <div className="text-sm text-[#696969] bg-[#DDDDDD]  p-4  mx-auto">
        <Breadcrumbs/>
      </div>
  

      <BannerSection />
      <CourseTabs />
      <CourseOverview />
      <ReviewSection />
      <Testimonials_course />
      <GSTRCoursePage />
      <Gallery />
      <TrendingCourses />

    </PublicLayout>
  );
}


/**
 * Define which course slugs to pre-render at build time.
 * fallback: 'blocking' generates unknown slugs on first request.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const { data } = await coursesService.getCourses({ limit: 100, page: 1 });
    const paths = (data ?? []).map((course) => ({
      params: { slug: course.id },
    }));
    return {
      paths,
      fallback: 'blocking',
    };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

/**
 * Static Site Generation (SSG)
 * Prefetch data at build time for SEO and performance
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
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
