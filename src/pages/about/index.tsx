import { GetStaticProps } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import * as coursesService from '@/services/courses.service';
import { getPageContent } from '@/services/platform.service';
import { PublicLayout } from '@/components/layout';
import HeroSection_about from '@/components/layout/about/Banner.About';
import Description_about from '@/components/layout/about/Description.About';
import Stats_about from '@/components/layout/about/StatsSection.about';
import Mission_about from '@/components/layout/about/Mission.about';
import Journey_about from '@/components/layout/about/Journey.about';
import Leader_about from '@/components/layout/about/Leaders.About';
import Teams_about from '@/components/layout/about/Teams.About';
import Manager_about from '@/components/layout/about/Manager.About';
import Awards_about from '@/components/layout/about/Awards.About';
import Gallery from '@/components/layout/course/Gallerysection';
import Feature_about from '@/components/layout/about/Feature.About';
import Message_about from '@/components/layout/about/Message.About';
import { AboutPageProvider } from '@/contexts/AboutPageContext';
import { mergeAboutPageFromCms } from '@/lib/about-page-data';
import type { AboutPageData } from '@/types/about-page.types';

type AboutPageProps = {
  aboutData: AboutPageData;
};

export default function About({ aboutData }: AboutPageProps) {
  return (
    <AboutPageProvider value={aboutData}>
      <PublicLayout>
        <HeroSection_about />
        <Description_about />
        <Stats_about />
        <Mission_about />
        <Journey_about />
        <Leader_about />
        <Manager_about />
        <Teams_about />
        <Awards_about />
        <Gallery showHeading={false} images={aboutData.gallery.images} />
        <Feature_about />
        <Message_about />
      </PublicLayout>
    </AboutPageProvider>
  );
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.courses.all, 'featured', 6],
      queryFn: () => coursesService.getFeaturedCourses(6),
    });
  } catch (error) {
    console.error('Error prefetching data:', error);
  }

  const cmsRow = await getPageContent('about');
  const aboutData = mergeAboutPageFromCms(cmsRow);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      aboutData,
    },
    revalidate: 600,
  };
};
