import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken, getRefreshToken, setToken, clearAuthData } from '@/utils/auth.utils';
import { ApiError } from '@/types/api.types';

const getApiBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL)
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) {
    const url = (import.meta as any).env.VITE_API_BASE_URL as string;
    return url.replace(/\/?$/, '') + (url.endsWith('/api') ? '' : '/api');
  }
  return 'http://localhost:3000/api';
};

// Create Axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
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

    const url = originalRequest?.url || '';
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh');

    // Handle 401 — refresh access token (auth-service expects body.refreshToken)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      const refresh = getRefreshToken();
      if (!refresh) {
        clearAuthData();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await axios.post<{ success: boolean; data: { accessToken?: string; token?: string } }>(
          `${getApiBaseUrl()}/auth/refresh`,
          { refreshToken: refresh },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const accessToken = response.data?.data?.accessToken ?? response.data?.data?.token;
        if (accessToken) {
          setToken(accessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return axiosInstance(originalRequest);
        }
      } catch {
        clearAuthData();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Transform error for consistent handling
    const body = error.response?.data as { message?: string; error?: string } | undefined;
    const apiError: ApiError = {
      message:
        body?.message ||
        body?.error ||
        error.message ||
        'An unexpected error occurred',
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

