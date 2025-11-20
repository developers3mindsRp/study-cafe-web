import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken, setToken, clearAuthData } from '@/utils/auth.utils';
import { ApiError } from '@/types/api.types';

// Create Axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Attach auth token to headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/auth/refresh`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );

        const { token } = response.data;
        
        if (token) {
          setToken(token);
          
          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth data and redirect to login
        clearAuthData();
        
        // Only redirect on client side
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Transform error for consistent handling
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      code: error.code,
      statusCode: error.response?.status,
      errors: error.response?.data?.errors,
    };

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', apiError);
    }

    return Promise.reject(apiError);
  }
);

export default axiosInstance;

// Helper function for GET requests
export const get = <T>(url: string, params?: any) => {
  return axiosInstance.get<T>(url, { params });
};

// Helper function for POST requests
export const post = <T>(url: string, data?: any) => {
  return axiosInstance.post<T>(url, data);
};

// Helper function for PUT requests
export const put = <T>(url: string, data?: any) => {
  return axiosInstance.put<T>(url, data);
};

// Helper function for PATCH requests
export const patch = <T>(url: string, data?: any) => {
  return axiosInstance.patch<T>(url, data);
};

// Helper function for DELETE requests
export const del = <T>(url: string) => {
  return axiosInstance.delete<T>(url);
};

