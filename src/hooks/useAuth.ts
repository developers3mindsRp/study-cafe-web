import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, type NextRouter } from 'next/router';
import * as authService from '@/services/auth.service';
import { queryKeys } from '@/lib/react-query';
import {
  LoginCredentials,
  LoginOtpCredentials,
  RegisterData,
  QuickRegisterData,
  ChangePasswordData,
  User,
} from '@/types/models.types';
import { useAuth } from '@/providers/AuthProvider';
import { getToken } from '@/utils/auth.utils';

function postAuthRelativeTarget(router: NextRouter): string {
  const next = router.query.next as string | undefined;
  const redirectLegacy = router.query.redirect as string | undefined;
  return (
    (next && next.startsWith('/') ? next : null) ||
    (redirectLegacy && redirectLegacy.startsWith('/') ? redirectLegacy : null) ||
    '/dashboard'
  );
}

function navigateAfterAuthenticated(router: NextRouter, user: User) {
  const target = postAuthRelativeTarget(router);
  if (user.emailVerified === false) {
    void router.push(`/verify-email?next=${encodeURIComponent(target)}`);
    return;
  }
  void router.push(target);
}

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
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      navigateAfterAuthenticated(router, data.user);
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      const target = postAuthRelativeTarget(router);
      void router.push(`/verify-email?next=${encodeURIComponent(target)}`);
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
};

/**
 * Checkout signup. Unlike useRegister it does not navigate: the OTP step runs
 * inline on the same screen, so the buyer never leaves the signup card.
 */
export const useRegisterQuick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: QuickRegisterData) => authService.registerQuick(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
    onError: (error: unknown) => {
      console.error('Quick registration failed:', error);
    },
  });
};

/** Flag the destination so the course page can re-surface its checkout panel. */
function resumeTarget(target: string): string {
  if (target === '/dashboard') return target;
  return target.includes('?') ? `${target}&resume=1` : `${target}?resume=1`;
}

/**
 * Inline OTP step of the checkout signup — returns the buyer to the course they
 * came from rather than to /dashboard like the standalone /verify-email page.
 */
export const useVerifyQuickSignupOtp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (otp: string) => authService.verifyEmailWithOtp(otp),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
      void queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      void router.push(resumeTarget(postAuthRelativeTarget(router)));
    },
    onError: (error: unknown) => {
      console.error('Signup verification failed:', error);
    },
  });
};

export const useLoginWithOtp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginOtpCredentials) => authService.loginWithEmailOtp(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      navigateAfterAuthenticated(router, data.user);
    },
    onError: (error: unknown) => {
      console.error('OTP login failed:', error);
    },
  });
};

export const useRequestLoginOtp = () => {
  return useMutation({
    mutationFn: (email: string) => authService.requestLoginOtp(email),
  });
};

export const useVerifyEmailOtp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (otp: string) => authService.verifyEmailWithOtp(otp),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
      void queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      const next = router.query.next as string | undefined;
      const dest = next && next.startsWith('/') ? next : '/dashboard';
      void router.push(dest);
    },
    onError: (error: unknown) => {
      console.error('Email verification failed:', error);
    },
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: () => authService.resendVerificationEmail(),
  });
};

/** Header & legacy callers — delegates to AuthProvider so tokens, cache, and hasToken reset together */
export const useLogout = () => {
  const router = useRouter();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      void router.push('/');
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

