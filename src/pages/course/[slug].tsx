import { GetServerSideProps } from 'next';
import { PublicLayout } from '@/components/layout';
import BannerSection from '@/components/layout/course/BannerSection';
import CourseTabs from '@/components/layout/course/CourseDesc';
import CourseOverview from '@/components/layout/course/CourseOverview';
import ReviewSection from '@/components/layout/course/ReviewSection';
import Testimonials_course from '@/components/layout/course/TestimonialSection';
import GSTRCoursePage from '@/components/layout/course/CourseDetail';
import Gallery from '@/components/layout/course/Gallerysection';
import TrendingCourses from '@/components/layout/course/TrendingCourses';
import Breadcrumbs from '@/components/Breadcrumb';
import { getCourseBySlug, getCourseSessionsBySlug, getPublishedCourses } from '@/services/platform.service';
import type { CoursePublicDetail, CourseBatch, Course } from '@/types/models.types';

interface CoursePageProps {
  course: CoursePublicDetail | null;
  batches: CourseBatch[];
  trendingCourses: Course[];
}

export default function CoursePage({ course, batches, trendingCourses }: CoursePageProps) {
  return (
    <PublicLayout>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4 mx-auto">
        <Breadcrumbs />
      </div>

      <BannerSection course={course} />
      <CourseTabs />
      <CourseOverview course={course} batches={batches} />
      <ReviewSection />
      <Testimonials_course />
      <GSTRCoursePage />
      <Gallery />
      <TrendingCourses courses={trendingCourses} />
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<CoursePageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  const [course, allCourses] = await Promise.all([
    getCourseBySlug(slug),
    getPublishedCourses(),
  ]);

  const batches = course ? await getCourseSessionsBySlug(slug) : [];

  // Exclude the current course from trending
  const trendingCourses = allCourses
    .filter((c) => String(c.id) !== String(course?.id))
    .slice(0, 6);

  return {
    props: {
      course,
      batches,
      trendingCourses,
    },
  };
};
