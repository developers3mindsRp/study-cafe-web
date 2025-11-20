import { useQuery } from '@tanstack/react-query';
import * as coursesService from '@/services/courses.service';
import { queryKeys } from '@/lib/react-query';
import { CourseFilters } from '@/types/api.types';

/**
 * Custom hooks for courses
 * These hooks are SSR-ready and can be used with Next.js data fetching
 */

// Hook to get list of courses with filters
export const useCourses = (filters?: CourseFilters) => {
  return useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => coursesService.getCourses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Keep previous data while fetching new data (for smooth transitions)
    placeholderData: (previousData) => previousData,
  });
};

// Hook to get single course by ID
export const useCourse = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => coursesService.getCourseById(id),
    enabled: !!id && enabled, // Only fetch if ID exists and enabled
    staleTime: 10 * 60 * 1000, // 10 minutes (course details change less frequently)
  });
};

// Hook to search courses
export const useSearchCourses = (query: string, filters?: Partial<CourseFilters>) => {
  return useQuery({
    queryKey: queryKeys.courses.search(query),
    queryFn: () => coursesService.searchCourses(query, filters),
    enabled: query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get featured courses
export const useFeaturedCourses = (limit: number = 6) => {
  return useQuery({
    queryKey: [...queryKeys.courses.all, 'featured', limit],
    queryFn: () => coursesService.getFeaturedCourses(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes (featured courses change infrequently)
  });
};

// Hook to get courses by category
export const useCoursesByCategory = (
  category: string,
  filters?: Partial<CourseFilters>
) => {
  return useQuery({
    queryKey: [...queryKeys.courses.all, 'category', category, filters],
    queryFn: () => coursesService.getCoursesByCategory(category, filters),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get course categories
export const useCategories = () => {
  return useQuery({
    queryKey: [...queryKeys.courses.all, 'categories'],
    queryFn: coursesService.getCategories,
    staleTime: 60 * 60 * 1000, // 1 hour (categories change very infrequently)
  });
};

// Hook to get related courses
export const useRelatedCourses = (courseId: string, limit: number = 4) => {
  return useQuery({
    queryKey: [...queryKeys.courses.all, 'related', courseId, limit],
    queryFn: () => coursesService.getRelatedCourses(courseId, limit),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000,
  });
};

