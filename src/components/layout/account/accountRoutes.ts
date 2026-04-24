/** Tab keys used by EditProfile — map to /dashboard/* routes */
export type AccountTabKey = "Profile" | "Payment" | "Course" | "Membership" | "Earning";

export const TAB_TO_PATH: Record<AccountTabKey, string> = {
  Profile: "/dashboard",
  Payment: "/dashboard/payments",
  Course: "/dashboard/courses",
  Membership: "/dashboard/membership",
  Earning: "/dashboard/earnings",
};

export const PATH_TO_TAB: Partial<Record<string, AccountTabKey>> = {
  "/dashboard/profile": "Profile",
  "/dashboard/payments": "Payment",
  "/dashboard/courses": "Course",
  "/dashboard/membership": "Membership",
  "/dashboard/earnings": "Earning",
};
