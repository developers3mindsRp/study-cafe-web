import axiosInstance from '@/lib/axios';
import { User, UpdateProfileData, DashboardStats, UserCourse } from '@/types/models.types';
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
  
  const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
    '/user/avatar',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

