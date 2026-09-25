import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  getToken,
  getRefreshToken,
  setToken,
  clearAuthData,
} from '@/utils/auth.utils';
import { ApiError } from '@/types/api.types';
import {
  getPublicApiBaseFromEnv,
  getServerApiBaseFromContext,
} from '@/lib/apiBase';

// ================= BASE URL =================
const getApiBaseUrl = (): string => {
  const fromEnv = getPublicApiBaseFromEnv();
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined') {
    throw new Error(
      'Missing NEXT_PUBLIC_API_BASE_URL in study-cafe-web/.env',
    );
  }

  const fromSsrContext = getServerApiBaseFromContext();
  if (fromSsrContext) return fromSsrContext;

  throw new Error(
    'Missing NEXT_PUBLIC_API_BASE_URL in study-cafe-web/.env',
  );
};

// ================= AXIOS INSTANCE =================
const axiosInstance: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= REQUEST INTERCEPTOR =================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiBaseUrl();

    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔥 LOG API REQUEST
    if (process.env.NODE_ENV === 'development') {
      console.log('➡️ API CALL:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiError>) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const method = originalRequest?.method?.toUpperCase();
    const url = originalRequest?.baseURL
      ? `${originalRequest.baseURL}${originalRequest.url}`
      : originalRequest?.url;
    const status = error.response?.status;

    // 🔥 LOG FAILED API
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API FAILED:', {
        method,
        url,
        status,
        params: originalRequest?.params,
        requestData: originalRequest?.data,
        response: error.response?.data,
      });
    }

    const requestUrl = originalRequest?.url || '';
    const isAuthRoute =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh');

    // ================= HANDLE 401 =================
    if (
      status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      const refresh = getRefreshToken();

      if (!refresh) {
        clearAuthData();
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login')
        ) {
          const returnPath = window.location.pathname + window.location.search;
          window.location.href = `/login?next=${encodeURIComponent(returnPath)}`;
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await axios.post<{
          success: boolean;
          data: { accessToken?: string; token?: string };
        }>(
          `${getApiBaseUrl()}/auth/refresh`,
          { refreshToken: refresh },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const accessToken =
          response.data?.data?.accessToken ??
          response.data?.data?.token;

        if (accessToken) {
          setToken(accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ REFRESH TOKEN FAILED');
        }

        clearAuthData();
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login')
        ) {
          const returnPath = window.location.pathname + window.location.search;
          window.location.href = `/login?next=${encodeURIComponent(returnPath)}`;
        }
      }
    }

    // ================= NORMALIZE ERROR =================
    const body = error.response?.data as
      | { message?: string; error?: string; code?: string; errors?: any; details?: { field: string; message: string }[] }
      | undefined;

    const apiError: ApiError = {
      message:
        body?.message ||
        body?.error ||
        error.message ||
        'An unexpected error occurred',
      // The API's own reason (e.g. PASSWORD_NOT_SET) wins over axios's transport code.
      code: body?.code || error.code,
      statusCode: status,
      errors: body?.errors,
      details: body?.details,
    };

    return Promise.reject(apiError);
  }
);

// ================= EXPORT =================
export default axiosInstance;

// ================= HELPERS =================
export const get = <T>(url: string, params?: any) =>
  axiosInstance.get<T>(url, { params });

export const post = <T>(url: string, data?: any) =>
  axiosInstance.post<T>(url, data);

export const put = <T>(url: string, data?: any) =>
  axiosInstance.put<T>(url, data);

export const patch = <T>(url: string, data?: any) =>
  axiosInstance.patch<T>(url, data);

export const del = <T>(url: string) =>
  axiosInstance.delete<T>(url);