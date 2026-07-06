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
import { runWithServerApiBase } from '@/lib/serverApiContext';
import { getHomePageData, getMemberships, getArticles, ArticleListItem } from '@/services/platform.service';
import type { HomePageData, Membership } from '@/types/models.types';
import CertificateLayout from '@/components/ui/CertificateLayout';

interface HomeProps {
  homePageData: HomePageData | null;
  memberships: Membership[] | null;
  initialArticles: ArticleListItem[];
}

export default function Home({ homePageData, memberships, initialArticles }: HomeProps) {
  return (
    <PublicLayout>
      {/* <CertificateLayout /> */}
      <HeroSection hero={homePageData?.hero} />
      <StatsSection stats={homePageData?.stats} />
      <FeaturedCourses />
      <MembershipPricing memberships={memberships ?? undefined} />
      <Testimonials testimonials={homePageData?.testimonials} />
      <BlogSection initialArticles={initialArticles} />
      <Learning/>
      <FAQSection faqs={homePageData?.faqs} />
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  ctx
) => {
  return runWithServerApiBase(ctx.req, async () => {
    let homePageData: HomePageData | null = null;
    let memberships: Membership[] | null = null;
    let initialArticles: ArticleListItem[] = [];

    try {
      const [home, plans, articlesData] = await Promise.all([
        getHomePageData(),
        getMemberships(),
        getArticles({ page: 1, limit: 9 }),
      ]);
      homePageData = home;
      memberships = plans;
      initialArticles = articlesData.data || [];
    } catch (error) {
      console.error('Error fetching home data:', error);
    }

    return {
      props: { homePageData, memberships, initialArticles },
    };
  });
};
