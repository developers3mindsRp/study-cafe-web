import axiosInstance from '@/lib/axios';
import axios from 'axios';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ChangePasswordData,
} from '@/types/models.types';
import { ApiResponse } from '@/types/api.types';
import {
  setToken,
  setRefreshToken,
  setUserData,
  clearAuthData,
  getRefreshToken,
} from '@/utils/auth.utils';
import { shouldUseMock } from '@/config/app.config';
import { mockAuthApi } from '@/mocks/api.mock';

/** Raw auth payload from auth-service (login / register) */
type AuthPayload = {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user: {
    id: string | number;
    email: string;
    name: string;
    role: string;
    permissions?: string[];
  };
  expiresIn?: number;
};

function toUser(u: AuthPayload['user']): User {
  return {
    id: String(u.id),
    email: u.email,
    name: u.name || '',
    role: u.role || 'user',
    permissions: u.permissions ?? [],
  };
}

function persistAuth(payload: AuthPayload): AuthResponse {
  const access = payload.accessToken ?? payload.token;
  if (!access) throw new Error('No access token in auth response');
  const user = toUser(payload.user);
  setToken(access);
  if (payload.refreshToken) setRefreshToken(payload.refreshToken);
  setUserData(user);
  return {
    user,
    token: access,
    refreshToken: payload.refreshToken,
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (shouldUseMock()) {
    const authResponse = await mockAuthApi.login(credentials);
    setToken(authResponse.token);
    if (authResponse.refreshToken) setRefreshToken(authResponse.refreshToken);
    setUserData(authResponse.user);
    return authResponse;
  }

  const response = await axiosInstance.post<ApiResponse<AuthPayload>>(
    '/auth/login',
    credentials
  );
  return persistAuth(response.data.data);
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  if (shouldUseMock()) {
    const authResponse = await mockAuthApi.register(userData);
    setToken(authResponse.token);
    if (authResponse.refreshToken) setRefreshToken(authResponse.refreshToken);
    setUserData(authResponse.user);
    return authResponse;
  }

  const { email, password, name } = userData;
  const response = await axiosInstance.post<ApiResponse<AuthPayload>>('/auth/register', {
    email,
    password,
    name: name?.trim() || undefined,
  });
  return persistAuth(response.data.data);
};

export const getCurrentUser = async (): Promise<User> => {
  if (shouldUseMock()) {
    const user = await mockAuthApi.getCurrentUser();
    setUserData(user);
    return user;
  }

  const response = await axiosInstance.get<
    ApiResponse<{
      id: string | number;
      email: string;
      name: string;
      role: string;
      permissions?: string[];
    }>
  >('/auth/me');

  const d = response.data.data;
  const user: User = {
    id: String(d.id),
    email: d.email,
    name: d.name || '',
    role: d.role || 'user',
    permissions: d.permissions ?? [],
  };
  setUserData(user);
  return user;
};

export const logout = async (): Promise<void> => {
  if (shouldUseMock()) {
    await mockAuthApi.logout();
    clearAuthData();
    return;
  }
  clearAuthData();
};

export const refreshAccessToken = async (): Promise<string> => {
  if (shouldUseMock()) {
    const token = await mockAuthApi.refreshToken();
    setToken(token);
    return token;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const { data } = await axios.post<ApiResponse<{ accessToken: string }>>(
    `${axiosInstance.defaults.baseURL}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );
  const access = data.data.accessToken;
  setToken(access);
  return access;
};

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await axiosInstance.post('/auth/change-password', data);
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await axiosInstance.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await axiosInstance.post('/auth/reset-password', { token, password: newPassword });
};

export const verifyEmail = async (token: string): Promise<void> => {
  await axiosInstance.post('/auth/verify-email', { token });
};
