import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from '@/types/api.types';
import {
  getPublicApiBaseFromEnv,
  getServerApiBaseFromContext,
} from '@/lib/apiBase';

/**
 * Axios instance for endpoints a signed-out visitor uses.
 *
 * Same base URL resolution and the same normalized ApiError as the main instance, minus two things
 * it must not have:
 *
 *  - No Authorization header. These endpoints take no token, and sending a stale one only invites
 *    a 401 that nothing here can recover from.
 *  - No 401 interceptor. The shared instance turns any 401 into `window.location.href = '/login'`,
 *    which on a public page throws the visitor onto a sign-in screen they have no account for.
 *
 * A separate instance rather than a skip-flag on the shared interceptor: smaller blast radius, and
 * the guarantee holds even if the shared interceptor changes later.
 */
const getApiBaseUrl = (): string => {
  const fromEnv = getPublicApiBaseFromEnv();
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined') {
    throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in study-cafe-web/.env');
  }

  const fromSsrContext = getServerApiBaseFromContext();
  if (fromSsrContext) return fromSsrContext;

  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in study-cafe-web/.env');
};

const publicAxios: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

publicAxios.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

publicAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const body = error.response?.data as
      | {
          message?: string;
          error?: string;
          errors?: Record<string, string[]>;
          details?: { field: string; message: string }[];
        }
      | undefined;

    const apiError: ApiError = {
      message:
        body?.message ||
        body?.error ||
        error.message ||
        'An unexpected error occurred',
      code: error.code,
      statusCode: error.response?.status,
      errors: body?.errors,
      details: body?.details,
    };

    return Promise.reject(apiError);
  },
);

export default publicAxios;
