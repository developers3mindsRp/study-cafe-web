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
import {
  getToken,
  getRefreshToken,
  clearAuthData,
  getUserData,
  setUserData,
} from "@/utils/auth.utils";
import type { User } from "@/types/models.types";

export type AuthContextValue = {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasActiveMembership: boolean;
  isAdminRole: boolean;
  refetchUser: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = !!getToken();
    const savedUser = getUserData() as User | null;

    setHasToken(token);

    if (token && savedUser) {
      queryClient.setQueryData(
        queryKeys.auth.currentUser,
        savedUser
      );
    }

    setMounted(true);
  }, [queryClient]);

  const {
    data: user,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: authService.getCurrentUser,
    enabled: mounted && hasToken,
    staleTime: 10 * 60 * 1000,
    retry: 1,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (!isError) return;

    if (!getRefreshToken()) {
      clearAuthData();

      queryClient.removeQueries({
        queryKey: queryKeys.auth.currentUser,
      });

      setHasToken(false);
    }
  }, [isError, queryClient]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Clear local storage/cookies immediately
      clearAuthData();

      // Remove cached user
      queryClient.removeQueries({
        queryKey: queryKeys.auth.currentUser,
      });

      // Clear all React Query cache
      queryClient.clear();

      // Update auth state
      setHasToken(false);

      // Optional: redirect
      window.location.href = "/";
    }
  }, [queryClient]);

  const cachedUser = mounted
    ? (queryClient.getQueryData(
        queryKeys.auth.currentUser
      ) as User | undefined)
    : undefined;

  const resolvedUser = user ?? cachedUser;

  const isLoading =
    !mounted || (hasToken && isPending && !resolvedUser);

  const isAuthenticated = !!resolvedUser;

  const value = useMemo<AuthContextValue>(
    () => ({
      user: resolvedUser,
      isLoading,
      isAuthenticated,
      hasActiveMembership:
        !!resolvedUser?.hasActiveMembership,
      isAdminRole: resolvedUser
        ? ["admin", "super_admin"].includes(
            resolvedUser.role
          )
        : false,
      refetchUser: () => {
        refetch().then(({ data }) => {
          if (data) {
            setUserData(data);
          }
        });
      },
      logout,
    }),
    [
      resolvedUser,
      isLoading,
      isAuthenticated,
      refetch,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}

export function useInvalidateSession() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    clearAuthData();

    queryClient.removeQueries({
      queryKey: queryKeys.auth.currentUser,
    });

    queryClient.clear();
  }, [queryClient]);
}