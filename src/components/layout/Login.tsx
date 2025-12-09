"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
 


export default function LoginPage() {
    
  const router = useRouter();

  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
   
    email: "",
    password: "",
    // add more if you need
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setErrors(data.message || "Something went wrong");
      setSubmitting(false);
      return;
    }

    // success — redirect or show success message
    router.push("/welcome");  // or wherever
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }



  return (
    <div className="min-h-screen flex flex-col md:flex-row   mx-auto  ">
      {/* Left branding panel */}
      <div className="md:w-1/2 bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat  text-white p-8 flex flex-col justify-center">
            <div className="relative border md:w-[548px] h-auto md:h-[280px] rounded-[35px] text-center mx-auto overflow-hidden">
            
            <div className="absolute inset-0 bg-white/30 blur-xxl"></div>

            <div className="relative z-10">
                <img src="/images/study-logo.svg" alt="" width="221px" height="250px" className="mx-auto mt-[11px]"/>
                <h1 className="text-4xl font-bold mb-4 pt-[12px] pb-[18px]">Start Your Learning  <br />Journey</h1>
                <p className="text-[24px] ">Access thousands of courses, get certified, <br /> and advance your career with StudyCafe </p>
            </div>

            </div>

      </div>

      {/* Right form panel */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center ">
      <img src="/images/studycafe_logo.svg" alt="" width="200px" height="200px"/>
        <h2 className="text-[40px] font-semibold  pt-[8px]">Welcome</h2>
        <p className="text-[24px] text-[#AFAFAF] mb-6 pt-[10px]">Sign in to your account to continue learning</p>
        <form onSubmit={handleSubmit} className="space-y-4">


          <div>
            <label htmlFor="email" className="block mb-1">Email <span className="text-red-600">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2"
              placeholder="Enter Email"
            />
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
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPwd((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {showPwd ? (
             <EyeIcon className="w-5 h-5"  />
          
          ) : (
              <EyeSlashIcon className="w-5 h-5"  />
           
          )}
          <span className="sr-only">
            {showPwd ? "Hide password" : "Show password"}
          </span>
        </button>
      </div>
    </div>

        <div className="flex justify-between items-center mt-4 pb-5">
        <label className="flex items-center gap-2 text-[16px] text-[#AFAFAF]">
            <input type="checkbox" />
            Remember me
        </label>

        <a href="#" className="text-[16px] text-[#09339B]">
            Forgot Password ?
        </a>
        </div>

            {errors && <p className="text-red-600">{errors}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#09339B] text-white py-2 rounded hover:bg-blue-700 "
          >
            {submitting ? "Login" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-[16px] text-[#AFAFAF] text-center">
          Don't have an account? <a href="/sign-in" className="text-[#09339B]">Sign up</a>
        </p>
      </div>
    </div>
  );
}
