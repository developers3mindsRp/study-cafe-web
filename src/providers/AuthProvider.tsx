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
import { getToken, clearAuthData } from "@/utils/auth.utils";
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
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Defer reading localStorage until after mount so SSR + first client paint match (avoids hydration mismatch).
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  const {
    data: user,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: authService.getCurrentUser,
    enabled: hasToken,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!isError) return;
    clearAuthData();
    queryClient.setQueryData(queryKeys.auth.currentUser, null);
    queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
  }, [isError, queryClient]);

  /** Session resolving (token present, /auth/me not finished) */
  const isLoading = hasToken && isPending && !user;
  const isAuthenticated = !!user;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      hasActiveMembership: !!user?.hasActiveMembership,
      isAdminRole: user ? ["admin", "super_admin"].includes(user.role) : false,
      refetchUser: () => refetch(),
    }),
    [user, isLoading, isAuthenticated, refetch]
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
