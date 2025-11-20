import axiosInstance from '@/lib/axios';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User,
  ChangePasswordData 
} from '@/types/models.types';
import { ApiResponse } from '@/types/api.types';
import { setToken, setRefreshToken, setUserData, clearAuthData } from '@/utils/auth.utils';
import { shouldUseMock } from '@/config/app.config';
import { mockAuthApi } from '@/mocks/api.mock';

/**
 * Auth Service
 * Handles all authentication-related API calls
 */

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    const authResponse = await mockAuthApi.login(credentials);
    const { token, refreshToken, user } = authResponse;
    
    setToken(token);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    setUserData(user);
    
    return authResponse;
  }
  
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    credentials
  );
  
  const { token, refreshToken, user } = response.data.data;
  
  // Store token and user data
  setToken(token);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
  setUserData(user);
  
  return response.data.data;
};

// Register new user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    const authResponse = await mockAuthApi.register(userData);
    const { token, refreshToken, user } = authResponse;
    
    setToken(token);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    setUserData(user);
    
    return authResponse;
  }
  
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    userData
  );
  
  const { token, refreshToken, user } = response.data.data;
  
  // Store token and user data
  setToken(token);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
  setUserData(user);
  
  return response.data.data;
};

// Get current authenticated user
export const getCurrentUser = async (): Promise<User> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    const user = await mockAuthApi.getCurrentUser();
    setUserData(user);
    return user;
  }
  
  const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
  
  // Update stored user data
  setUserData(response.data.data);
  
  return response.data.data;
};

// Logout user
export const logout = async (): Promise<void> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    await mockAuthApi.logout();
    clearAuthData();
    return;
  }
  
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    // Even if the API call fails, clear local auth data
    console.error('Logout error:', error);
  } finally {
    clearAuthData();
  }
};

// Refresh access token
export const refreshToken = async (): Promise<string> => {
  // Use mock API if configured
  if (shouldUseMock()) {
    const token = await mockAuthApi.refreshToken();
    setToken(token);
    return token;
  }
  
  const response = await axiosInstance.post<ApiResponse<{ token: string }>>(
    '/auth/refresh'
  );
  
  const { token } = response.data.data;
  setToken(token);
  
  return token;
};

// Change password
export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await axiosInstance.post('/auth/change-password', data);
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<void> => {
  await axiosInstance.post('/auth/forgot-password', { email });
};

// Reset password with token
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await axiosInstance.post('/auth/reset-password', { token, password: newPassword });
};

// Verify email
export const verifyEmail = async (token: string): Promise<void> => {
  await axiosInstance.post('/auth/verify-email', { token });
};

