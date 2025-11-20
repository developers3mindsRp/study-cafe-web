import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useCourse, useRelatedCourses } from '@/hooks/useCourses';
import { usePurchaseMutation, useCheckPurchaseStatus } from '@/hooks/usePurchases';
import { queryKeys } from '@/lib/react-query';
import * as coursesService from '@/services/courses.service';
import { PublicLayout } from '@/components/layout';

/**
 * Course Detail Page
 * 
 * This example shows how to use React Query with SSG and dynamic routes
 * The page is statically generated at build time for SEO optimization
 */

export default function CourseDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  // Fetch course details
  const { data: course, isLoading, error } = useCourse(id as string);
  
  // Check if user has purchased this course
  const { data: hasPurchased } = useCheckPurchaseStatus(id as string);
  
  // Get related courses
  const { data: relatedCourses } = useRelatedCourses(id as string, 3);
  
  // Purchase mutation
  const purchaseMutation = usePurchaseMutation();

  const handlePurchase = () => {
    if (id) {
      purchaseMutation.mutate(id as string, {
        onSuccess: () => {
          alert('Course purchased successfully!');
          router.push('/dashboard/courses');
        },
        onError: () => {
          alert('Failed to purchase course. Please try again.');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Loading course...</h2>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !course) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2 text-red-600">Course not found</h2>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600" />
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-600 text-lg mb-4">{course.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Category:</span> {course.category}
                  </div>
                  <div>
                    <span className="font-semibold">Level:</span> {course.level}
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span> {Math.floor(course.duration / 60)}h
                  </div>
                  <div>
                    <span className="font-semibold">Students:</span> {course.totalStudents}
                  </div>
                </div>
              </div>
              
              <div className="ml-8 text-right">
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  ${course.discountPrice || course.price}
                  {course.discountPrice && (
                    <span className="text-xl text-gray-400 line-through ml-2">
                      ${course.price}
                    </span>
                  )}
                </div>
                
                {hasPurchased ? (
                  <button
                    onClick={() => router.push(`/dashboard/courses/${id}`)}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Go to Course
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={purchaseMutation.isPending}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {purchaseMutation.isPending ? 'Processing...' : 'Purchase Course'}
                  </button>
                )}
              </div>
            </div>

            {/* Instructor Info */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-sm text-gray-600">Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? (
                <ul className="space-y-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Course learning outcomes will be added soon.</p>
              )}
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {index + 1}. {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                      )}
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                          >
                            <span className="text-sm">{lesson.title}</span>
                            <span className="text-xs text-gray-500">
                              {Math.floor(lesson.duration / 60)} min
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Course curriculum will be added soon.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              {course.requirements && course.requirements.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">No specific requirements.</p>
              )}
            </div>

            {/* Related Courses */}
            {relatedCourses && relatedCourses.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Related Courses</h3>
                <div className="space-y-4">
                  {relatedCourses.map((related) => (
                    <div
                      key={related.id}
                      onClick={() => router.push(`/courses/${related.id}`)}
                      className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    >
                      <h4 className="font-semibold text-sm mb-1">{related.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {related.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-semibold text-sm">
                          ${related.price}
                        </span>
                        <span className="text-xs text-gray-500">
                          {related.totalStudents} students
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </PublicLayout>
  );
}

/**
 * Generate static paths for all courses at build time
 * In production, you might want to only generate paths for popular courses
 * and use fallback: 'blocking' for others
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // For the example, we'll return empty paths and use fallback: 'blocking'
  // In production, you can fetch popular course IDs here
  return {
    paths: [],
    fallback: 'blocking', // Generate pages on-demand and cache them
  };
};

/**
 * Static Site Generation for course detail page
 */
export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as { id: string };
  const queryClient = new QueryClient();

  try {
    // Prefetch course details
    await queryClient.prefetchQuery({
      queryKey: queryKeys.courses.detail(id),
      queryFn: () => coursesService.getCourseById(id),
    });

    // Prefetch related courses
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.courses.all, 'related', id, 3],
      queryFn: () => coursesService.getRelatedCourses(id, 3),
    });
  } catch (error) {
    console.error('Error prefetching course:', error);
    // Return notFound if course doesn't exist
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    // Revalidate every hour
    revalidate: 3600,
  };
};

