"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import { useRegister } from "@/hooks/useAuth";
import type { ApiError } from "@/types/api.types";
import 'react-phone-number-input/style.css';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import IndianStatesList  from "indian-states-cities-list";
import countryList from "country-list";
import { isValidPhoneNumber } from 'react-phone-number-input';

const FIELD_ERR_CLASS = "border border-red-500";
const INPUT_CLASS = "w-full border border-gray-300 px-3 py-1";
const labelCls = (hasErr: boolean) => (hasErr ? `${INPUT_CLASS} ${FIELD_ERR_CLASS}` : INPUT_CLASS);

type FieldName =
  | "fullName" | "email" | "phone" | "profession" | "company" | "designation"
  | "city" | "state" |  "password" | "confirmPassword" | "terms";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapServerFieldToForm(field: string): FieldName | null {
  if (field === "name" || field.endsWith(".name")) return "fullName";
  const simple = field.includes(".") ? (field.split(".").pop() as string) : field;
  if (simple === "name") return "fullName";
  const map: Partial<Record<string, FieldName>> = {
    email: "email",
    phone: "phone",
    profession: "profession",
    company: "company",
    designation: "designation",
    city: "city",
    state: "state",
    // country: "country",
    password: "password",
  };
  return map[simple] ?? null;
}

export default function SignUpPage() {
  const router = useRouter();
  const register = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    company: "",
    designation: "",
    city: "",
    state: "",
    country: "",
    gst: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handlePhoneChange = (value: string | undefined) => {
    setForm((prev) => ({ ...prev, phone: value || "" }));
    setFieldErrors((e) => {
      if (!e.phone) return e;
      const n = { ...e };
      delete n.phone;
      return n;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((err) => {
      const k = name as FieldName;
      if (!err[k]) return err;
      const next = { ...err };
      delete next[k];
      return next;
    });
    setFormError(null);
  };

  const validateClient = (): boolean => {
    const err: Partial<Record<FieldName, string>> = {};
    const t = (s: string) => s.trim();

    if (!t(form.fullName) || t(form.fullName).length < 2) {
      err.fullName = "Please enter your full name (at least 2 characters).";
    }
    if (!t(form.email) || !EMAIL_RE.test(t(form.email))) {
      err.email = "Please enter a valid email address.";
    }
    if (!form.phone) {
      err.phone = "Mobile number is required.";
    } else if (!isValidPhoneNumber(form.phone)) {
      err.phone = "Please enter a valid phone number (with country code).";
    }
    if (!form.profession) {
      err.profession = "Please select your profession.";
    }
    if (t(form.company).length > 200) {
      err.company = "Company name must be at most 200 characters.";
    }
    if (t(form.designation).length > 200) {
      err.designation = "Designation must be at most 200 characters.";
    }
    if (!t(form.city)) {
      err.city = "Please enter your city.";
    }
    if (!form.state) {
      err.state = "Please select your state.";
    }
    // if (!form.country) {
    //   err.country = "Please select your country.";
    // }
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
        const key = mapServerFieldToForm(d.field) ?? mapServerFieldToForm(d.field.split(".").pop() || "");
        if (key) next[key] = d.message.replace(/^"|"$/g, "");
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validateClient()) return;
    setFieldErrors({});

    try {
      await register.mutateAsync({
        name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone,
        profession: form.profession,
        company: form.company.trim() || undefined,
        designation: form.designation.trim() || undefined,
        city: form.city.trim(),
        state: form.state,
        gst: form.gst.trim() || undefined,
        // country: form.country,
      });
    } catch (err: unknown) {
      const api = err as ApiError;
      if (api.details?.length) {
        applyServerDetails(api.details);
      }
      const msg =
        api?.message ||
        (err as Error)?.message ||
        "Registration failed. Try a different email.";
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
            email: "This email is already registered. Try signing in.",
          }));
        }
        setFormError(null);
        return;
      }
      if (!api.details?.length) {
        setFormError(msg);
      }
    }
  }

  const professions = [
    "Accountant",
    "B.Com",
    "CA: Business",
    "CA: Job",
    "CA: Practice",
    "CMA",
    "CS",
    "CFA",
    "Finance Professional",
    "LLB",
    "M.Com",
    "MBA",
    "Student: B.Com",
    "Student: CA- CPT / Foundation",
    "Student: CA- Final / Final New",
    "Student: CA- IPC / IPCC / Inter",
    "Student: CFA",
    "Student: CMA",
    "Student: CS",
    "Student: MBA",
    "Student: Others",
    "Taxpayer",
    "Others"
  ];

  const states = IndianStatesList.STATES_OBJECT.map(s => s.value);
  const countries = countryList.getNames();

  const fe = fieldErrors;
  return (
    <div className="h-screen flex flex-col md:flex-row mx-auto  ">
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

      <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center mx-auto">
      <button
        type="button"
        onClick={() => router.push('/')}
        className="absolute right-[4px] md:right-[40px] xl:right-[80px] top-4  text-gray-500 hover:text-gray-800 text-xl font-bold z-20 md:border border-[#09339B] rounded-[10px] w-10 h-10 "
      >
        <span className="md:text-[#09339B]">✕</span>
      </button>
      <div className="md:h-screen overflow-y-auto xl:p-8 scrollbar-thin-custom md:mt-4 ">
      <img src="/images/studycafe_logo.svg" alt="" width="200px" height="200px"/>
        <h2 className="text-[20px] xl:text-[40px] font-semibold  pt-[8px]">Create your account</h2>
        <p className="text-[16px] xl:text-[24px] text-[#3a3c3e] mb-6 pt-[5px] md:pt-[10px]">Sign up to start your learning journey</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-[16px] md:text-[16px] px-4" noValidate>
          <div>
            <label htmlFor="fullName" className="block mb-1">Full Name <span className="text-red-600">*</span></label>  
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={form.fullName}
              onChange={handleChange}
              className={labelCls(!!fe.fullName)}
              placeholder="Name"
            />
            {fe.fullName && <p className="text-red-600 text-sm mt-1" role="alert">{fe.fullName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1">Email <span className="text-red-600">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className={labelCls(!!fe.email)}
              placeholder="Enter Email"
            />
            {fe.email && <p className="text-red-600 text-sm mt-1" role="alert">{fe.email}</p>}
          </div>

            <div>
            <label className="block mb-1" htmlFor="phone-input">Mobile Number <span className="text-red-600">*</span></label>
            <PhoneInput
                id="phone-input"
                placeholder="Enter Mobile number"
                value={form.phone}
                onChange={handlePhoneChange}
                defaultCountry="IN"
                limitMaxLength={true} 
                className={fe.phone ? `${INPUT_CLASS} ${FIELD_ERR_CLASS}` : `${INPUT_CLASS}`}
            />
            {fe.phone && <p className="text-red-600 text-sm mt-1" role="alert">{fe.phone}</p>}
            </div>

            <div>
              <label htmlFor="profession" className="block mb-1">
                Profession <span className="text-red-600">*</span>
              </label>

            <select
              id="profession"
              name="profession"
              value={form.profession}
              onChange={handleChange}
                className={labelCls(!!fe.profession) + " bg-white py-2"}
            >
              <option value="" className="">Select</option>
              {professions.map((item, index) => (
                <option key={index} value={item.toLowerCase()} >
                  {item}
                </option>
              ))}
              </select>
              {fe.profession && <p className="text-red-600 text-sm mt-1" role="alert">{fe.profession}</p>}
              </div>


          <div>
            <label htmlFor="company" className="block mb-1">Company name</label>
            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              maxLength={200}
              className={labelCls(!!fe.company)}
               placeholder="Your company (optional)"
            />
            {fe.company && <p className="text-red-600 text-sm mt-1" role="alert">{fe.company}</p>}
          </div>

          <div>
            <label htmlFor="designation" className="block mb-1">Designation</label>
            <input
              id="designation"
              name="designation"
              type="text"
              value={form.designation}
              onChange={handleChange}
              maxLength={200}
              className={labelCls(!!fe.designation)}
               placeholder="e.g. Owner, Manager (optional)"
            />
            {fe.designation && <p className="text-red-600 text-sm mt-1" role="alert">{fe.designation}</p>}
          </div>
          <div>
            <label htmlFor="state" className="block mb-1">State <span className="text-red-600">*</span></label>
          <select id="state" name="state" value={form.state} onChange={handleChange} className={labelCls(!!fe.state) + " bg-white py-2"}>
            <option value="">Select state</option>
            {states.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
            {fe.state && <p className="text-red-600 text-sm mt-1" role="alert">{fe.state}</p>}
          </div>

          <div>
            <label htmlFor="city" className="block mb-1">City <span className="text-red-600">*</span></label>
            <input
              id="city"
              name="city"
              type="text"
              autoComplete="address-level2"
              value={form.city}
              onChange={handleChange}
              className={labelCls(!!fe.city)}
               placeholder="Enter your city"
            />
            {fe.city && <p className="text-red-600 text-sm mt-1" role="alert">{fe.city}</p>}
          </div>

          <div>
            <label htmlFor="gst" className="block mb-1">GST Number <span className="text-gray-400 text-xs font-normal">(Optional)</span></label>
            <input
              id="gst"
              name="gst"
              type="text"
              value={form.gst}
              onChange={handleChange}
              className={INPUT_CLASS}
              placeholder="15-character GSTIN, e.g. 22AAAAA0000A1Z5"
              maxLength={15}
            />
            <p className="text-gray-500 text-xs mt-1">Leave blank if not applicable.</p>
          </div>

          

          {/* <div>
            <label htmlFor="country" className="block mb-1">Country <span className="text-red-600">*</span></label>
                <select
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              className={labelCls(!!fe.country) + " bg-white py-2"}
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {fe.country && <p className="text-red-600 text-sm mt-1" role="alert">{fe.country}</p>}
          </div> */}
    <div className="mb-4">
      <label htmlFor="password" className="block mb-1 md:text-[16px] ">
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
          className={(fe.password ? `${INPUT_CLASS} pr-10 ${FIELD_ERR_CLASS}` : `${INPUT_CLASS} pr-10`) + " rounded-md focus:outline-none focus:ring-2 focus:ring-black"}
          placeholder="Enter your password"
        />
        <button
          type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
                  {showPassword ? (
             <EyeIcon className="w-5 h-5"  />
          ) : (
              <EyeSlashIcon className="w-5 h-5"  />
          )}
          <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>
      </div>
            {fe.password && <p className="text-red-600 text-sm mt-1" role="alert">{fe.password}</p>}
    </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-1 md:text-[16px]">
              Confirm password <span className="text-red-600">*</span>
            </label>
              <div className="relative w-full">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={(fe.confirmPassword ? `${INPUT_CLASS} pr-10 ${FIELD_ERR_CLASS}` : `${INPUT_CLASS} pr-10`)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
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
            {fe.confirmPassword && <p className="text-red-600 text-sm mt-1" role="alert">{fe.confirmPassword}</p>}
          </div>
  
            <div className="mt-4 pb-5 flex items-start gap-2 text-[16px] md:text-[16px] text-[#3a3c3e]">

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
                aria-invalid={!!fe.terms}
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
            {fe.terms && <p className="text-red-600 text-sm -mt-2 mb-1" role="alert">{fe.terms}</p>}


          {formError && <p className="text-red-600" role="alert">{formError}</p>}

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full bg-[#09339B] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {register.isPending ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-[16px] text-[#3a3c3e] text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#09339B]">
            Sign in
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
