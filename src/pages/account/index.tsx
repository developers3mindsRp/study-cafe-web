import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { queryKeys } from '@/lib/react-query';
import * as coursesService from '@/services/courses.service';
import { PublicLayout } from '@/components/layout';
import SignUpPage from '@/components/layout/Register';
import LoginPage from '@/components/layout/Login';
import EditProfile from '@/components/layout/account/EditProfile';
import Breadcrumbs from '@/components/Breadcrumb';
import RequireAuth from '@/components/auth/RequireAuth';
import RequireVerifiedEmail from '@/components/auth/RequireVerifiedEmail';

/**
 * Home Page - Course Listing
 * 
 * This example shows how to use React Query with SSG (Static Site Generation)
 * for SEO-optimized course listings
 */

export default function Account() {
  const router = useRouter();
  // Use the hook on the client side - data is already prefetched on the server
  const { data: featuredCourses, isLoading, error } = useFeaturedCourses();



  return (
  

    <PublicLayout>
      <RequireAuth>
        <RequireVerifiedEmail>
      <div className="text-sm text-[#696969] bg-[#DDDDDD]  p-4  mx-auto">
        <Breadcrumbs />
      </div>
      <div className="container mx-auto p-6">
             

        <div className="mb-6">
          <h3 className="text-[30px] md:text-[40px] font-semibold">
            My Account
          </h3>

          <p className="text-[18px] md:text-[24px] text-[#454545] md:whitespace-nowrap">
            Manage your profile, subscription, and learning progress
          </p>
        </div>

        <EditProfile />

      </div>
        </RequireVerifiedEmail>
      </RequireAuth>
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
