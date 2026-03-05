import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { queryKeys } from '@/lib/react-query';
import * as coursesService from '@/services/courses.service';
import { Header, PublicLayout } from '@/components/layout';

import HeroSection_courses from '@/components/layout/course-listing/HeroSection.course';
import CoursesPage from '@/components/layout/course-listing/CoursesListing';
import Breadcrumbs from '@/components/Breadcrumb';
import HeroSection_downloads from '@/components/layout/downloads/Bannersection.downloads';
import Sidebar from '@/components/layout/account/Sidebar';
import Sidebar_downloads from '@/components/layout/downloads/Sidebar.downloads';
import Categories_downloads from '@/components/layout/downloads/Categories.downloads';
import Accounts_downloads from '@/components/layout/downloads/Account.downloads';

/**
 * Home Page - Course Listing
 * 
 * This example shows how to use React Query with SSG (Static Site Generation)
 * for SEO-optimized course listings
 */

export default function Accounts() {
    const router = useRouter();
    // Use the hook on the client side - data is already prefetched on the server
    const { data: featuredCourses, isLoading, error } = useFeaturedCourses();



    return (
        <PublicLayout>

            {/* Breadcrumbs */}
            <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4">
                <div className="container mx-auto">
                    <Breadcrumbs />
                </div>
            </div>

          

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Section */}
                    <div className="w-full lg:w-[70%]">
                   <Accounts_downloads/>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-[30%]">
                        <Sidebar_downloads />
                    </div>

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
