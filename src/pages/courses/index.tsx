import { GetServerSideProps } from 'next';
import { PublicLayout } from '@/components/layout';
import HeroSection_courses from '@/components/layout/course-listing/HeroSection.course';
import CoursesPage from '@/components/layout/course-listing/CoursesListing';
import Breadcrumbs from '@/components/Breadcrumb';
import { runWithServerApiBase } from '@/lib/serverApiContext';
import { getCourseCats, getCoursesByCategory, CourseQueryParams } from '@/services/platform.service';
import type { CourseCat, PaginatedCourses } from '@/types/models.types';

interface Props {
  cats: CourseCat[];
  initialCourses: PaginatedCourses;
  initialQuery: CourseQueryParams;
}

export default function Courses({ cats, initialCourses, initialQuery }: Props) {
  return (
    <PublicLayout>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4 mx-auto">
        <Breadcrumbs />
      </div>
      <HeroSection_courses />
      <CoursesPage cats={cats} initialCourses={initialCourses} initialQuery={initialQuery} />
      <div className='h-[50px]'/>
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  return runWithServerApiBase(ctx.req, async () => {
  const { query } = ctx;
  // Parse all filter/pagination params from the URL
  // Use null (not undefined) for absent values — Next.js cannot serialize undefined in props
  const category = typeof query.category === 'string' && query.category ? query.category : null;
  const page     = Math.max(1, parseInt(query.page as string) || 1);
  const search   = typeof query.q === 'string' ? query.q : '';
  const sort     = (['latest', 'newest', 'oldest'].includes(query.sort as string)
    ? query.sort as 'latest' | 'newest' | 'oldest'
    : 'latest');
  const price    = (['all', 'free', '0-500', '500-1000', '1000+'].includes(query.price as string)
    ? query.price as 'all' | 'free' | '0-500' | '500-1000' | '1000+'
    : 'all');

  const initialQuery: CourseQueryParams = { category, page, search, sort, price, limit: 9 };

  try {
    const [cats, initialCourses] = await Promise.all([
      getCourseCats(),
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
        initialCourses: { data: [], total: 0, page: 1, pageCount: 0 },
        initialQuery,
      },
    };
  }
  });
};
