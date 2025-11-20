import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import * as authService from '@/services/auth.service';
import { queryKeys } from '@/lib/react-query';
import { LoginCredentials, RegisterData, User, ChangePasswordData } from '@/types/models.types';
import { isAuthenticated } from '@/utils/auth.utils';

/**
 * Custom hooks for authentication
 */

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated(), // Only fetch if user is authenticated
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry if unauthorized
  });
};

// Hook for login mutation
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      
      // Redirect to dashboard or intended page
      const redirectTo = (router.query.redirect as string) || '/dashboard';
      router.push(redirectTo);
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};

// Hook for register mutation
export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      
      // Redirect to home page
      router.push('/');
    },
  });
};

// Hook for change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => authService.changePassword(data),
    onSuccess: () => {
      console.log('Password changed successfully');
    },
    onError: (error: any) => {
      console.error('Password change failed:', error);
    },
  });
};

// Hook for password reset request
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
    onSuccess: () => {
      console.log('Password reset email sent');
    },
  });
};

// Hook for password reset
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
    onSuccess: () => {
      console.log('Password reset successful');
      router.push('/login');
    },
  });
};

// Hook to check if user is authenticated (client-side only)
export const useIsAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return isAuthenticated();
};

