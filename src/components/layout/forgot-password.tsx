import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
    

        // API call here
        setMessage("Password reset link sent to your email!");
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
                        className="w-full bg-[#09339B] text-white py-2 rounded"
                    >
                        Send Reset Link
                    </button>
                </form>

                {message && (
                    <p className="text-green-600 mt-3 text-center">{message}</p>
                )}

            </div>
        </div>
    );
}
