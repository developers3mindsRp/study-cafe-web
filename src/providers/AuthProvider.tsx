"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import * as authService from "@/services/auth.service";
import { getToken, getRefreshToken, clearAuthData, getUserData, setUserData } from "@/utils/auth.utils";
import type { User } from "@/types/models.types";

export type AuthContextValue = {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Convenience: active membership from /auth/me */
  hasActiveMembership: boolean;
  /** Site admin roles (not the same as admin panel operator unless role matches) */
  isAdminRole: boolean;
  refetchUser: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Always start false/null so SSR and first client render produce identical HTML.
  // useEffect runs only on the client after hydration — no mismatch.
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Runs once after hydration. Read cookies + localStorage here.
    const token = !!getToken();
    const saved = getUserData() as User | null;

    setHasToken(token);

    // Seed the React Query cache with the persisted user so the dashboard
    // renders immediately without a loading flash on every page reload.
    if (token && saved) {
      queryClient.setQueryData(queryKeys.auth.currentUser, saved);
    }

    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: user,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: authService.getCurrentUser,
    // Don't run until we've read the token from cookies on the client
    enabled: mounted && hasToken,
    staleTime: 10 * 60 * 1000,
    retry: 1,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (!isError) return;
    // Only clear session if there is truly no refresh token left.
    // The axios interceptor handles 401s when a refresh token exists.
    if (!getRefreshToken()) {
      clearAuthData();
      queryClient.setQueryData(queryKeys.auth.currentUser, null);
      queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
      setHasToken(false);
    }
  }, [isError, queryClient]);

  const logout = useCallback(() => {
    clearAuthData();
    queryClient.setQueryData(queryKeys.auth.currentUser, null);
    queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
    setHasToken(false);
  }, [queryClient]);

  // While not yet mounted (SSR / first paint) treat as loading if we will have a token.
  // After mount, isLoading only while we're waiting for /auth/me with no cached data.
  const cachedUser = !mounted
    ? undefined
    : (queryClient.getQueryData(queryKeys.auth.currentUser) as User | undefined);

  const resolvedUser = user ?? cachedUser;
  const isLoading = !mounted || (hasToken && isPending && !resolvedUser);
  const isAuthenticated = !!resolvedUser;

  const value = useMemo<AuthContextValue>(
    () => ({
      user: resolvedUser,
      isLoading,
      isAuthenticated,
      hasActiveMembership: !!resolvedUser?.hasActiveMembership,
      isAdminRole: resolvedUser ? ["admin", "super_admin"].includes(resolvedUser.role) : false,
      refetchUser: () => {
        refetch().then(({ data }) => {
          if (data) setUserData(data);
        });
      },
      logout,
    }),
    [resolvedUser, isLoading, isAuthenticated, refetch, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function useInvalidateSession() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    clearAuthData();
    queryClient.setQueryData(queryKeys.auth.currentUser, null);
    queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
  }, [queryClient]);
}
