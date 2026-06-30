import type { GetStaticPaths, GetStaticProps } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { PublicLayout } from '@/components/layout';
import Breadcrumbs from '@/components/Breadcrumb';
import Sidebar_downloads from '@/components/layout/downloads/Sidebar.downloads';
import Categories_downloads from '@/components/layout/downloads/Categories.downloads';
import Details_downloads from '@/components/layout/downloads/Details.downloads';
import { queryKeys } from '@/lib/react-query';
import { getDownloadCategories, getDownloadFileBySlugOrId } from '@/services/downloads.service';

type Props = {
    fileSlug: string;
    fileTitle: string;
};

export default function DownloadsFileDetailPage({ fileSlug, fileTitle }: Props) {
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
                            label: fileTitle,
                        },
                    ]} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-[70%]">
                        <Details_downloads fileSlug={fileSlug} />
                        <Categories_downloads showSearch={false} />
                    </div>
                    <div className="w-full lg:w-[30%]">
                        <Sidebar_downloads />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
    const slug = ctx.params?.slug;
    if (!slug || typeof slug !== 'string') {
        return { notFound: true };
    }

    const queryClient = new QueryClient();
    let fileTitle: string;
    try {
        const file = await queryClient.fetchQuery({
            queryKey: queryKeys.downloads.file(slug),
            queryFn: () => getDownloadFileBySlugOrId(slug),
        });
        fileTitle = file.title;

        await queryClient.prefetchQuery({
            queryKey: queryKeys.downloads.categories(),
            queryFn: getDownloadCategories,
        });
    } catch {
        return { notFound: true };
    }

    return {
        props: {
            fileSlug: slug,
            fileTitle,
            dehydratedState: dehydrate(queryClient),
        },
        revalidate: 120,
    };
};
