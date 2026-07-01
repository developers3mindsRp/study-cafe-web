import type { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { PublicLayout } from '@/components/layout';
import Breadcrumbs from '@/components/Breadcrumb';
import Sidebar_downloads from '@/components/layout/downloads/Sidebar.downloads';
import Accounts_downloads from '@/components/layout/downloads/Account.downloads';
import { queryKeys } from '@/lib/react-query';
import { runWithServerApiBase } from '@/lib/serverApiContext';
import {
    getCategoryFiles,
    getDownloadCategories,
} from '@/services/downloads.service';

type Props = {
    categorySlug: string;
    categoryTitle: string;
};

export default function DownloadsCategoryPage({ categorySlug, categoryTitle }: Props) {
    return (
        <PublicLayout>
            <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4">
                <div className="container mx-auto">
                    <Breadcrumbs content={[
                        {
                            label: "Downloads",
                            href: "/downloads",
                        },
                        {
                            label: categoryTitle,
                        },
                    ]} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-[70%]">
                        <Accounts_downloads categorySlug={categorySlug} />
                    </div>
                    <div className="w-full lg:w-[30%]">
                        <Sidebar_downloads />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    return runWithServerApiBase(ctx.req, async () => {
        const slug = ctx.params?.slug;
        if (!slug || typeof slug !== 'string') {
            return { notFound: true };
        }

        const queryClient = new QueryClient();
        let categoryTitle = slug.replace(/-/g, ' ');

        try {
            const categories = await queryClient.fetchQuery({
                queryKey: queryKeys.downloads.categories(),
                queryFn: getDownloadCategories,
            });
            const category = categories.find((c) => c.slug === slug);
            categoryTitle = category?.name ?? categoryTitle;

            await queryClient.prefetchQuery({
                queryKey: queryKeys.downloads.categoryFiles(slug, {
                    page: 1,
                    limit: 12,
                    search: '',
                }),
                queryFn: () =>
                    getCategoryFiles(slug, { page: 1, limit: 12 }),
            });
        } catch (error) {
            console.error(`Error loading downloads category "${slug}":`, error);
        }

        return {
            props: {
                categorySlug: slug,
                categoryTitle,
                dehydratedState: dehydrate(queryClient),
            },
        };
    });
};
