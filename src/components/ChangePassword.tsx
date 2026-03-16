"use client";
type ChangePasswordModalProps = {
  onClose?: () => void
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-[350px] md:max-w-[400px] rounded-xl shadow-lg p-6 z-10">
        {/* Close Button */}
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

        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded"
              placeholder="********"
            />
          </div>

          <div>
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded"
              placeholder="Re-enter new password"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              className="px-4 py-2 bg-[#09339B] text-white rounded"
            >
              Update Password
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
