import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { queryKeys } from '@/lib/react-query';
import * as coursesService from '@/services/courses.service';
import { PublicLayout } from '@/components/layout';
import SignUpPage from '@/components/layout/Register';
import BannerSection_digital from '@/components/layout/marketing/BannerSection';
import Expert from '@/components/layout/marketing/Expert';
import Expert_marketing from '@/components/layout/marketing/Expert';
import Features_marketing from '@/components/layout/marketing/Features';
import Stats_marketing from '@/components/layout/marketing/Stats';
import Learning_marketing from '@/components/layout/marketing/Learning';
import Timer_marketing from '@/components/layout/marketing/Timer';
import Bonus_marketing from '@/components/layout/marketing/Bonus';
import Attend_marketing from '@/components/layout/marketing/Attend';
import Reviews_marketing from '@/components/layout/marketing/Reviews';
import Testimonials_marketing from '@/components/layout/marketing/Testimonial';
import Alumini_marketing from '@/components/layout/marketing/Alumini';
import Gallery from '@/components/layout/course/Gallerysection';
import Gallery_marketing from '@/components/layout/marketing/Gallery';
import Google_review from '@/components/layout/marketing/Google_review';
import Faqs_marketing from '@/components/layout/marketing/Faqs';
import Trainer_marketing from '@/components/layout/marketing/Trainer';

/**
 * Home Page - Course Listing
 * 
 * This example shows how to use React Query with SSG (Static Site Generation)
 * for SEO-optimized course listings
 */

export default function marketing() {
    const router = useRouter();
    // Use the hook on the client side - data is already prefetched on the server
    const { data: featuredCourses, isLoading, error } = useFeaturedCourses();



    return (
        <>
            <div className='bg-[#000A1F] text-white'>
                <BannerSection_digital />
                <Expert_marketing />
                <Features_marketing />
                <Stats_marketing />
                <Expert_marketing />
                <Learning_marketing />
                <Timer_marketing/>
                <Expert_marketing />
                <Bonus_marketing />
                <Attend_marketing />
                <Reviews_marketing />
                <Testimonials_marketing />
                <Expert_marketing />
                <Alumini_marketing />
                <Trainer_marketing/>
               <Gallery_marketing/>
                <Expert_marketing />
                <Google_review />
                <Faqs_marketing/>
                

            </div>
            
    </>
           



     
        
    


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
