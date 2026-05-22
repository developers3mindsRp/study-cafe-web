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
  getCoursePageSettingsPublic,
  getCourseSessionsForResolvedCourse,
  getPublishedCourses,
  getTestimonials,
} from "@/services/platform.service";
import type {
  CoursePublicDetail,
  CourseBatch,
  MediaTestimonial,
  PublicCourse,
} from "@/types/models.types";

interface CoursePageProps {
  course: CoursePublicDetail | null;
  batches: CourseBatch[];
  trendingCourses: PublicCourse[];
  galleryImages: string[];
  testimonials: MediaTestimonial[];
  isPreview?: boolean;
}

export default function CoursePage({
  course,
  batches,
  trendingCourses,
  galleryImages,
  testimonials,
  isPreview,
}: CoursePageProps) {
  return (
    <PublicLayout>
      {isPreview && (
        <div className="w-full bg-yellow-400 text-yellow-900 text-center text-sm font-semibold py-2 px-4">
           Preview — this is preview link.
        </div>
      )}
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
      
      <Testimonials_course items={testimonials} />
      {
        course?.faqs &&
         <GSTRCoursePage course={course} />
      }
     
      <Gallery images={galleryImages.length > 0 ? galleryImages : undefined} />
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

    const previewToken = typeof ctx.query.preview_token === "string" ? ctx.query.preview_token : null;

    const course = await getCourseBySlugOrId(segment, previewToken);
    if (!course) return { notFound: true };

    const isNumericSegment = /^\d+$/.test(segment);
    const canonical = course.slug?.trim();
    if (isNumericSegment && canonical) {
      const dest = previewToken
        ? `/course/${encodeURIComponent(canonical)}?preview_token=${encodeURIComponent(previewToken)}`
        : `/course/${encodeURIComponent(canonical)}`;
      return { redirect: { destination: dest, permanent: false } };
    }

    const [batches, allCourses, pageSettings, testimonials] = await Promise.all([
      getCourseSessionsForResolvedCourse(course),
      getPublishedCourses(),
      getCoursePageSettingsPublic(),
      getTestimonials().catch(() => []),
    ]);

    const trendingCourses = allCourses
      .filter((c) => String(c.id) !== String(course?.id))
      .slice(0, 6);

    return {
      props: {
        course,
        batches,
        trendingCourses,
        galleryImages: pageSettings.gallery_images ?? [],
        testimonials,
        isPreview: !!previewToken,
      },
    };
  });
};
