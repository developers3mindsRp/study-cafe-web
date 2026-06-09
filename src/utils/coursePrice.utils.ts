/** Parse a course price field; null when unset or invalid. Zero is valid. */
export function parseCoursePrice(val?: string | number | null): number | null {
  if (val == null || val === "") return null;
  const n = typeof val === "string" ? parseFloat(val) : val;
  return Number.isFinite(n) ? n : null;
}

/** Whether a sale price is explicitly set (including ₹0). */
export function hasCourseSalePrice(course: { sale_price?: string | number | null }): boolean {
  return parseCoursePrice(course.sale_price) != null;
}

/** Chargeable price: sale price when set, otherwise regular price. */
export function getEffectiveCoursePrice(course: {
  sale_price?: string | number | null;
  price?: string | number | null;
}): number {
  const sale = parseCoursePrice(course.sale_price);
  if (sale != null) return sale;
  return parseCoursePrice(course.price) ?? 0;
}

/** Regular MRP when a sale price is in effect; otherwise null. */
export function getCourseListPrice(course: {
  sale_price?: string | number | null;
  price?: string | number | null;
}): number | null {
  if (!hasCourseSalePrice(course)) return null;
  return parseCoursePrice(course.price);
}
