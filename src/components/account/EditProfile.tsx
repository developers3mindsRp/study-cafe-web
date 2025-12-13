import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
 import IndianStatesList  from "indian-states-cities-list";
 import { getNames } from "country-list";
import PaymentHistory from "./PaymentHistory";
import MyCourses from "./PurchaseCourse";

export default function EditProfile() {
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
    const total = endDate - startDate;
    const passed = today - startDate;

    const percentage = Math.min((passed / total) * 10, 100);
    setProgress(percentage);
  }, []);
     const [active, setActive] = useState("description");
       function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  const states = IndianStatesList.STATES_OBJECT.map(s => s.value);
  const countries = getNames(); 

  return (
    <div className="w-full  py-10 px-4 md:px-10">
      <div className="container px-4 mx-auto grid md:grid-cols-3 gap-8">
        
        {/* LEFT SIDEBAR */}
        <div className="  p-6 h-fit">
        <div>    
             <h3 className="text-[40px] font-semibold">My Account</h3>
             <p className="text-[24px] text-[#454545]">Manage your profile, subscription, and learning progress</p>
             </div>
           
       <div className="flex flex-col items-center text-center mt-6 p-5 border rounded-lg bg-white shadow-sm max-w-sm mx-auto">
  
  {/* Profile Image */}
  <div className="w-28 h-28 rounded-full overflow-hidden mb-4">
    <Image
      src="/images/profile.png"
      alt="Profile"
      width={120}
      height={120}
      className="object-cover w-full h-full"
    />
  </div>

  {/* Name & Member Since */}
  <h2 className="text-[26px] font-semibold">Shubham</h2>
  <p className="text-gray-500 text-[16px] mt-1">
    Member since January 2025
  </p>

  {/* Left-Aligned Contact Info */}
  <div className="w-full mt-4 text-left px-4">
    <div className="flex gap-2"><img src="/images/mail.png" alt="" className="m-1" /><p className="text-gray-500 break-all">Shubham87548@gmail.com</p></div>
  <div className="flex gap-2">  <img src="/images/phone.png" alt="" className="m-1" /><p className="text-gray-500 mt-1">+91 9584784584</p></div>
  </div>

  {/* Buttons */}
  <button className="mt-4 bg-[#09339B] text-white px-4 py-2 rounded-md w-full">
    Save Profile
  </button>
  <button className="mt-3 border border-[#09339B] text-[#09339B] px-4 py-2 rounded-md w-full">
    Logout
  </button>

</div>


          {/* Subscription Box */}
          <div className="mt-6 p-5  border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Subscription Status</h3>
            <p className="text-2xl  text-[#09339B]">₹7,999</p>
            <p className="text-sm text-gray-600">Premium Membership</p>

            <div className="mt-3 text-sm text-gray-500">
            <p className="text-left">
                Days Remaining:{" "}
                <span className="font-semibold  ml-56 ">26 Days</span>
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-4 rounded-full mt-3 overflow-hidden">
                <div
                className="h-full  bg-[#09339B]"
                style={{ width: `${progress}%` }}
                ></div>
            </div>

            <p className="mt-1">01 Jan 2024 <span className="font-semibold  ml-56">31 Dec 2024</span></p>
            </div>

            <button className="mt-4 w-full border bg-[#F9F9FB] text-[#454545] py-2 rounded-md">Renew Now</button>
            <button className="mt-2 w-full border bg-[#F9F9FB] text-[#454545] py-2 rounded-md">Change Plan</button>
            <button className="mt-2 w-full border bg-[#F9F9FB] text-[#454545] py-2 rounded-md">Download Invoice</button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-2 bg-white shadow-md rounded-xl p-6 mt-44">
              <div className="border bg-[#F0F2F4] rounded-lg flex overflow-hidden text-sm font-medium container ">
        {[
          { key: "Profile", label: "Profile Settings",icon: "/images/user.png" },
          { key: "Payment", label: "Payment History" ,icon: "/images/credit-card.png"},
          { key: "Course", label: "Purchased Course", icon: "/images/course.png" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex-1 px-0 py-3 last:border-none transition-all text-[16px]    ${
              active === tab.key
                ? "bg-white text-[#454545] rounded-[15px] m-2  "
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
        <div className="space-y-6 mt-8">
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
            <button className="border px-4 py-2 rounded-md text-gray-700 bg-[#F9F9FB]">Change Password</button>
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
