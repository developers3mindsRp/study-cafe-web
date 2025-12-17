import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
 import IndianStatesList  from "indian-states-cities-list";
 import countryList from "country-list";
import PaymentHistory from "./PaymentHistory";
import MyCourses from "./PurchaseCourse";
import Sidebar from "./Sidebar";
import ChangePasswordModal from "@/components/ChangePassword";

export default function EditProfile() {
    const [open, setOpen] = useState(false);
      const [progress, setProgress] = useState(0);
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

  // Change these dates as needed
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");
  const today = new Date();
    const [phone, setPhone] = useState<string | undefined>(undefined)

      useEffect(() => {
        if (!startDate || !endDate) return;

        const start = startDate.getTime();
        const end = endDate.getTime();
        const now = today.getTime();

        const total = end - start;
        const passed = now - start;

        if (total <= 0) {
          setProgress(0);
          return;
        }

        const percentage = Math.min((passed / total) * 100, 100);
        setProgress(percentage);
      }, [startDate, endDate, today]);


     const [active, setActive] = useState("Profile");
     
     
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
<div className="w-full md:py-10 px-4 md:px-10">
  <div className="container px-4 mx-auto grid md:grid-cols-3 gap-8 mb-10">
        
       {/* LEFT SIDEBAR */}
      <div className="md:col-span-1 ">
        <Sidebar/>
      </div>


        {/* RIGHT CONTENT */}
        <div className="md:col-span-2 bg-white shadow-md rounded-xl md:p-6 md:mt-44">
              <div className="border bg-[#F0F2F4] rounded-lg flex overflow-hidden text-sm font-medium container ">
        {[
          { key: "Profile", label: "Profile Settings",icon: "/images/user.png" },
          { key: "Payment", label: "Payment History" ,icon: "/images/credit-card.png"},
          { key: "Course", label: "Purchased Course", icon: "/images/course.png" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`md:flex-1 px-0 md:py-3 last:border-none transition-all text-[10px] md:text-[16px]    ${
              active === tab.key
                ? "bg-white text-[#454545] rounded-[15px] m-2   "
                : " text-[#AFAFAF] hover:bg-gray-200 rounded-[15px] m-2 "
            }`}
          >
        <div className="flex gap-2 justify-center">
            <Image
            src={tab.icon}
            alt={tab.label}
            width={18}
            height={18}
            className="object-contain"
            />
        
            {tab.label}</div>
          </button>
        ))}
             </div>

         {active === "Profile" && (
        <div className="space-y-6 mt-8 p-4">
          <h2 className=" mb-2 text-[26px]">Edit Profile</h2>
          <p className="text-[#AFAFAF] mb-4 text-[16px]">Update your personal information</p>

          <div className="grid md:grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name<span className="text-red-600">*</span></label>
              <input type="text" className="w-full border px-3 py-2 rounded-md mt-1" placeholder="Name" />
            </div>

            <div className="flex justify-between gap-4">
                      <div className="flex-1">
                    <label className="text-sm font-medium">Email<span className="text-red-600">*</span></label>
                    <input type="email" className="w-full border px-3 py-2 rounded-md mt-1" placeholder="Enter Email" />
                    </div>
                      <div className="flex-1">
                    <label className="text-sm font-medium">Mobile Number<span className="text-red-600">*</span></label>
                         <PhoneInput
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={setPhone}
                        defaultCountry="IN"
                        international
                        limitMaxLength={true} 
                        className="w-full border px-3 py-2" 
            />
                    </div>

                
            </div>

            <div className="flex justify-between gap-4">
            <div className="flex-1">
                <label className="text-sm font-medium">Profession</label>
                       <select className="w-full border px-3 py-2 rounded-md mt-1">
                <option>Select</option>
              </select>
            </div>

            <div className="flex-1">
                <label className="text-sm font-medium">Company Name</label>
                <input type="email" className="w-full border px-3 py-2 rounded-md mt-1" placeholder="Your Company Name" />
            </div>
            </div>



            <div>
              <label className="text-sm font-medium">Designation</label>
              <input type="text" className="w-full border px-3 py-2 rounded-md mt-1" placeholder="Eg. Owner, Manager, Tax Head Etc." />
            </div>

            <div className="flex justify-between gap-4">
                 <div className="flex-1">
                <label className="text-sm font-medium">City<span className="text-red-600">*</span></label>
                <input type="text" className="w-full border px-3 py-2 rounded-md mt-1" placeholder="Enter Your City" />
                </div>

                 <div className="flex-1">
                <label className="text-sm font-medium">State<span className="text-red-600">*</span></label>
                    <select name="state" value={form.state} onChange={handleChange}    className="w-full border px-3 py-2">
                <option value="">Select state</option>
                {states.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
                </div>
            </div>

            <div>
              <label className="text-sm font-medium">Country<span className="text-red-600">*</span></label>
                        <select
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2"
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
  <button
        onClick={() => setOpen(true)}
        className="border px-4 py-2 rounded-md text-gray-700 bg-[#F9F9FB]"
      >
        Change Password
      </button>

      {/* MODAL */}
        {open && <ChangePasswordModal onClose={() => setOpen(false)} />}

            <button className="bg-[#09339B] px-5 py-2 text-white rounded-md">Save Changes</button>
          </div>
          </div>
          )}

          {active === "Payment" && (
            <div className="mt-8">
             <PaymentHistory/>
            </div>
          )}
          {active === "Course" && (
            <div className="mt-8">
             <MyCourses/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
