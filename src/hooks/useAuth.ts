import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import * as authService from '@/services/auth.service';
import { queryKeys } from '@/lib/react-query';
import { LoginCredentials, RegisterData, ChangePasswordData } from '@/types/models.types';
import { useAuth } from '@/providers/AuthProvider';
import { getToken } from '@/utils/auth.utils';

/**
 * Custom hooks for authentication
 */

/** @deprecated Prefer useAuth() from @/providers/AuthProvider */
export const useCurrentUser = () => {
  const { user, isLoading, refetchUser } = useAuth();
  return {
    data: user,
    isPending: isLoading,
    isLoading,
    refetch: refetchUser,
  };
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
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
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
      queryClient.setQueryData(queryKeys.auth.currentUser, null);
      queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
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
  return !!getToken();
};

