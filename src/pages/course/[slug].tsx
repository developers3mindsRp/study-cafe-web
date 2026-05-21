import { GetServerSideProps } from "next";
import { PublicLayout } from "@/components/layout";
import BannerSection from "@/components/layout/course/BannerSection";
import CourseTabs from "@/components/layout/course/CourseDesc";
import CourseOverview from "@/components/layout/course/CourseOverview";
import ReviewSection from "@/components/layout/course/ReviewSection";
import Testimonials_course from "@/components/layout/course/TestimonialSection";
import GSTRCoursePage from "@/components/layout/course/CourseDetail";
import Gallery from "@/components/layout/course/Gallerysection";
import TrendingCourses from "@/components/layout/course/TrendingCourses";
import Breadcrumbs from "@/components/Breadcrumb";
import { runWithServerApiBase } from "@/lib/serverApiContext";
import {
  getCourseBySlugOrId,
  getCourseSessionsForResolvedCourse,
  getPublishedCourses,
} from "@/services/platform.service";
import type {
  CoursePublicDetail,
  CourseBatch,
  PublicCourse,
} from "@/types/models.types";

interface CoursePageProps {
  course: CoursePublicDetail | null;
  batches: CourseBatch[];
  trendingCourses: PublicCourse[];
}

export default function CoursePage({
  course,
  batches,
  trendingCourses,
}: CoursePageProps) {

  console.log(course,"course")
  return (
    <PublicLayout>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] px-1 p-4 mx-auto">
        <Breadcrumbs
          content={[
            {
              label: "Courses",
              href: "/courses",
            },
            {
              label: course?.title ?? "",
            },
          ]}
        />
      </div>

      <BannerSection course={course} batches={batches} />
      {
        course?.learn_outcomes &&
        <>
          <CourseTabs course={course} />
           <CourseOverview course={course} batches={batches} />
        </>
      }
      {
        course?.feedback &&
        <ReviewSection course={course} />

      }
      
      <Testimonials_course />
      {
        course?.faqs &&
         <GSTRCoursePage course={course} />
      }
     
      <Gallery />
      {
        trendingCourses &&
          <TrendingCourses courses={trendingCourses} />
      }
    
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<CoursePageProps> = async (
  ctx
) => {
  return runWithServerApiBase(ctx.req, async () => {
    const segment = ctx.params?.slug as string;
    if (!segment) return { notFound: true };

    const course = await getCourseBySlugOrId(segment);
    if (!course) return { notFound: true };

    const isNumericSegment = /^\d+$/.test(segment);
    const canonical = course.slug?.trim();
    if (isNumericSegment && canonical) {
      return {
        redirect: {
          destination: `/course/${encodeURIComponent(canonical)}`,
          permanent: false,
        },
      };
    }

    const [batches, allCourses] = await Promise.all([
      getCourseSessionsForResolvedCourse(course),
      getPublishedCourses(),
    ]);

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
  });
};
