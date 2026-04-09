import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { queryKeys } from '@/lib/react-query';
import * as coursesService from '@/services/courses.service';
import { Header, PublicLayout } from '@/components/layout';
import BannerSection_blog from '@/components/layout/blog/BannerSection';
import Blog_list from '@/components/layout/blog/BlogList';
import Breadcrumbs from '@/components/Breadcrumb';
import Finance_list from '@/components/layout/blog/FinanceList';
import All_Courses from '@/components/layout/account/AllCourses';



/**
 * Home Page - Course Listing
 * 
 * This example shows how to use React Query with SSG (Static Site Generation)
 * for SEO-optimized course listings
 */

export default function AllCourses() {
    const router = useRouter();
    // Use the hook on the client side - data is already prefetched on the server
    const { data: featuredCourses, isLoading, error } = useFeaturedCourses();



    return (
        <PublicLayout>
            {/* Breadcrumbs banner se pehle */}
            <div className="text-sm text-[#696969] bg-[#DDDDDD]  p-4  mx-auto">
                <Breadcrumbs />
            </div>

           <All_Courses/>




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
