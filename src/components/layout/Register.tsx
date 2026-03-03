"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
 import IndianStatesList  from "indian-states-cities-list";
 import countryList from "country-list";


export default function SignUpPage() {
    
  const router = useRouter();

  const [showPwd, setShowPwd] = useState(false);
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
    // add more if you need
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState<string | undefined>(undefined)

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
            <div className="relative border md:w-[548px] h-auto md:h-[280px] rounded-[35px] text-center mx-auto overflow-hidden">
            
            <div className="absolute inset-0 bg-white/30 blur-xxl"></div>

            <div className="relative z-10">
                <img src="/images/study-logo.svg" alt="" width="221px" height="250px" className="mx-auto mt-[11px]"/>
                <h1 className="text-[30px] md:text-4xl font-bold mb-4 pt-[12px] md:pb-[18px]">Join Our Learning <br />Community</h1>
                <p className="text-[18px] md:text-[24px] pb-2 ">Create your account and get access to premium <br className="hidden" /> courses and exclusive content</p>
            </div>

            </div>

      </div>

      {/* Right form panel */}
      <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center mx-auto">
       {/* Close (X) */}
      <button
        onClick={() => router.push('/')}
        className="absolute right-[4px] md:right-[80px] top-4  text-gray-500 hover:text-gray-800 text-xl font-bold z-20 md:border border-[#09339B] rounded-[10px] w-10 h-10 "
      >
        <span className="md:text-[#09339B]">✕</span>
      </button>
      <div className="md:h-screen overflow-y-auto md:p-8 scrollbar-thin-custom md:mt-4 ">
      <img src="/images/studycafe_logo.svg" alt="" width="200px" height="200px"/>
        <h2 className="text-[20px] md:text-[40px] font-semibold  pt-[8px]">Create your account</h2>
        <p className="text-[16px] md:text-[24px] text-[#AFAFAF] mb-6 pt-[5px] md:pt-[10px]">Sign up to start your learning journey</p>
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
                placeholder="Enter phone number"
                value={phone}
                onChange={setPhone}
                defaultCountry="IN"
                
                limitMaxLength={true} 
                className="w-full border focus-within:ring-2 focus-within:ring-black px-3 py-1"
            />
          
            </div>

          <div>
            <label htmlFor="profession" className="block mb-1">Profession <span className="text-red-600">*</span></label>
            <input
              id="profession"
              name="profession"
              type="profession"
              value={form.profession}
              onChange={handleChange}
              required
              className="w-full border px-3 py-1"
              placeholder="Select"
            />
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
      <label htmlFor="password" className="block mb-1 md:text-[18px] ">
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
          className="w-full border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
            disabled={submitting}
            className="w-full bg-[#09339B] text-white py-2 rounded hover:bg-blue-700 "
          >
            {submitting ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-[16px] text-[#AFAFAF] text-center">
          Already have an account? <a href="/login" className="text-[#09339B]">Sign in</a>
        </p>
      </div>
      </div>
    </div>
  );
}
