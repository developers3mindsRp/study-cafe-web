import axiosInstance from '@/lib/axios';
import { Course, CourseDetail } from '@/types/models.types';
import { ApiResponse, PaginatedResponse, CourseFilters } from '@/types/api.types';
import { shouldUseMock } from '@/config/app.config';
import { mockCoursesApi } from '@/mocks/api.mock';

/**
 * Courses Service
 * Handles all course-related API calls
 */

// Get list of courses with optional filters
export const getCourses = async (
  filters?: CourseFilters
): Promise<PaginatedResponse<Course>> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockCoursesApi.getCourses(filters);
  }
  
  const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Course>>>(
    '/courses',
    {
      params: filters,
    }
  );
  
  return response.data.data;
};

// Get single course by ID with full details
export const getCourseById = async (id: string): Promise<CourseDetail> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockCoursesApi.getCourseById(id);
  }
  
  const response = await axiosInstance.get<ApiResponse<CourseDetail>>(
    `/courses/${id}`
  );
  
  return response.data.data;
};

// Search courses by query
export const searchCourses = async (
  query: string,
  filters?: Partial<CourseFilters>
): Promise<PaginatedResponse<Course>> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockCoursesApi.searchCourses(query, filters);
  }
  
  const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Course>>>(
    '/courses/search',
    {
      params: {
        q: query,
        ...filters,
      },
    }
  );
  
  return response.data.data;
};

// Get featured courses
export const getFeaturedCourses = async (limit: number = 6): Promise<Course[]> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockCoursesApi.getFeaturedCourses(limit);
  }
  
  const response = await axiosInstance.get<ApiResponse<Course[]>>(
    '/courses/featured',
    {
      params: { limit },
    }
  );
  
  return response.data.data;
};

// Get courses by category
export const getCoursesByCategory = async (
  category: string,
  filters?: Partial<CourseFilters>
): Promise<PaginatedResponse<Course>> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockCoursesApi.getCoursesByCategory(category, filters);
  }
  
  const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Course>>>(
    `/courses/category/${category}`,
    {
      params: filters,
    }
  );
  
  return response.data.data;
};

// Get course categories
export const getCategories = async (): Promise<string[]> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockCoursesApi.getCategories();
  }
  
  const response = await axiosInstance.get<ApiResponse<string[]>>(
    '/courses/categories'
  );
  
  return response.data.data;
};

// Get related courses
export const getRelatedCourses = async (
  courseId: string,
  limit: number = 4
): Promise<Course[]> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockCoursesApi.getRelatedCourses(courseId, limit);
  }
  
  const response = await axiosInstance.get<ApiResponse<Course[]>>(
    `/courses/${courseId}/related`,
    {
      params: { limit },
    }
  );
  
  return response.data.data;
};

