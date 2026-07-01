import axiosInstance from '@/lib/axios';
import { User, UpdateProfileData, DashboardStats, UserCourse, UserSubscription, MembershipPlanCourses } from '@/types/models.types';
import { ApiResponse } from '@/types/api.types';
import { shouldUseMock } from '@/config/app.config';
import { mockUserApi } from '@/mocks/api.mock';

/**
 * User Service
 * Handles user profile and account-related API calls
 */

// Get user profile
export const getUserProfile = async (): Promise<User> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockUserApi.getUserProfile();
  }
  
  const response = await axiosInstance.get<ApiResponse<User>>('/user/profile');
  
  return response.data.data;
};

// Update user profile
export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockUserApi.updateProfile(data);
  }
  
  const response = await axiosInstance.patch<ApiResponse<User>>(
    '/user/profile',
    data
  );
  
  return response.data.data;
};

// Upload user avatar
export const uploadAvatar = async (file: File): Promise<string> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockUserApi.uploadAvatar(file);
  }
  
  const formData = new FormData();
  formData.append('avatar', file);

  // The axios instance defaults Content-Type to application/json (see lib/axios.ts).
  // For a multipart upload that default MUST NOT be sent: it overrides the
  // "multipart/form-data; boundary=..." header axios derives from FormData, and
  // without the boundary multer/busboy on the backend can't parse the file
  // (req.file ends up undefined → "No file uploaded").
  //
  // On axios v1, passing { 'Content-Type': undefined } per-request does NOT reliably
  // remove the instance-level `common` default, so we null it explicitly here and
  // let axios set the correct multipart header (with boundary) itself.
  const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
    '/user/avatar',
    formData,
    {
      headers: {
        // null tells axios to drop the header entirely for this request
        'Content-Type': null,
      } as any,
    }
  );

  return response.data.data.url;
};

// Get dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockUserApi.getDashboardStats();
  }
  
  const response = await axiosInstance.get<ApiResponse<DashboardStats>>(
    '/user/dashboard/stats'
  );
  
  return response.data.data;
};

// Get user's enrolled courses
export const getUserCourses = async (): Promise<UserCourse[]> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return mockUserApi.getUserCourses();
  }
  
  const response = await axiosInstance.get<ApiResponse<UserCourse[]>>(
    '/user/courses'
  );
  
  return response.data.data;
};

// Delete user account
export const deleteAccount = async (): Promise<void> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    return;
  }
  
  await axiosInstance.delete('/user/account');
};

export const getSubscriptionStatus = async (): Promise<UserSubscription> => {
  if (shouldUseMock()) {
    return { hasActiveMembership: false };
  }
  const response = await axiosInstance.get<ApiResponse<UserSubscription>>(
    '/user/subscription'
  );
  return response.data.data;
};

export const getMembershipCourses = async (): Promise<MembershipPlanCourses[]> => {
  if (shouldUseMock()) {
    return [];
  }
  const response = await axiosInstance.get<ApiResponse<MembershipPlanCourses[]>>(
    '/user/membership-courses'
  );
  return response.data.data;
};

