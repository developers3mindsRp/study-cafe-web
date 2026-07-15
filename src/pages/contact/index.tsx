import { GetStaticProps } from "next";
import Head from "next/head";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import * as coursesService from "@/services/courses.service";
import { getPageContent, getSeoMetadata } from "@/services/platform.service";
import { PublicLayout } from "@/components/layout";
import ContactPage from "@/components/layout/contact/GetInTouch";
import MapSection from "@/components/layout/contact/FindUs";
import ContactInfo from "@/components/layout/contact/ContactInfo";
import { mergeContactPageFromCms, contactSeoOrFallback, type ContactPageData } from "@/lib/contact-page-data";
import type { SeoMetadata } from "@/types/models.types";

type ContactUsProps = {
  contactData: ContactPageData;
  seo: SeoMetadata | null;
};

export default function ContactUsIndex({ contactData, seo }: ContactUsProps) {
  const meta = contactSeoOrFallback(seo, contactData);
console.log("ContactUsIndex meta:", contactData);
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} key="description" />
        {seo?.robots && <meta name="robots" content={seo.robots} />}
        {seo?.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
      </Head>
      <PublicLayout>
        <ContactPage data={contactData} />
        <ContactInfo data={contactData} />
        <MapSection
          address={contactData.address}
          mapTitle={contactData.mapTitle}
          mapDescription={contactData.mapDescription}
        />
      </PublicLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<ContactUsProps> = async () => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.courses.all, "featured", 6],
      queryFn: () => coursesService.getFeaturedCourses(6),
    });
  } catch (error) {
    console.error("Error prefetching featured courses:", error);
  }

  const [cmsRow, seo] = await Promise.all([getPageContent("contact"), getSeoMetadata("contact")]);
  const contactData = mergeContactPageFromCms(cmsRow);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      contactData,
      seo,
    },
    revalidate: 600,
  };
};
