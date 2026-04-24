import type { UserCourse } from "@/types/models.types";

/**
 * Paid **course** orders from GET /orders/my-purchases.
 * Order-service also returns membership plan purchases with a synthetic `course` row
 * (`category: "membership"`, title "Membership") — those must not appear in "My Courses".
 */
export function isUserCourseOrderPurchase(p: UserCourse): boolean {
  const cat = p.course?.category;
  if (cat === "membership") return false;
  if (p.course?.title === "Membership") return false;
  return true;
}
