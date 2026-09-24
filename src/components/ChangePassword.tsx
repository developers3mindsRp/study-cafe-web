"use client";

import { useState } from "react";
import { changePassword, isPasswordNotSetError, requestPasswordReset } from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

type ChangePasswordModalProps = {
  onClose?: () => void;
};

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const { user } = useAuth();
  /** Set when the API reports no password even though the cached user said otherwise. */
  const [passwordMissing, setPasswordMissing] = useState(false);
  /**
   * Bought on a marketing page without creating an account: there is no current
   * password to ask for. The first one is set through the emailed reset link, which
   * proves they own the address (the checkout session was issued before that).
   */
  const needsFirstPassword = user?.hasPassword === false || passwordMissing;
  const [linkSent, setLinkSent] = useState(false);

  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


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
      if (isPasswordNotSetError(err)) {
        setPasswordMissing(true);
        return;
      }
      const msg = err?.response?.data?.message || err?.message || "Failed to change password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSetupLink = async () => {
    setError("");
    if (!user?.email) {
      setError("We couldn't find your email address. Please sign in again.");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(user.email);
      setLinkSent(true);
    } catch (err: any) {
      setError(err?.message || "Could not send the link. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  if (needsFirstPassword) {
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

          <h2 className="text-xl font-semibold mb-1">Set a Password</h2>
          {linkSent ? (
            <>
              <p className="text-sm text-gray-600 mb-5">
                Check your inbox — we sent a link to <span className="font-medium">{user?.email}</span>.
                It expires in 30 minutes.
              </p>
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                Close
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-5">
                Your account doesn&apos;t have a password yet — you&apos;ve been signing in with codes
                sent to <span className="font-medium">{user?.email}</span>. We&apos;ll email you a
                secure link to choose one.
              </p>

              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => void handleSendSetupLink()}
                  disabled={loading}
                  className="px-4 py-2 bg-[#09339B] text-white rounded disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Email me the link"}
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

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

                <div className="relative mt-1">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border rounded"
                    placeholder="Enter your current password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showCurrent ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

            <div>
              <label className="text-sm font-medium">New Password</label>
                <div className="relative mt-2">
                  <input
                    type={showNew ? "text" : "password"}  
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border rounded"
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNew ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                  </button>
    </div>
            </div>

            <div>
                <div className="relative mt-1">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <input
                    type={showConfirm ? "text" : "password"}  
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border rounded"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-0 text-gray-500"
                  >
                    {showConfirm ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                  </button>
      </div>
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
