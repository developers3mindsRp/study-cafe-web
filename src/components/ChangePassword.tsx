"use client";

import { useState } from "react";
import { changePassword } from "@/services/auth.service";

type ChangePasswordModalProps = {
  onClose?: () => void;
};

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!current.trim()) { setError("Current password is required"); return; }
    if (newPw.length < 8) { setError("New password must be at least 8 characters"); return; }
    if (newPw !== confirm) { setError("Passwords do not match"); return; }
    if (current === newPw) { setError("New password must be different from current"); return; }

    setLoading(true);
    try {
      await changePassword({ currentPassword: current, newPassword: newPw, confirmPassword: confirm });
      setSuccess(true);
      setTimeout(() => onClose?.(), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to change password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white w-full max-w-[350px] md:max-w-[400px] rounded-xl shadow-lg p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-1">Change Password</h2>
        <p className="text-sm text-gray-500 mb-5">
          Enter your current password and choose a new one
        </p>

        {success ? (
          <div className="text-center py-6">
            <div className="text-green-600 text-lg font-medium mb-2">Password updated!</div>
            <p className="text-sm text-gray-500">Closing…</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded"
                placeholder="********"
              />
            </div>

            <div>
              <label className="text-sm font-medium">New Password</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Confirm New Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded"
                placeholder="Re-enter new password"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#09339B] text-white rounded disabled:opacity-60"
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
