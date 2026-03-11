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
import HeroSection_about from '@/components/layout/about/Banner.About';
import Description_about from '@/components/layout/about/Description.About';
import Stats_about from '@/components/layout/about/StatsSection.about';
import Mission_about from '@/components/layout/about/Mission.about';
import Journey_about from '@/components/layout/about/Journey.about';

/**
 * Home Page - Course Listing
 * 
 * This example shows how to use React Query with SSG (Static Site Generation)
 * for SEO-optimized course listings
 */

export default function About() {
    const router = useRouter();
    // Use the hook on the client side - data is already prefetched on the server
    const { data: featuredCourses, isLoading, error } = useFeaturedCourses();



    return (


        <PublicLayout>
            <HeroSection_about />
            <Description_about />
            <Stats_about />
            <Mission_about />
            <Journey_about/>

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
