import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useResetPassword } from "@/hooks/useAuth";
import type { ApiError } from "@/types/api.types";

export default function ResetPasswordPage() {
  const router = useRouter();
  const resetPassword = useResetPassword();
  const token = useMemo(() => {
    const q = router.query.token;
    if (Array.isArray(q)) return q[0] || "";
    return typeof q === "string" ? q : "";
  }, [router.query.token]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Reset token is missing. Please use the latest link from your email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword.mutateAsync({ token, password });
      setSuccess("Your password has been updated. Redirecting to login...");
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Could not reset password. The link may be invalid or expired.";
      setError(msg);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-3">Reset Password</h1>
        <p className="text-sm text-gray-600 text-center mb-5">
          Enter a new password for your account.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="New password"
            autoComplete="new-password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Confirm new password"
            autoComplete="new-password"
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={resetPassword.isPending}
            className="w-full bg-[#09339B] text-white py-2 rounded disabled:opacity-60"
          >
            {resetPassword.isPending ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          <Link href="/login" className="text-[#09339B] hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

