"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import {
  useRegisterQuick,
  useVerifyQuickSignupOtp,
  useResendVerificationEmail,
} from "@/hooks/useAuth";
import type { ApiError } from "@/types/api.types";

const FIELD_ERR_CLASS = "border border-red-500";
const INPUT_CLASS = "w-full border border-gray-300 px-3 py-1";
const labelCls = (hasErr: boolean) => (hasErr ? `${INPUT_CLASS} ${FIELD_ERR_CLASS}` : INPUT_CLASS);

type FieldName = "fullName" | "email" | "phone" | "password" | "confirmPassword" | "terms";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[A-Za-z\s]+$/;

function mapServerFieldToForm(field: string): FieldName | null {
  const simple = field.includes(".") ? (field.split(".").pop() as string) : field;
  const map: Partial<Record<string, FieldName>> = {
    name: "fullName",
    email: "email",
    phone: "phone",
    password: "password",
    confirmPassword: "confirmPassword",
  };
  return map[simple] ?? null;
}

/**
 * Checkout signup — name, email, mobile, password, then the email OTP inline.
 * The full profile form on /register is untouched; profession/city/state are
 * asked for after payment instead of before it.
 */
export default function QuickSignupPage() {
  const router = useRouter();
  const registerQuick = useRegisterQuick();
  const verifyOtp = useVerifyQuickSignupOtp();
  const resend = useResendVerificationEmail();

  const [step, setStep] = useState<"details" | "otp">("details");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpInfo, setOtpInfo] = useState<string | null>(null);

  const nextParam =
    typeof router.query.next === "string" && router.query.next.startsWith("/")
      ? router.query.next
      : null;
  const withNext = (path: string) =>
    nextParam ? `${path}?next=${encodeURIComponent(nextParam)}` : path;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const updatedValue = name === "fullName" ? value.replace(/[^A-Za-z\s]/g, "") : value;

    setForm((prev) => ({ ...prev, [name]: updatedValue }));
    setFieldErrors((err) => {
      const k = name as FieldName;
      if (!err[k]) return err;
      const next = { ...err };
      delete next[k];
      return next;
    });
    setFormError(null);
  }

  function handlePhoneChange(value: string | undefined) {
    setForm((prev) => ({ ...prev, phone: value || "" }));
    setFieldErrors((e) => {
      if (!e.phone) return e;
      const n = { ...e };
      delete n.phone;
      return n;
    });
  }

  function validateClient(): boolean {
    const err: Partial<Record<FieldName, string>> = {};
    const name = form.fullName.trim();

    if (!name) {
      err.fullName = "Full name is required.";
    } else if (name.length < 2) {
      err.fullName = "Please enter at least 2 characters.";
    } else if (!NAME_RE.test(name)) {
      err.fullName = "Full name can contain only letters and spaces.";
    }
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) {
      err.email = "Please enter a valid email address.";
    }
    if (!form.phone) {
      err.phone = "Mobile number is required.";
    } else if (!isValidPhoneNumber(form.phone)) {
      err.phone = "Please enter a valid phone number (with country code).";
    }
    if (form.password.length < 6) {
      err.password = "Password must be at least 6 characters.";
    } else if (form.password.length > 128) {
      err.password = "Password must be at most 128 characters.";
    }
    if (form.password !== form.confirmPassword) {
      err.confirmPassword = "Passwords do not match.";
    }
    if (!acceptedTerms) {
      err.terms = "You must accept the Terms & Conditions and Privacy Policy.";
    }

    setFieldErrors(err);
    return Object.keys(err).length === 0;
  }

  function applyServerDetails(details?: { field: string; message: string }[]) {
    if (!details?.length) return;
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const d of details) {
        const key = mapServerFieldToForm(d.field);
        if (key) next[key] = d.message.replace(/^"|"$/g, "");
      }
      return next;
    });
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validateClient()) return;

    try {
      await registerQuick.mutateAsync({
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setStep("otp");
      setOtpInfo(`We sent a 6-digit code to ${form.email.trim()}.`);
    } catch (err: unknown) {
      const api = err as ApiError;
      if (api.details?.length) applyServerDetails(api.details);

      const msg =
        api?.message || (err as Error)?.message || "Could not create your account. Try again.";

      // Existing account: point them at sign-in instead of leaving them stuck on a 409.
      if (api.statusCode === 409 || String(msg).toLowerCase().includes("duplicate")) {
        const lower = String(msg).toLowerCase();
        if (lower.includes("phone") || lower.includes("number")) {
          setFieldErrors((prev) => ({
            ...prev,
            phone: "This phone number is already registered. Sign in or use a different number.",
          }));
        } else {
          setFieldErrors((prev) => ({
            ...prev,
            email: "This email is already registered. Sign in to continue.",
          }));
        }
        setFormError(null);
        return;
      }
      if (!api.details?.length) setFormError(msg);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOtpError(null);
    const code = otp.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setOtpError("Enter the 6-digit code from your email.");
      return;
    }
    try {
      await verifyOtp.mutateAsync(code);
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Invalid or expired code. Try again or request a new one.";
      setOtpError(msg);
    }
  }

  async function handleResend() {
    setOtpError(null);
    setOtpInfo(null);
    try {
      await resend.mutateAsync();
      setOtpInfo("A new code was sent to your email.");
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Could not resend. Try again shortly.";
      setOtpError(msg);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row mx-auto">
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0A2E8A] via-[#09339B] to-[#061B52] px-8 py-10 flex-col">
        <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[22%] right-[20%] w-5 h-5 rounded-full bg-purple-400"></div>
        <div className="absolute bottom-[25%] left-[18%] w-6 h-6 rounded-full bg-cyan-300"></div>

        <div className="relative z-10 flex flex-col h-full w-full px-4 justify-between">
          <div>
            <img
              src="/images/studycafe_logo_white.svg"
              alt="StudyCafe"
              className="w-[200px] mb-8"
            />
            <h1 className="text-[42px] xl:text-[54px] leading-[52px] xl:leading-[64px] font-bold text-white">
              Start Your
              <span className="bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFFFFF] bg-clip-text text-transparent ml-4">
                Learning
              </span>
              <br />
              Journey
            </h1>
            <p className="text-white/80 text-[20px] leading-[34px] mt-7 max-w-[580px]">
              Access thousands of courses, get certified, and advance your career with StudyCafe.
            </p>
          </div>

          <div className="relative z-10 flex justify-center items-end flex-1 pt-6">
            <img
              src="/images/bg-image.png"
              alt=""
              className="w-full max-w-[650px] xl:max-w-[760px] h-auto object-contain"
            />
          </div>
        </div>
      </div>

      <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center mx-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute right-[4px] md:right-[40px] xl:right-[80px] top-4 text-gray-500 hover:text-gray-800 text-xl font-bold z-20 md:border border-[#09339B] rounded-[10px] w-10 h-10"
        >
          <span className="md:text-[#09339B]">✕</span>
        </button>

        <div className="xl:p-8">
          <img src="/images/studycafe_logo.svg" alt="" width="200px" height="200px" />

          {step === "details" ? (
            <>
              <h2 className="text-[20px] xl:text-[40px] font-semibold pt-[8px]">
                Create your account
              </h2>
              <p className="text-[16px] xl:text-[20px] text-[#3a3c3e] mb-6 pt-[5px] md:pt-[10px]">
                {nextParam
                  ? "Takes 30 seconds — then you can complete your purchase."
                  : "Just the essentials. You can fill in the rest later."}
              </p>

              <form onSubmit={handleDetailsSubmit} className="space-y-4 text-[16px] px-1" noValidate>
                <div>
                  <label htmlFor="fullName" className="block mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    className={labelCls(!!fieldErrors.fullName)}
                    placeholder="Name"
                  />
                  {fieldErrors.fullName && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    className={labelCls(!!fieldErrors.email)}
                    placeholder="Enter Email"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {fieldErrors.email}{" "}
                      <Link href={withNext("/login")} className="text-[#09339B] underline">
                        Sign in
                      </Link>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1" htmlFor="phone-input">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <PhoneInput
                    id="phone-input"
                    placeholder="Enter Mobile number"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    defaultCountry="IN"
                    limitMaxLength={true}
                    className={
                      fieldErrors.phone ? `${INPUT_CLASS} ${FIELD_ERR_CLASS}` : `${INPUT_CLASS}`
                    }
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block mb-1">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      className={
                        (fieldErrors.password
                          ? `${INPUT_CLASS} pr-10 ${FIELD_ERR_CLASS}`
                          : `${INPUT_CLASS} pr-10`) +
                        " rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      }
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeSlashIcon className="w-5 h-5" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block mb-1">
                    Confirm password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      className={
                        fieldErrors.confirmPassword
                          ? `${INPUT_CLASS} pr-10 ${FIELD_ERR_CLASS}`
                          : `${INPUT_CLASS} pr-10`
                      }
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeSlashIcon className="w-5 h-5" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword ? "Hide password" : "Show password"}
                      </span>
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-start gap-2 text-[16px] text-[#3a3c3e]">
                  <input
                    id="accept-terms"
                    type="checkbox"
                    className="mt-1 shrink-0"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      setFieldErrors((err) => {
                        if (!err.terms) return err;
                        const n = { ...err };
                        delete n.terms;
                        return n;
                      });
                    }}
                    aria-invalid={!!fieldErrors.terms}
                  />
                  <p className="leading-relaxed">
                    I agree with{" "}
                    <a href="#" className="text-[#09339B] hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#09339B] hover:underline">
                      Privacy Policy
                    </a>
                    <span className="text-red-600"> *</span>
                  </p>
                </div>
                {fieldErrors.terms && (
                  <p className="text-red-600 text-sm -mt-2 mb-1" role="alert">
                    {fieldErrors.terms}
                  </p>
                )}

                {formError && (
                  <p className="text-red-600" role="alert">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={registerQuick.isPending}
                  className="w-full bg-[#09339B] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {registerQuick.isPending ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p className="mt-4 text-[16px] text-[#3a3c3e] text-center">
                Already have an account?{" "}
                <Link href={withNext("/login")} className="text-[#09339B]">
                  Sign in
                </Link>
              </p>
              <p className="mt-2 text-[14px] text-[#6b6f73] text-center">
                Want to add your profession and location now?{" "}
                <Link href="/register" className="text-[#09339B]">
                  Use the full form
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-[20px] xl:text-[40px] font-semibold pt-[8px]">Check your inbox</h2>
              <p className="text-[16px] xl:text-[20px] text-[#3a3c3e] mb-6 pt-[5px] md:pt-[10px]">
                Enter the 6-digit code we emailed to{" "}
                <span className="font-semibold">{form.email.trim()}</span> to activate your account.
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-4 px-1">
                <div>
                  <label htmlFor="otp" className="block mb-1">
                    Verification code <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="______"
                    className="w-full border px-3 py-3 rounded-md tracking-[0.35em] text-center text-xl font-medium"
                    required
                  />
                </div>

                {otpError && (
                  <p className="text-red-600 text-sm" role="alert">
                    {otpError}
                  </p>
                )}
                {otpInfo && <p className="text-green-700 text-sm">{otpInfo}</p>}

                <button
                  type="submit"
                  disabled={verifyOtp.isPending}
                  className="w-full bg-[#09339B] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {verifyOtp.isPending ? "Verifying…" : "Verify and continue"}
                </button>

                <button
                  type="button"
                  disabled={resend.isPending}
                  onClick={() => void handleResend()}
                  className="w-full border border-[#09339B] text-[#09339B] py-2 rounded hover:bg-blue-50 disabled:opacity-60"
                >
                  {resend.isPending ? "Sending…" : "Resend code"}
                </button>
              </form>

              <p className="mt-6 text-[15px] text-[#6b6f73] text-center">
                No code yet? Check your spam folder before requesting another one.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
