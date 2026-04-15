import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';

export interface CouponInfo {
  id: number;
  code: string;
  description: string;
  type: string;
  value: number;
  min_order: number;
  max_discount: number;
  discount_on: string;
  start_date: string | null;
  expire_date: string | null;
  status: string;
  created_at: string;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  canApply: boolean;
  inactiveReason: string | null;
}

export interface CouponsForEntityResponse {
  type: string | null;
  entityId: string | number | null;
  amount: number | null;
  coupons: CouponInfo[];
}

export interface ApplyCouponResponse {
  applied: boolean;
  coupon: {
    id: number;
    code: string;
    description: string;
    type: string;
    value: number;
    min_order: number;
    max_discount: number;
    discount_on: string;
    start_date: string | null;
    expire_date: string | null;
    status: string;
  };
  amount: number;
  discount: number;
  payableAmount: number;
}

/** List available coupons for a course. Requires auth. */
export const getCouponsForCourse = async (
  courseId: number | string,
): Promise<CouponsForEntityResponse> => {
  const response = await axiosInstance.get<ApiResponse<CouponsForEntityResponse>>(
    '/orders/get-coupon',
    { params: { type: 'COURSE', id: courseId } },
  );
  return response.data.data;
};

/** Validate and apply a coupon code for a course. */
export const applyCoupon = async (
  couponCode: string,
  courseId: number | string,
): Promise<ApplyCouponResponse> => {
  const response = await axiosInstance.post<ApiResponse<ApplyCouponResponse>>(
    '/orders/apply-coupon',
    { couponCode, type: 'COURSE', id: courseId },
  );
  return response.data.data;
};

/** List available coupons for a membership plan. */
export const getCouponsForMembership = async (
  planId: number | string,
): Promise<CouponsForEntityResponse> => {
  const response = await axiosInstance.get<ApiResponse<CouponsForEntityResponse>>(
    '/orders/get-coupon',
    { params: { type: 'MEMBERSHIP', id: planId } },
  );
  return response.data.data;
};

/** Validate and apply a coupon code for a membership plan. */
export const applyCouponForMembership = async (
  couponCode: string,
  planId: number | string,
): Promise<ApplyCouponResponse> => {
  const response = await axiosInstance.post<ApiResponse<ApplyCouponResponse>>(
    '/orders/apply-coupon',
    { couponCode, type: 'MEMBERSHIP', id: planId },
  );
  return response.data.data;
};
