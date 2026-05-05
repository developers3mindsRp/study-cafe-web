"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/providers/AuthProvider";
import RequireAuth from "@/components/auth/RequireAuth";
import { useVerifyEmailOtp, useResendVerificationEmail } from "@/hooks/useAuth";
import type { ApiError } from "@/types/api.types";

/**
 * Post-registration email OTP verification (uses session Bearer token).
 */
function VerifyEmailInner() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const verify = useVerifyEmailOtp();
  const resend = useResendVerificationEmail();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;
    if (user.emailVerified !== false) {
      const next = router.query.next as string | undefined;
      void router.replace(next && next.startsWith("/") ? next : "/dashboard");
    }
  }, [user, isLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const code = otp.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    try {
      await verify.mutateAsync(code);
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Invalid or expired code. Try again or request a new one.";
      setError(msg);
    }
  }

  async function handleResend() {
    setResendMsg(null);
    setError(null);
    try {
      await resend.mutateAsync();
      setResendMsg("A new code was sent to your email.");
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Could not resend. Try again shortly.";
      setError(msg);
    }
  }

  if (isLoading || !user || user.emailVerified !== false) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 px-4">
        One moment…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row mx-auto">
      <div className="hidden md:w-1/2 bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat text-white p-8 md:flex flex-col justify-center">
        <div className="relative border xl:w-[548px] h-auto xl:h-[280px] rounded-[35px] text-center mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-white/30 blur-xxl" />
          <div className="relative z-10 px-6 py-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Verify your email</h1>
            <p className="text-lg md:text-xl opacity-95">
              We sent a one-time code to <span className="font-semibold">{user.email}</span>. Enter it
              below to unlock your account.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full xl:w-1/3 p-6 flex flex-col justify-center md:mx-auto relative max-w-lg">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 text-xl font-bold z-20 md:border border-[#09339B] rounded-[10px] w-10 h-10 "
        >
          <span className="md:text-[#09339B]">✕</span>
        </button>

        <h2 className="text-[30px] md:text-[40px] font-semibold pt-2">Check your inbox</h2>
        <p className="text-[16px] md:text-[18px] text-[#AFAFAF] mb-6 pt-2">
          Enter the 6-digit code we emailed you. Without verification, course checkout and your
          dashboard stay locked.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 px-1">
          <div>
            <label htmlFor="otp" className="block mb-1">
              Verification code <span className="text-red-600">*</span>
            </label>
            <input
              id="otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="______"
              className="w-full border px-3 py-3 rounded-md tracking-[0.35em] text-center text-xl font-medium"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {resendMsg && <p className="text-green-700 text-sm">{resendMsg}</p>}

          <button
            type="submit"
            disabled={verify.isPending}
            className="w-full bg-[#09339B] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {verify.isPending ? "Verifying…" : "Verify and continue"}
          </button>

          <button
            type="button"
            disabled={resend.isPending}
            onClick={() => void handleResend()}
            className="w-full border border-[#09339B] text-[#09339B] py-2 rounded hover:bg-blue-50 disabled:opacity-60"
          >
            {resend.isPending ? "Sending…" : "Resend code"}
          </button>
        </form>

        <p className="mt-6 text-[15px] text-[#AFAFAF] text-center">
          Wrong account?{" "}
          <button
            type="button"
            className="text-[#09339B] underline"
            onClick={() => {
              logout();
              void router.push("/login");
            }}
          >
            Sign out and sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailScreen() {
  return (
    <RequireAuth>
      <VerifyEmailInner />
    </RequireAuth>
  );
}
