import axiosInstance from '@/lib/axios';
import { Purchase, UserCourse, CourseProgress, LessonProgress } from '@/types/models.types';
import { ApiResponse } from '@/types/api.types';
import { shouldUseMock } from '@/config/app.config';
import { mockPurchasesApi } from '@/mocks/api.mock';

/**
 * Purchases Service
 * Handles purchase and course progress-related API calls
 */

// Create a new purchase
export const createPurchase = async (courseId: string): Promise<Purchase> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockPurchasesApi.createPurchase(courseId);
  }
  
  const response = await axiosInstance.post<ApiResponse<Purchase>>(
    '/purchases',
    { courseId }
  );
  
  return response.data.data;
};

// Get user's purchase history
export const getUserPurchases = async (): Promise<UserCourse[]> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockPurchasesApi.getUserPurchases();
  }
  
  const response = await axiosInstance.get<ApiResponse<UserCourse[]>>(
    '/purchases/my-purchases'
  );
  
  return response.data.data;
};

// Get purchase details
export const getPurchaseDetails = async (id: string): Promise<Purchase> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockPurchasesApi.getPurchaseDetails(id);
  }
  
  const response = await axiosInstance.get<ApiResponse<Purchase>>(
    `/purchases/${id}`
  );
  
  return response.data.data;
};

// Check if user has purchased a course
export const checkPurchaseStatus = async (courseId: string): Promise<boolean> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockPurchasesApi.checkPurchaseStatus(courseId);
  }
  
  const response = await axiosInstance.get<ApiResponse<{ purchased: boolean }>>(
    `/purchases/check/${courseId}`
  );
  
  return response.data.data.purchased;
};

// Get course progress
export const getCourseProgress = async (courseId: string): Promise<CourseProgress> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockPurchasesApi.getCourseProgress(courseId);
  }
  
  const response = await axiosInstance.get<ApiResponse<CourseProgress>>(
    `/progress/course/${courseId}`
  );
  
  return response.data.data;
};

// Update lesson progress
export const updateLessonProgress = async (
  lessonId: string,
  watchTime: number
): Promise<LessonProgress> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockPurchasesApi.updateLessonProgress(lessonId, watchTime);
  }
  
  const response = await axiosInstance.post<ApiResponse<LessonProgress>>(
    '/progress/lesson',
    {
      lessonId,
      watchTime,
    }
  );
  
  return response.data.data;
};

// Mark lesson as complete
export const markLessonComplete = async (lessonId: string): Promise<LessonProgress> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockPurchasesApi.markLessonComplete(lessonId);
  }
  
  const response = await axiosInstance.post<ApiResponse<LessonProgress>>(
    '/progress/lesson/complete',
    { lessonId }
  );
  
  return response.data.data;
};

// Get overall user progress
export const getOverallProgress = async (): Promise<CourseProgress[]> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockPurchasesApi.getOverallProgress();
  }
  
  const response = await axiosInstance.get<ApiResponse<CourseProgress[]>>(
    '/progress/overall'
  );
  
  return response.data.data;
};

