import { GetServerSideProps } from 'next';
import { PublicLayout } from '@/components/layout';
import HeroSection from '@/components/layout/home/HeroSection.home';
import StatsSection from '@/components/layout/home/StaticSection.home';
import FeaturedCourses from '@/components/layout/home/Feature.home';
import MembershipPricing from '@/components/layout/home/Member.home';
import Testimonials from '@/components/layout/home/Testimonial.home';
import BlogSection from '@/components/layout/home/BlogSection.home';
import FAQSection from '@/components/layout/home/FaqSection.home';
import Learning from '@/components/layout/home/Learning.home';
import { getHomePageData, getMemberships } from '@/services/platform.service';
import type { HomePageData, Membership } from '@/types/models.types';

interface HomeProps {
  homePageData: HomePageData | null;
  memberships: Membership[] | null;
}

export default function Home({ homePageData, memberships }: HomeProps) {
  return (
    <PublicLayout>
      <HeroSection hero={homePageData?.hero} />
      <StatsSection stats={homePageData?.stats} />
      <FeaturedCourses />
      <MembershipPricing memberships={memberships ?? undefined} />
      <Testimonials testimonials={homePageData?.testimonials} />
      <BlogSection/>
      <Learning/>
      <FAQSection faqs={homePageData?.faqs} />
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  let homePageData: HomePageData | null = null;
  let memberships: Membership[] | null = null;

  try {
    [homePageData, memberships] = await Promise.all([
      getHomePageData(),
      getMemberships(),
    ]);
  } catch (error) {
    console.error('Error fetching home data:', error);
  }

  return {
    props: { homePageData, memberships },
  };
};
