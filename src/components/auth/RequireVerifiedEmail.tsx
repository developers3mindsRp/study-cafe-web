"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Requires a logged-in user with verified email (use after RequireAuth).
 * Sends unverified users to `/verify-email` with return path.
 */
export default function RequireVerifiedEmail({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    if (user.emailVerified !== false) return;
    const next = encodeURIComponent(router.asPath || "/dashboard");
    router.replace(`/verify-email?next=${next}`);
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-gray-600">
        Checking your session…
      </div>
    );
  }

  if (user?.emailVerified === false) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-gray-600">
        Redirecting to email verification…
      </div>
    );
  }

  return <>{children}</>;
}
