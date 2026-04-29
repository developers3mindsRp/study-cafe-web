import { GetStaticProps } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import {
    getDownloadCategories,
    getRecentDownloadFiles,
} from '@/services/downloads.service';
import { PublicLayout } from '@/components/layout';

import Breadcrumbs from '@/components/Breadcrumb';
import HeroSection_downloads from '@/components/layout/downloads/Bannersection.downloads';
import Sidebar_downloads from '@/components/layout/downloads/Sidebar.downloads';
import Categories_downloads from '@/components/layout/downloads/Categories.downloads';

export default function Downloads() {
    return (
        <PublicLayout>
            <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4">
                <div className="container mx-auto">
                    <Breadcrumbs />
                </div>
            </div>

            <HeroSection_downloads />

            <div className="container mx-auto px-4 py-6 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-[70%]">
                        <Categories_downloads />
                    </div>
                    <div className="w-full lg:w-[30%]">
                        <Sidebar_downloads />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: queryKeys.downloads.categories(),
            queryFn: getDownloadCategories,
        });
        await queryClient.prefetchQuery({
            queryKey: queryKeys.downloads.recent(5),
            queryFn: () => getRecentDownloadFiles(5),
        });
    } catch (error) {
        console.error('Error prefetching downloads:', error);
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
        revalidate: 300,
    };
};
