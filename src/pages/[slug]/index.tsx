import Head from "next/head";
import { GetServerSideProps } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { PublicLayout } from "@/components/layout";
import {
  getPageContent,
  getSeoMetadata,
} from "@/services/platform.service";

type CMSPageProps = {
  cmsData: any;
  seo: any;
};

export default function CMSPage({ cmsData, seo }: CMSPageProps) {
  if (!cmsData) {
    return (
      <PublicLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold">Page Not Found</h1>
        </div>
      </PublicLayout>
    );
  }

  const meta = {
    title: seo?.title || cmsData?.title || "CMS Page",
    description: seo?.description || "",
  };

  return (
    <>
      {/* ✅ SEO */}
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />

        {/* Optional SEO */}
        {seo?.robots && <meta name="robots" content={seo.robots} />}
        {seo?.canonicalUrl && (
          <link rel="canonical" href={seo.canonicalUrl} />
        )}

        {/* Open Graph (recommended) */}
        {seo?.ogTitle && <meta property="og:title" content={seo.ogTitle} />}
        {seo?.ogDescription && (
          <meta property="og:description" content={seo.ogDescription} />
        )}
      </Head>

      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">
            {cmsData.title}
          </h1>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: cmsData.content || "",
            }}
          />
        </div>
      </PublicLayout>
    </>
  );
}

//
// ✅ getServerSideProps (FETCH BOTH APIs)
//
export const getServerSideProps: GetServerSideProps<
  CMSPageProps
> = async (context) => {
  const queryClient = new QueryClient();
  const slug = context.params?.slug as string;

  // WordPress-style article URLs (/{slug}-{id}.html) are rewritten to /blogs/[slug]
  if (/\.html$/i.test(slug)) {
    return { notFound: true };
  }

  try {
    // Optional react-query prefetch
  } catch (error) {
    console.error("Prefetch error:", error);
  }

  // ✅ Fetch both APIs in parallel (FAST)
  const [cmsData, seo] = await Promise.all([
    getPageContent(slug),
    getSeoMetadata(slug),
  ]);

  // ✅ Handle 404
  if (!cmsData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      cmsData,
      seo: seo || null,
    },
  };
};