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


export default function SignUpPage() {
  const router = useRouter();
  const register = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    number: "",
    profession: "",
    company: "",
    designation: "",
    city: "",
    state: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | undefined>(undefined);
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


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);
    if (form.password.length < 6) {
      setErrors("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }
    try {
      await register.mutateAsync({
        name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
    } catch (err: unknown) {
      const msg =
        (err as ApiError)?.message ||
        (err as Error)?.message ||
        "Registration failed. Try a different email.";
      setErrors(msg);
    }
  }

       function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) {
        const { name, value } = e.target;

        setForm(prev => ({
          ...prev,
          [name]: value,
        }));
      }

  const states = IndianStatesList.STATES_OBJECT.map(s => s.value);
const countries = countryList.getNames();




  return (
    <div className="h-screen flex flex-col md:flex-row mx-auto  ">
      {/* Left branding panel */}
      <div className="hidden md:w-1/2 bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat  text-white p-8 md:flex flex-col justify-center ">
            <div className="relative border xl:w-[548px] h-auto xl:h-[280px] rounded-[35px] text-center mx-auto overflow-hidden">
            
            <div className="absolute inset-0 bg-white/30 blur-xxl"></div>

            <div className="relative z-10">
                <img src="/images/study-logo.svg" alt="" width="221px" height="250px" className="mx-auto mt-[11px]"/>
                <h1 className="text-[30px] xl:text-4xl font-bold mb-4 pt-[12px] xl:pb-[18px]">Join Our Learning <br />Community</h1>
                <p className="text-[18px] xl:text-[24px] pb-2 px-4 ">Create your account and get access to premium <br className="hidden" /> courses and exclusive content</p>
            </div>

            </div>

      </div>

      {/* Right form panel */}
      <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center mx-auto">
       {/* Close (X) */}
      <button
        onClick={() => router.push('/')}
        className="absolute right-[4px] md:right-[40px] xl:right-[80px] top-4  text-gray-500 hover:text-gray-800 text-xl font-bold z-20 md:border border-[#09339B] rounded-[10px] w-10 h-10 "
      >
        <span className="md:text-[#09339B]">✕</span>
      </button>
      <div className="md:h-screen overflow-y-auto xl:p-8 scrollbar-thin-custom md:mt-4 ">
      <img src="/images/studycafe_logo.svg" alt="" width="200px" height="200px"/>
        <h2 className="text-[20px] xl:text-[40px] font-semibold  pt-[8px]">Create your account</h2>
        <p className="text-[16px] xl:text-[24px] text-[#AFAFAF] mb-6 pt-[5px] md:pt-[10px]">Sign up to start your learning journey</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-[16px] md:text-[16px] px-4">
          <div>
            <label htmlFor="fullName" className="block mb-1">Full Name <span className="text-red-600">*</span></label>  
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-1"
              placeholder="Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1">Email <span className="text-red-600">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-1"
              placeholder="Enter Email"
            />
          </div>

            <div>
            <label className="block mb-1">Mobile Number <span className="text-red-600">*</span></label>
            <PhoneInput
                placeholder="Enter Mobile number"
                value={phone}
                onChange={setPhone}
                defaultCountry="IN"
                
                limitMaxLength={true} 
                className="w-full border focus-within:ring-2 focus-within:ring-black px-3 py-1"
            />
          
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
              required
                className="w-full border px-3 py-2 bg-white"
               
            >
              <option value="" className="">Select</option>
              {professions.map((item, index) => (
                <option key={index} value={item.toLowerCase()} >
                  {item}
                </option>
              ))}
              </select>
              </div>


          <div>
            <label htmlFor="company" className="block mb-1">Company Name </label>
            <input
              id="company"
              name="company"
              type="company"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full border px-3 py-1"
               placeholder="Your Company Name"
            />
          </div>

          <div>
            <label htmlFor="designation" className="block mb-1">Designation </label>
            <input
              id="designation"
              name="designation"
              type="designation"
              value={form.designation}
              onChange={handleChange}
              required
              className="w-full border px-3 py-1"
               placeholder="Eg. Owner, Manager, Tax Head Etc."
            />
          </div>

          <div>
            <label htmlFor="city" className="block mb-1">City <span className="text-red-600">*</span></label>
            <input
              id="city"
              name="city"
              type="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border px-3 py-1"
               placeholder="Enter Your City"
            />
          </div>

          <div>
            <label htmlFor="state" className="block mb-1">State <span className="text-red-600">*</span></label>
          <select name="state" value={form.state} onChange={handleChange}    className="w-full border px-3 py-1">
            <option value="">Select state</option>
            {states.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
          </div>

          <div>
            <label htmlFor="country" className="block mb-1">Country <span className="text-red-600">*</span></label>
                <select
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full border px-3 py-1"
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
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
          required
          className="w-full border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                  required
                  className="w-full border px-3 py-1"
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
          </div>
  
            <div className="mt-4 pb-5 flex items-start gap-2 text-[16px] md:text-[16px] text-[#AFAFAF]">

              <input
                type="checkbox"
                className="mt-1 shrink-0"
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
              </p>

            </div>


          {errors && <p className="text-red-600">{errors}</p>}

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full bg-[#09339B] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {register.isPending ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-[16px] text-[#AFAFAF] text-center">
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
