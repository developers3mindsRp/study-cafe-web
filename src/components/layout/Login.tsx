"use client";

import { useState } from "react";
import Link from "next/link";

import "react-phone-number-input/style.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useLogin } from "@/hooks/useAuth";
import type { ApiError } from "@/types/api.types";

export default function LoginPage() {
  const login = useLogin();

  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="h-screen flex flex-col md:flex-row   mx-auto  ">
      <div className="hidden md:w-1/2 bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat  text-white p-8 md:flex flex-col justify-center">
        <div className="relative border xl:w-[548px] h-auto xl:h-[280px] rounded-[35px] text-center mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-white/30 blur-xxl"></div>
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
          className="absolute right-4 xl:right-[80px] top-4 text-gray-500 hover:text-gray-800 text-xl font-bold z-20 md:border border-[#09339B] rounded-[10px] w-10 h-10 "
        >
          <span className="md:text-[#09339B] ">✕</span>
        </button>

        <img src="/images/studycafe_logo.svg" alt="" width="200px" height="200px" />
        <h2 className="text-[30px] md:text-[40px] font-semibold  pt-[8px]">Welcome</h2>
        <p className="text-[16px] md:text-[24px] text-[#AFAFAF] mb-6 pt-[10px]">
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
            <label className="flex items-center gap-2 text-[16px] text-[#AFAFAF]">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="text-[16px] text-[#09339B] cursor-not-allowed opacity-70">
              Forgot Password ?
            </span>
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
