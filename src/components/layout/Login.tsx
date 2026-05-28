"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon , EnvelopeIcon } from "@heroicons/react/24/solid";
import { useLogin, useLoginWithOtp, useRequestLoginOtp, useRequestPasswordReset } from "@/hooks/useAuth";
import type { ApiError } from "@/types/api.types";

type SignInMode = "password" | "otp";

export default function LoginPage() {
  const login = useLogin();
  const loginWithOtp = useLoginWithOtp();
  const requestOtp = useRequestLoginOtp();
  const requestPasswordReset = useRequestPasswordReset();

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
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotInfo, setForgotInfo] = useState<string | null>(null);

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

  async function handleForgotSubmit() {
    setForgotError(null);
    setForgotInfo(null);
    const email = forgotEmail.trim() || form.email.trim();
    if (!email) {
      setForgotError("Enter your email address.");
      return;
    }
    try {
      await requestPasswordReset.mutateAsync(email);
      setForgotInfo("If an account exists for this email, you will receive a reset link shortly.");
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Could not send reset link. Try again.";
      setForgotError(msg);
    }
  }

  return (
    <div className="h-screen flex flex-col md:flex-row   mx-auto  ">
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0A2E8A] via-[#09339B] to-[#061B52] px-8 py-10 flex-col ">

        {/* Gradient Blur Effects */}
        <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-cyan-400/20 rounded-full blur-3xl"></div>

        {/* Floating Elements */}
        <div className="absolute top-[22%] right-[20%] w-5 h-5 rounded-full bg-purple-400"></div>

        <div className="absolute bottom-[25%] left-[18%] w-6 h-6 rounded-full bg-cyan-300"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col h-full w-full px-4 justify-between">

          {/* TOP CONTENT */}
          <div>

            {/* Logo */}
            <img
              src="/images/study-logo.svg"
              alt="StudyCafe"
              className="w-[200px] mb-8"
            />

            {/* Heading */}
            <h1 className="text-[42px] xl:text-[54px] leading-[52px] xl:leading-[64px] font-bold text-white ">

              Start Your

              <span className="bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFFFFF] bg-clip-text text-transparent ml-4">
                Learning
              </span>

              <br />

              Journey

            </h1>

            {/* Description */}
            <p className="text-white/80 text-[20px] leading-[34px] mt-7 max-w-[580px]">
              Access thousands of courses, get certified,
              and advance your career with StudyCafe.
            </p>

          </div>

          {/* ILLUSTRATION */}
  
        <div className="relative z-10 flex justify-center items-end flex-1 pt-6">

          <img
            src="/images/bg-image.png"
            alt=""
            className="w-full max-w-[650px] xl:max-w-[760px] h-auto object-contain"
          />

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
        <p className="text-[16px] md:text-[24px] text-[#3a3c3e] mb-4 pt-[10px]">
          Sign in to your account to continue learning
        </p>

        {/* <div className="flex gap-2 mb-6 px-4">
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
        
        </div> */}

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
              <label className="flex items-center gap-2 text-[16px] text-[#3a3c3e]">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setForgotEmail(form.email.trim());
                  setForgotError(null);
                  setForgotInfo(null);
                }}
                className="text-[16px] text-[#09339B] cursor-pointer"
              >
                Forgot Password ?
              </button>

              {showForgot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
                    <h2 className="text-xl font-bold mb-3">Forgot Password</h2>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full border px-3 py-2 rounded mb-4"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />

                    {forgotError && <p className="text-red-600 text-sm mb-2">{forgotError}</p>}
                    {forgotInfo && <p className="text-gray-700 text-sm mb-2">{forgotInfo}</p>}

                    <button
                      type="button"
                      onClick={handleForgotSubmit}
                      disabled={requestPasswordReset.isPending}
                      className="w-full bg-[#09339B] text-white py-2 rounded mb-2 disabled:opacity-60"
                    >
                      {requestPasswordReset.isPending ? "Sending..." : "Send Reset Link"}
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
        <div>
           <p className="mt-4 text-[16px] text-[#3a3c3e] text-center">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#09339B]">
                Sign up
              </Link>
            </p>
            {
              mode === "password" &&
                 <button
                type="button"
                onClick={() => pickMode("otp")}
                className={`flex py-3 rounded-md border text-sm font-medium px-4 m-auto mt-4 block w-[95%]  items-center justify-center`}
              >
                 <img
                  src="/images/mail1.svg"
                  alt=""
                  className="w-5 h-5 mr-2"
                /> Login With OTP
              </button>
            }
             

        </div>

       
      </div>
    </div>
  );
}