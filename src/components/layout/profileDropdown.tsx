"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function UserDropdown({ user }: any) {
  const [open, setOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const {logout} =useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userRef.current &&
        !userRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={userRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#09339B] text-sm font-semibold text-white">
          {(user.name || user.email || "?").slice(0, 1).toUpperCase()}
        </span>

        <span className="max-w-[140px] truncate text-sm font-medium text-gray-900">
          {user.name || "Account"}
        </span>

        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b p-4">
            <p className="font-medium text-gray-900">
              {user.name || "Account"}
            </p>
            <p className="truncate text-sm text-gray-500">
              {user.email}
            </p>
          </div>

          <div className="py-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                // logout function
                logout();
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}