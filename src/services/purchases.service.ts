import axiosInstance from '@/lib/axios';
import { Purchase, UserCourse } from '@/types/models.types';
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
  
  /** BFF: order-service enriches rows with course titles (see studycafe-ms GET /orders/my-purchases) */
  const response = await axiosInstance.get<ApiResponse<UserCourse[]>>(
    '/orders/my-purchases'
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

/** True if user may access course content (purchase or membership). Uses GET /access/check. */
export const checkPurchaseStatus = async (courseId: string): Promise<boolean> => {
  if (shouldUseMock()) {
    return mockPurchasesApi.checkPurchaseStatus(courseId);
  }
  const response = await axiosInstance.get<ApiResponse<{ allowed: boolean }>>(
    `/access/check?courseId=${encodeURIComponent(courseId)}`
  );
  return response.data.data?.allowed ?? false;
};

