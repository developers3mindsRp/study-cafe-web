import React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import IndianStatesList from "indian-states-cities-list";
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
import { useUpdateProfile, useUploadAvatar } from "@/hooks/usePurchases";

const PROFESSIONS = [
  "Chartered Accountant",
  "Company Secretary",
  "Cost Accountant",
  "Tax Consultant",
  "Advocate",
  "Student",
  "Business Owner",
  "Finance Professional",
  "Government Employee",
  "Other",
];

/** Official Indian GSTIN pattern: 15 chars, starts with 2-digit state code */
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

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
  initialTab?: AccountTabKey;
  useDashboardRoutes?: boolean;
}

export default function EditProfile({
  initialTab = "Profile",
  useDashboardRoutes = false,
}: EditProfileProps) {
  const router = useRouter();
  const { user, refetchUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [avatarModal, setAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    bio: "",
    phone: "" as string | undefined,
    profession: "",
    company: "",
    designation: "",
    city: "",
    state: "",
    country: "",
    gst: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      // Normalize phone: store internally as "+91XXXXXXXXXX" regardless of what comes from API
      const rawPhone: string = (user as any).phone ?? "";
      const normalizedPhone = rawPhone.startsWith("+") ? rawPhone : rawPhone ? `+91${rawPhone}` : "";
      setForm({
        fullName: user.name ?? "",
        email: user.email ?? "",
        bio: user.bio ?? "",
        phone: normalizedPhone,
        profession: (user as any).profession ?? "",
        company: (user as any).company ?? "",
        designation: (user as any).designation ?? "",
        city: (user as any).city ?? "",
        state: (user as any).state ?? "",
        country: (user as any).country ?? "",
        gst: (user as any).gst ?? "",
      });
    }
  }, [user?.id]);

  const [active, setActive] = useState<AccountTabKey>(initialTab);
  useEffect(() => { setActive(initialTab); }, [initialTab]);

  const currentTab: AccountTabKey = useDashboardRoutes
    ? PATH_TO_TAB[router.pathname] ?? initialTab
    : active;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    // Auto-uppercase GST number as the user types
    const finalValue = name === "gst" ? value.toUpperCase() : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "Invalid email";
    // GST: if filled in, must be a valid 15-character GSTIN
    const gstVal = form.gst.trim().toUpperCase();
    if (gstVal !== "" && !GSTIN_REGEX.test(gstVal)) {
      errs.gst = "Enter a valid 15-character GSTIN (e.g. 22AAAAA0000A1Z5)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    setSaveMsg(null);
    updateProfile.mutate(
      {
        name: form.fullName.trim(),
        email: form.email.trim(),
        bio: form.bio.trim() || null,
        phone: form.phone?.trim() || undefined,
        profession: form.profession.trim() || undefined,
        company: form.company.trim() || undefined,
        designation: form.designation.trim() || undefined,
        city: form.city.trim() || undefined,
        state: form.state || undefined,
        country: form.country || undefined,
        gst: form.gst.trim() || undefined,
      },
      {
        onSuccess: () => {
          setSaveMsg({ type: "success", text: "Profile updated successfully!" });
          refetchUser();
          setTimeout(() => setSaveMsg(null), 4000);
        },
        onError: (err: any) => {
          setSaveMsg({
            type: "error",
            text: err?.response?.data?.message || err?.message || "Failed to update profile",
          });
        },
      }
    );
  }

  function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB"); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarModal(true);
  }

  function handleAvatarUpload() {
    if (!avatarFile) return;
    uploadAvatar.mutate(avatarFile, {
      onSuccess: () => {
        setAvatarModal(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        refetchUser();
      },
      onError: (err: any) => {
        alert(err?.response?.data?.message || "Failed to upload image");
      },
    });
  }

  function cancelAvatar() {
    setAvatarModal(false);
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const states = IndianStatesList.STATES_OBJECT.map((s: any) => s.value);
  const countries = countryList.getNames();

  return (
    <div className={`w-full ${useDashboardRoutes ? "xl:py-4" : "xl:py-10"}`}>
      <div className="md:container mx-auto md:grid md:grid-cols-3 gap-8 mb-10">
        {/* LEFT SIDEBAR */}
        <div className="md:col-span-1">
          <Sidebar onAvatarClick={() => fileInputRef.current?.click()} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarSelect}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-2 bg-white rounded-xl md:p-6 mt-4 md:mt-0">
          <div className="border bg-[#F0F2F4] rounded-lg flex overflow-x-auto overflow-hidden text-sm font-medium md:p-2 scrollbar justify-around gap-2">
            {TABS.map((tab) => {
              const isOn = currentTab === tab.key;
              const tabClass = `md:flex-1  px-0 xl:py-3 last:border-none transition-all text-[10px] md:text-[16px] ${
                isOn
                  ? "md:bg-white text-[#454545] rounded-[15px] m-2 p-0 md:px-4 md:py-2"
                  : "text-[#AFAFAF] hover:bg-gray-200 rounded-[15px] m-2 p-0  md:px-4"
              }`;
              const inner = (
                <div className="block md:flex gap-2 justify-center items-center">
                  <Image src={isOn ? tab.activeIcon : tab.icon} alt={tab.label} width={25} height={25} className="md:hidden block " />
                  <Image src={isOn ? tab.activeIcon : tab.icon} alt={tab.label} width={18} height={18} className="md:block hidden object-contain" />
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
                <button key={tab.key} type="button" onClick={() => setActive(tab.key)} className={tabClass}>
                  {inner}
                </button>
              );
            })}
          </div>

          {currentTab === "Profile" && (
            <>
              <div className="mt-8 p-4 border border-[#9FBBFF] rounded-lg bg-white shadow-sm">
                <p className="text-[20px] md:text-[26px]">Edit Profile</p>
                <p className="text-[#525252] mb-4 text-[16px]">Update your personal information</p>

                <div className="grid md:grid-cols-1 gap-4 mt-2">
                  {/* Full Name */}
                  <div>
                    <label className="text-sm font-medium">Full Name<span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className={`w-full border px-3 py-2 rounded-md mt-1 ${errors.fullName ? "border-red-500" : "border-[#1A1A1A]"}`}
                      placeholder="Name"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1 text-sm resize-y min-h-[96px]"
                      placeholder="A short introduction about yourself"
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Email<span className="text-red-600">*</span></label>
                      <input
                        type="email"
                        name="email"
                        disabled
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 rounded-md mt-1 ${errors.email ? "border-red-500" : "border-[#1A1A1A]"}`}
                        placeholder="Enter Email"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="text-sm block mb-1 font-medium">Mobile Number</label>
                      <div className="flex items-center border border-[#1A1A1A] rounded-md mt-1 overflow-hidden">
                        <span className="px-3 py-2 bg-gray-50 border-r border-[#1A1A1A] text-sm text-gray-600 whitespace-nowrap select-none">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone?.replace(/^\+91/, "").replace(/^\+/, "") ?? ""}
                          disabled
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setForm((prev) => ({ ...prev, phone: digits ? `+91${digits}` : "" }));
                          }}
                          className="flex-1 px-3 py-2 text-sm outline-none bg-white"
                          placeholder="Enter 10-digit number"
                          maxLength={10}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profession + Company */}
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Profession</label>
                      <select
                        name="profession"
                        value={form.profession}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1"
                      >
                        <option value="">Select</option>
                        {PROFESSIONS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1 placeholder:text-[12px] md:placeholder:text-[16px]"
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="text-sm font-medium">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1"
                      placeholder="Eg. Owner, Manager, Tax Head Etc."
                    />
                  </div>

                  {/* City + State */}
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">City</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1"
                        placeholder="Enter Your City"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">State</label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 mt-1 rounded-md"
                      >
                        <option value="">Select state</option>
                        {states.map((st: string) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="text-sm font-medium">Country</label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md"
                    >
                      <option value="">Select country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* GST Number */}
                  <div>
                    <label className="text-sm font-medium">GST Number <span className="text-gray-400 text-xs font-normal">(Optional)</span></label>
                    <input
                      type="text"
                      name="gst"
                      value={form.gst}
                      onChange={handleChange}
                      className={`w-full border px-3 py-2 tracking-[0px] rounded-md mt-1 uppercase tracking-widest ${errors.gst ? "border-red-500" : "border-[#1A1A1A]"}`}
                      placeholder="15-character GSTIN, e.g. 22AAAAA0000A1Z5"
                      maxLength={15}
                      spellCheck={false}
                      autoCapitalize="characters"
                    />
                    {errors.gst
                      ? <p className="text-red-500 text-xs mt-1">{errors.gst}</p>
                      : <p className="text-xs text-gray-500 mt-1">Leave blank if not applicable.</p>
                    }
                  </div>
                </div>

                {/* Save + Messages */}
                <div className="flex justify-between items-center mt-6">
                  {saveMsg && (
                    <p className={`text-sm ${saveMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                      {saveMsg.text}
                    </p>
                  )}
                  <div className="w-full">
                    <button
                      type="button"
                      disabled={updateProfile.isPending}
                      onClick={handleSave}
                      className="bg-[#09339B] px-5 py-2 text-white rounded-md disabled:opacity-60 w-full"
                    >
                      {updateProfile.isPending ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="space-y-6 mt-8 p-4 border border-[#9FBBFF] rounded-lg bg-white shadow-sm">
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 border px-4 py-2 rounded-md text-gray-700 bg-[#F9F9FB] hover:bg-[#ececf2] transition"
                >
                  <img src="/images/lock.png" alt="Change Password icon" className="w-5 h-5" />
                  <span className="font-medium">Change Password</span>
                </button>
              </div>

              {open && <ChangePasswordModal onClose={() => setOpen(false)} />}
            </>
          )}

          {currentTab === "Payment" && (
            <div className="mt-8"><PaymentHistory /></div>
          )}
          {currentTab === "Course" && (
            <div className="mt-8"><MyCourses /></div>
          )}
          {currentTab === "Membership" && (
            <div className="mt-8"><MembershipCourses /></div>
          )}
          {currentTab === "Earning" && (
            <div className="mt-8"><Earning /></div>
          )}
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {avatarModal && avatarPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cancelAvatar} />
          <div className="relative bg-white rounded-xl shadow-lg p-6 z-10 max-w-xs w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Update Profile Photo</h3>
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#09339B] mb-4">
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleAvatarUpload}
                disabled={uploadAvatar.isPending}
                className="px-5 py-2 bg-[#09339B] text-white rounded-md disabled:opacity-60"
              >
                {uploadAvatar.isPending ? "Uploading…" : "Upload"}
              </button>
              <button onClick={cancelAvatar} className="px-5 py-2 border rounded-md">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
