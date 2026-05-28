import { useState } from "react";
import { useRequestPasswordReset } from "@/hooks/useAuth";
import type { ApiError } from "@/types/api.types";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const requestPasswordReset = useRequestPasswordReset();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        try {
            await requestPasswordReset.mutateAsync(email.trim());
            setMessage("If an account exists for this email, a reset link has been sent.");
        } catch (err: unknown) {
            const msg =
                (err as ApiError)?.message ||
                (err as Error)?.message ||
                "Could not send reset link. Try again.";
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-4">
                    Forgot Password
                </h2>

                <p className="text-sm text-gray-500 text-center mb-4">
                    Enter your email to receive a reset link
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full border px-3 py-2 rounded mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={requestPasswordReset.isPending}
                        className="w-full bg-[#09339B] text-white py-2 rounded disabled:opacity-60"
                    >
                        {requestPasswordReset.isPending ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
                {message && <p className="text-green-600 mt-3 text-center">{message}</p>}

            </div>
        </div>
    );
}
