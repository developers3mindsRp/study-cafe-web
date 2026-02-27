import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { useFeaturedCourses } from "@/hooks/useCourses";
import { queryKeys } from "@/lib/react-query";
import * as coursesService from "@/services/courses.service";
import { Header, PublicLayout } from "@/components/layout";

import HeroSection_courses from "@/components/layout/course-listing/HeroSection.course";
import CoursesPage from "@/components/layout/course-listing/CoursesListing";
import Paymentsection from "@/components/layout/course/payment/Paymentsection";
import PriceCard from "@/components/layout/course/payment/SidebarPayment";
import MembershipPricing from "@/components/layout/home/Member.home";
import PlansComparisonTable from "@/components/layout/membership/PlanCompare";

/**
 * Home Page - Course Listing
 *
 * This example shows how to use React Query with SSG (Static Site Generation)
 * for SEO-optimized course listings
 */

export default function Membership() {
  const router = useRouter();
  // Use the hook on the client side - data is already prefetched on the server
  const { data: featuredCourses, isLoading, error } = useFeaturedCourses();

  return (
    <PublicLayout>
      <MembershipPricing />
      <PlansComparisonTable />
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
      queryKey: [...queryKeys.courses.all, "featured", 6],
      queryFn: () => coursesService.getFeaturedCourses(6),
    });
  } catch (error) {
    console.error("Error prefetching data:", error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    // Revalidate every 10 minutes
    revalidate: 600,
  };
};
