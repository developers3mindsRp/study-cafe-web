import { GetServerSideProps } from "next";
import { PublicLayout } from "@/components/layout";
import HeroSection_courses from "@/components/layout/course-listing/HeroSection.course";
import CoursesPage from "@/components/layout/course-listing/CoursesListing";
import Breadcrumbs from "@/components/Breadcrumb";
import { runWithServerApiBase } from "@/lib/serverApiContext";
import {
  getAllCategories,
  getCoursesByCategory,
  CourseQueryParams,
} from "@/services/platform.service";

import type {
  CourseCat,
  PaginatedCourses,
} from "@/types/models.types";

interface Props {
  cats: CourseCat[];
  initialCourses: PaginatedCourses;
  initialQuery: CourseQueryParams;
}

export default function CategoryPage({
  cats,
  initialCourses,
  initialQuery,
}: Props) {
  const category = initialQuery.category;
  const page = initialQuery.page || 1;

  const categoryLabel =
    (category && cats.find((c) => c.slug === category)?.name) ||
    (category
      ? category.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
      : "All");

  const breadcrumbItems =
    page > 1
      ? [
          { label: "Courses", href: "/courses" },
          { label: categoryLabel, href: `/course_cats/${category}` },
          { label: `Page ${page}` },
        ]
      : [{ label: "Courses", href: "/courses" }, { label: categoryLabel }];

  return (
    <PublicLayout>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4 mx-auto">
        <Breadcrumbs content={breadcrumbItems} />
      </div>

      <HeroSection_courses />

      <CoursesPage
        cats={cats}
        initialCourses={initialCourses}
        initialQuery={initialQuery}
      />

      <div className="h-[50px]" />
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  ctx
) => {
  return runWithServerApiBase(ctx.req, async () => {
    const slugParts = (ctx.params?.slug as string[]) || [];

    const category = slugParts[0] || null;

    let page = 1;

    if (
      slugParts.length >= 3 &&
      slugParts[1] === "page"
    ) {
      page = Number(slugParts[2]) || 1;
    }

    const search =
      typeof ctx.query.q === "string"
        ? ctx.query.q
        : "";

    const sort =
      typeof ctx.query.sort === "string"
        ? ctx.query.sort
        : "latest";

    const price =
      typeof ctx.query.price === "string"
        ? ctx.query.price
        : "all";

    const initialQuery: CourseQueryParams = {
      category,
      page,
      search,
      sort: sort as any,
      price: price as any,
      limit: 9,
    };

    try {
      const [cats, initialCourses] =
        await Promise.all([
          getAllCategories(),
          getCoursesByCategory(initialQuery),
        ]);

      return {
        props: {
          cats,
          initialCourses,
          initialQuery,
        },
      };
    } catch {
      return {
        props: {
          cats: [],
          initialCourses: {
            data: [],
            total: 0,
            page: 1,
            pageCount: 0,
          },
          initialQuery,
        },
      };
    }
  });
};