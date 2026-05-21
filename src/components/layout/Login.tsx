"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useLogin, useLoginWithOtp, useRequestLoginOtp } from "@/hooks/useAuth";
import type { ApiError } from "@/types/api.types";

type SignInMode = "password" | "otp";

export default function LoginPage() {
  const login = useLogin();
  const loginWithOtp = useLoginWithOtp();
  const requestOtp = useRequestLoginOtp();

  const [mode, setMode] = useState<SignInMode>("password");
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  function pickMode(next: SignInMode) {
    setMode(next);
    setErrors(null);
    setInfo(null);
    setOtpSent(false);
    setOtpCode("");
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);
    try {
      await login.mutateAsync({
        email: form.email.trim(),
        password: form.password,
      });
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Sign in failed. Check your email and password.";
      setErrors(msg);
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);
    setInfo(null);
    if (!form.email.trim()) {
      setErrors("Enter your email first.");
      return;
    }
    try {
      await requestOtp.mutateAsync(form.email.trim());
      setOtpSent(true);
      setInfo("If an account exists for this email, you will receive a 6-digit code shortly.");
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Could not send a code. Try again.";
      setErrors(msg);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);
    const code = otpCode.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setErrors("Enter the 6-digit code from your email.");
      return;
    }
    try {
      await loginWithOtp.mutateAsync({
        email: form.email.trim(),
        otp: code,
      });
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Invalid or expired code.";
      setErrors(msg);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="h-screen flex flex-col md:flex-row   mx-auto  ">
      <div className="hidden md:w-1/2 bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat  text-white p-8 md:flex flex-col justify-center">
       <div className="relative border border-white/20 xl:w-[548px] h-auto xl:h-[280px] rounded-[35px] text-center mx-auto overflow-hidden bg-white/10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.4)]">
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[40px] bg-black/20 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <img
              src="/images/study-logo.svg"
              alt=""
              width="221px"
              height="250px"
              className="mx-auto mt-[11px]"
            />
            <h1 className="text-[30px] md:text-4xl font-bold mb-4 pt-[12px] md:pb-[18px]">
              Start Your Learning <br />
              Journey
            </h1>
            <p className="text-[18px] md:text-[24px] pb-2 ">
              Access thousands of courses, get certified, <br className="hidden" /> and advance your
              career with StudyCafe{" "}
            </p>
          </div>
        </div>
      </div>

      <div className="xl:w-1/3 p-6 flex flex-col justify-center md:mx-auto relative">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="absolute right-4 xl:right-[30px] top-4 text-gray-500 hover:text-gray-800 text-xl font-bold z-20 md:border border-[#09339B] rounded-[10px] w-10 h-10 "
        >
          <span className="md:text-[#09339B] ">✕</span>
        </button>

        <img src="/images/studycafe_logo.svg" alt="" width="200px" height="200px" />
        <h2 className="text-[30px] md:text-[40px] font-semibold  pt-[8px]">Welcome</h2>
        <p className="text-[16px] md:text-[24px] text-[#3a3c3e] mb-6 pt-[10px]">
          Sign in to your account to continue learning
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-[16px] md:text-[16px] px-4">
          <div>
            <label htmlFor="email" className="block mb-1">
              Email <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="Enter your Email"
                className="w-full border px-3 py-2 pr-10 rounded-md"
              />
              <img
                src="/images/mail1.svg"
                alt=""
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="relative w-full">
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPwd ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                <span className="sr-only">{showPwd ? "Hide password" : "Show password"}</span>
              </button>
            </div>
          </div>

        <div className="flex justify-between items-center mt-4 pb-5">
        <label className="flex items-center gap-2 text-[16px] text-[#3a3c3e]">
            <input type="checkbox" />
            Remember me
        </label>

            <a
              onClick={() => setShowForgot(true)}
              className="text-[16px] text-[#09339B] cursor-pointer"
            >
              Forgot Password ?
            </a>

            {showForgot && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">

                  <h2 className="text-xl font-bold mb-3">Forgot Password</h2>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border px-3 py-2 rounded mb-4"
                  />

                  <button className="w-full bg-[#09339B] text-white py-2 rounded mb-2">
                    Send Reset Link
                  </button>

                  <button
                    onClick={() => setShowForgot(false)}
                    className="w-full text-gray-500"
                  >
                    Cancel
                  </button>

                </div>
              </div>
            )}
        <div className="flex gap-2 mb-6 px-4">
          <button
            type="button"
            onClick={() => pickMode("password")}
            className={`flex-1 py-2 rounded-md border text-sm font-medium ${
              mode === "password"
                ? "border-[#09339B] bg-[#09339B] text-white"
                : "border-gray-300 text-gray-700 bg-white"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => pickMode("otp")}
            className={`flex-1 py-2 rounded-md border text-sm font-medium ${
              mode === "otp"
                ? "border-[#09339B] bg-[#09339B] text-white"
                : "border-gray-300 text-gray-700 bg-white"
            }`}
          >
            Email code
          </button>
        </div>

        {mode === "password" ? (
          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-4 text-[16px] md:text-[16px] px-4"
          >
            <div>
              <label htmlFor="email" className="block mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="Enter your Email"
                  className="w-full border px-3 py-2 pr-10 rounded-md"
                />
                <img
                  src="/images/mail1.svg"
                  alt=""
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 text-sm font-medium">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPwd ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                  <span className="sr-only">{showPwd ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pb-5">
              <label className="flex items-center gap-2 text-[16px] text-[#AFAFAF]">
                <input type="checkbox" />
                Remember me
              </label>

              <a
                onClick={() => setShowForgot(true)}
                className="text-[16px] text-[#09339B] cursor-pointer"
              >
                Forgot Password ?
              </a>

              {showForgot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
                    <h2 className="text-xl font-bold mb-3">Forgot Password</h2>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full border px-3 py-2 rounded mb-4"
                    />

                    <button className="w-full bg-[#09339B] text-white py-2 rounded mb-2">
                      Send Reset Link
                    </button>

                    <button type="button" onClick={() => setShowForgot(false)} className="w-full text-gray-500">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {errors && <p className="text-red-600 text-sm">{errors}</p>}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-[#09339B] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {login.isPending ? "Signing in…" : "Login"}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-[16px] px-4">
            <form onSubmit={otpSent ? handleOtpSubmit : handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="otp-email" className="block mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="otp-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="Enter your Email"
                    className="w-full border px-3 py-2 pr-10 rounded-md"
                    disabled={otpSent}
                  />
                  <img
                    src="/images/mail1.svg"
                    alt=""
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label htmlFor="login-otp" className="block mb-1">
                    6-digit code <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="login-otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="______"
                    className="w-full border px-3 py-3 rounded-md tracking-[0.3em] text-center text-lg"
                    required={otpSent}
                  />
                  <button
                    type="button"
                    className="mt-2 text-sm text-[#09339B] hover:underline"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode("");
                    }}
                  >
                    Use a different email
                  </button>
                </div>
              )}

              {errors && <p className="text-red-600 text-sm">{errors}</p>}
              {info && <p className="text-gray-700 text-sm">{info}</p>}

              <button
                type="submit"
                disabled={requestOtp.isPending || loginWithOtp.isPending}
                className="w-full bg-[#09339B] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {otpSent
                  ? loginWithOtp.isPending
                    ? "Signing in…"
                    : "Sign in with code"
                  : requestOtp.isPending
                    ? "Sending code…"
                    : "Email me a code"}
              </button>
            </form>
          </div>
        )}

        <p className="mt-4 text-[16px] text-[#AFAFAF] text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#09339B]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
