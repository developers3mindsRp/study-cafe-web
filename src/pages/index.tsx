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
import {
  getHomePageData,
  getMemberships,
  getArticles,
  getCourseCats,
  getCoursesByCategory,
  ArticleListItem,
} from '@/services/platform.service';
import type { HomePageData, Membership, CourseCat, PublicCourse } from '@/types/models.types';
import CertificateLayout from '@/components/ui/CertificateLayout';

interface HomeProps {
  homePageData: HomePageData | null;
  memberships: Membership[] | null;
  initialArticles: ArticleListItem[];
  initialCourseCats: CourseCat[] | null;
  initialFeaturedCourses: PublicCourse[] | null;
}

export default function Home({
  homePageData,
  memberships,
  initialArticles,
  initialCourseCats,
  initialFeaturedCourses,
}: HomeProps) {
  return (
    <PublicLayout>
      {/* <CertificateLayout /> */}
      <HeroSection hero={homePageData?.hero} />
      <StatsSection stats={homePageData?.stats} />
      <FeaturedCourses
        initialCats={initialCourseCats}
        initialCourses={initialFeaturedCourses}
      />
      <MembershipPricing memberships={memberships ?? undefined} />
      <Testimonials testimonials={homePageData?.testimonials} />
      <BlogSection initialArticles={initialArticles} />
      <Learning/>
      <FAQSection faqs={homePageData?.faqs} />
    </PublicLayout>
  );
}

/** Fields the homepage course card actually renders. Everything else (notably the large
 *  `brief_description`) is dropped so it does not bloat the serialized __NEXT_DATA__ blob. */
function toHomeCourseCard(c: PublicCourse): PublicCourse {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug ?? null,
    price: c.price,
    sale_price: c.sale_price ?? null,
    thumbnail_url: c.thumbnail_url ?? null,
    // `?? 0` rather than `?? null`: getServerSideProps cannot serialize undefined, and the
    // card treats 0 the same as absent.
    enrolled_count: c.enrolled_count ?? 0,
    ratings: c.ratings ?? null,
    language: c.language ?? null,
  };
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  ctx
) => {
  return runWithServerApiBase(ctx.req, async () => {
    // allSettled (not all): each section degrades independently. With Promise.all a single
    // failing endpoint blanked every section on the page.
    const [home, plans, articlesData, cats, featured] = await Promise.allSettled([
      getHomePageData(),
      getMemberships(),
      // The homepage blog strip is a fixed 9-item row and ignores the count, so skip the
      // COUNT(*) over ~29k articles that otherwise dominates this request's latency.
      getArticles({ page: 1, limit: 9, withTotal: false }),
      // Fetched here rather than in a post-hydration useEffect: server-side these cost
      // ~10-15ms, whereas client-side they could not start until the JS bundle had
      // downloaded and React had hydrated.
      getCourseCats(),
      getCoursesByCategory({ limit: 24, sort: 'popular' }),
    ]);

    const unwrap = <T,>(r: PromiseSettledResult<T>, label: string): T | null => {
      if (r.status === 'fulfilled') return r.value;
      console.error(`Error fetching home data (${label}):`, r.reason);
      return null;
    };

    // Array.isArray guards rather than truthiness: a 200 response with an unexpected shape
    // would otherwise throw inside getServerSideProps and 500 the whole homepage. Anything
    // malformed degrades to the client-side fetch instead.
    const featuredCourses = unwrap(featured, 'featuredCourses');
    const featuredRows = Array.isArray(featuredCourses?.data) ? featuredCourses!.data : null;

    const courseCats = unwrap(cats, 'courseCats');
    const articleRows = unwrap(articlesData, 'articles')?.data;

    return {
      props: {
        homePageData: unwrap(home, 'homePageData'),
        memberships: unwrap(plans, 'memberships'),
        initialArticles: Array.isArray(articleRows) ? articleRows : [],
        initialCourseCats: Array.isArray(courseCats) ? courseCats : null,
        initialFeaturedCourses: featuredRows ? featuredRows.map(toHomeCourseCard) : null,
      },
    };
  });
};
