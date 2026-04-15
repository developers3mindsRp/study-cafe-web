"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Client-side guard: redirects anonymous users to `/login` with return URL.
 */
export default function RequireAuth({
  children,
  loginPath = "/login",
}: {
  children: ReactNode;
  loginPath?: string;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) return;
    const next = encodeURIComponent(router.asPath || "/");
    router.replace(`${loginPath}?next=${next}`);
  }, [isAuthenticated, isLoading, router, loginPath]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-gray-600">
        Checking your session…
      </div>
    );
  }

  return <>{children}</>;
}
