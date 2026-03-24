import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';
 import IndianStatesList  from "indian-states-cities-list";
 import countryList from "country-list";
import PaymentHistory from "./PaymentHistory";
import MyCourses from "./PurchaseCourse";
import Sidebar from "./Sidebar";
import ChangePasswordModal from "@/components/ChangePassword";
import MembershipCourses from "./MembershipCourses";
import Earning from "./Earning";
import {
  type AccountTabKey,
  TAB_TO_PATH,
  PATH_TO_TAB,
} from "./accountRoutes";
import { useAuth } from "@/providers/AuthProvider";

const TABS: {
  key: AccountTabKey;
  label: string;
  icon: string;
  activeIcon: string;
}[] = [
  { key: "Profile", label: "Profile Settings", icon: "/images/user.svg", activeIcon: "/images/user-active.png" },
  { key: "Payment", label: "Payment History", icon: "/images/credit-card.png", activeIcon: "/images/credit-card-active.svg" },
  { key: "Course", label: "Purchased Course", icon: "/images/course.png", activeIcon: "/images/course-active.svg" },
  { key: "Membership", label: "Membership course", icon: "/images/crown.svg", activeIcon: "/images/crown-active.svg" },
  { key: "Earning", label: "My Earning", icon: "/images/earning.svg", activeIcon: "/images/earning-active.svg" },
];

export interface EditProfileProps {
  /** Default tab when using public /account-style navigation */
  initialTab?: AccountTabKey;
  /** When true, tab bar navigates to /dashboard/* routes (deep-linkable sections) */
  useDashboardRoutes?: boolean;
}

export default function EditProfile({
  initialTab = "Profile",
  useDashboardRoutes = false,
}: EditProfileProps) {
  const router = useRouter();
  const { user } = useAuth();
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
  });

  // Pre-fill form once user data is available
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name ?? "",
        email: user.email ?? "",
      }));
    }
  }, [user?.id]);

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


  const [active, setActive] = useState<AccountTabKey>(initialTab);

  useEffect(() => {
    setActive(initialTab);
  }, [initialTab]);

  const currentTab: AccountTabKey = useDashboardRoutes
    ? PATH_TO_TAB[router.pathname] ?? initialTab
    : active;

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
<div className={`w-full ${useDashboardRoutes ? "xl:py-4" : "xl:py-10"}`}>
  <div className="container  mx-auto grid md:grid-cols-3 gap-8 mb-10">
        
       {/* LEFT SIDEBAR */}
      <div className="md:col-span-1 ">
        <Sidebar/>
      </div>


        {/* RIGHT CONTENT */}
        <div className="md:col-span-2 bg-white  rounded-xl md:p-6">
             <div className=" border bg-[#F0F2F4] rounded-lg flex overflow-x-auto overflow-hidden text-sm font-medium md:p-2 scrollbar-hide justify-around gap-2">

        {TABS.map((tab) => {
          const isOn = currentTab === tab.key;
          const tabClass = `md:flex-1 px-0 xl:py-3 last:border-none transition-all text-[10px] md:text-[16px] ${
            isOn
              ? "bg-white text-[#454545] rounded-[15px] m-2  px-4 py-2 "
              : " text-[#AFAFAF] hover:bg-gray-200 rounded-[15px] m-2 px-4 "
          }`;
          const inner = (
            <div className="flex gap-2 justify-center items-center">
              <Image
                src={isOn ? tab.activeIcon : tab.icon}
                alt={tab.label}
                width={18}
                height={18}
                className="object-contain"
              />
              <span className="hidden xl:inline whitespace-nowrap">{tab.label}</span>
            </div>
          );
          if (useDashboardRoutes) {
            return (
              <Link key={tab.key} href={TAB_TO_PATH[tab.key]} className={tabClass} scroll={false}>
                {inner}
              </Link>
            );
          }
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={tabClass}
            >
              {inner}
            </button>
          );
        })}
             </div>

         {currentTab === "Profile" && (
          <>
                  <div className=" mt-8 p-4 border border-[#9FBBFF] rounded-lg bg-white shadow-sm ">
          <p className=" text-[20px] md:text-[26px]">Edit Profile</p>
          <p className="text-[#AFAFAF] mb-4 text-[16px]">Update your personal information</p>

          <div className="grid md:grid-cols-1 gap-4 mt-2">
            <div>
              <label className="text-sm font-medium">Full Name<span className="text-red-600">*</span></label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1"
                placeholder="Name"
              />
            </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Email<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1"
                        placeholder="Enter Email"
                      />
                    </div>

                    <div>
                      <label className="text-sm block mb-1 font-medium">Mobile Number <span className="text-red-600">*</span></label>
                      <PhoneInput
                        placeholder="Enter Mobile number"
                        value={phone}
                        onChange={setPhone}
                        defaultCountry="IN"

                        limitMaxLength={true}
                        className="w-full border border-black  px-3 py-2 rounded-md"
                      />

                    </div>

                  </div>


            <div className="flex justify-between gap-4">
            <div className="flex-1">
                      <label className="text-sm font-medium">Profession <span className="text-red-600">*</span></label>
                       <select className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1">
                <option>Select</option>
              </select>
            </div>

            <div className="flex-1">
                <label className="text-sm font-medium">Company Name</label>
                      <input type="email" className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1 placeholder:text-[12px] md:placeholder:text-[16px]" placeholder="Your Company Name" />
            </div>
            </div>



            <div>
              <label className="text-sm font-medium">Designation</label>
              <input type="text" className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1" placeholder="Eg. Owner, Manager, Tax Head Etc." />
            </div>

            <div className="flex justify-between gap-4">
                 <div className="flex-1">
                <label className="text-sm font-medium">City<span className="text-red-600">*</span></label>
                <input type="text" className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1" placeholder="Enter Your City" />
                </div>

                 <div className="flex-1">
                <label className="text-sm font-medium ">State<span className="text-red-600">*</span></label>
                    <select name="state" value={form.state} onChange={handleChange}    className="w-full border border-[#1A1A1A] px-3 py-2 mt-1 rounded-md">
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
              className="w-full border border-[#1A1A1A] px-3 py-2"
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

         <div className="flex justify-end items-center mt-6 ">



      {/* MODAL */}
        {open && <ChangePasswordModal onClose={() => setOpen(false)} />}

            <button className="bg-[#09339B] px-5 py-2 text-white rounded-md">Save Changes</button>
          </div>
          </div>
          
               <div className="space-y-6 mt-8 p-4 border border-[#9FBBFF] rounded-lg bg-white shadow-sm">
            <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 border  px-4 py-2 rounded-md text-gray-700 bg-[#F9F9FB] hover:bg-[#ececf2] transition"
          >
            <img src="/images/lock.png" alt="Change Password icon" className="w-5 h-5" />
            <span className="font-medium">Change Password</span>
          </button>
             </div>
          </>
          )}


          {currentTab === "Payment" && (
            <div className="mt-8">
             <PaymentHistory/>
            </div>
          )}
          {currentTab === "Course" && (
            <div className="mt-8">
             <MyCourses/>
            </div>
          )}
          {currentTab === "Membership" && (
            <div className="mt-8">
              <MembershipCourses/>
            
            </div>
          )}
          {currentTab === "Earning" && (
            <div className="mt-8">
              <Earning/>
            
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
