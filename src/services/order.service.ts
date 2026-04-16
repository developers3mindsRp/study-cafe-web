import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';

/* ────────────────────── Coupon types ────────────────────── */

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

/* ────────────────────── Order / Payment types ────────────────────── */

export interface CreateOrderPayload {
  type: 'course' | 'membership';
  entityId: number | string;
  // amount is intentionally omitted — backend always fetches the canonical price
  currency?: string;
  couponCode?: string;
  referralCode?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;           // final payable amount in paise
  originalAmount: number;   // original price in paise (before coupon)
  discountAmount: number;   // discount in paise
  currency: string;
  key: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export interface VerifyOrderPayload {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyOrderResponse {
  verified: boolean;
}

export interface OrderInvoice {
  orderId: string;
  type: 'course' | 'membership';
  entityId: string;
  itemName: string;
  itemCategory?: string;
  amount: string | number;
  currency: string;
  status: string;
  paidAt: string | null;
  paymentId: string | null;
}

/* ────────────────────── Affiliate types ────────────────────── */

export interface AffiliateBalance {
  id: number;
  affiliate_id: number;
  total_earned: string;
  total_withdrawn: string;
  current_balance: string;
}

export interface AffiliateHistoryItem {
  id: number;
  course_id: number | null;
  entity_type: string;
  entity_id: string;
  user_id: number;
  affiliate_id: number;
  order_id: string;
  order_amount: string;
  commission_amount: string;
  status: string;
  created_at: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  item_title: string;
}

export interface AffiliateDashboardData {
  balance: AffiliateBalance;
  totalOrders: number;
  totalOrderValue: number;
  totalCommission: number;
  history: AffiliateHistoryItem[];
}

export interface ReferralLinkCategory {
  id: number;
  title: string;
  description: string;
  url: string;
}

export interface ReferralLinkCourse {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  url: string;
}

export interface ReferralLinksData {
  referralCode: string;
  homepage: string;
  membership: string;
  categories: ReferralLinkCategory[];
  courses: ReferralLinkCourse[];
}

/* ────────────────────── Coupon APIs ────────────────────── */

export const getActiveCoupons = async (): Promise<CouponInfo[]> => {
  const response = await axiosInstance.get<ApiResponse<CouponInfo[]>>('/coupons');
  return response.data.data ?? [];
};

export const getCouponsForCourse = async (
  courseId: number | string,
): Promise<CouponsForEntityResponse> => {
  const response = await axiosInstance.get<ApiResponse<CouponsForEntityResponse>>(
    '/orders/get-coupon',
    { params: { type: 'COURSE', id: courseId } },
  );
  return response.data.data;
};

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

export const getCouponsForMembership = async (
  planId: number | string,
): Promise<CouponsForEntityResponse> => {
  const response = await axiosInstance.get<ApiResponse<CouponsForEntityResponse>>(
    '/orders/get-coupon',
    { params: { type: 'MEMBERSHIP', id: planId } },
  );
  return response.data.data;
};

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

/* ────────────────────── Order / Payment APIs ────────────────────── */

export const createOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  const response = await axiosInstance.post<ApiResponse<CreateOrderResponse>>(
    '/orders/create',
    payload,
  );
  return response.data.data;
};

export const verifyOrder = async (payload: VerifyOrderPayload): Promise<VerifyOrderResponse> => {
  const response = await axiosInstance.post<ApiResponse<VerifyOrderResponse>>(
    '/orders/verify',
    payload,
  );
  return response.data.data;
};

export const getOrderInvoice = async (orderId: string): Promise<OrderInvoice> => {
  const response = await axiosInstance.get<ApiResponse<OrderInvoice>>(
    `/orders/${orderId}/invoice`,
  );
  return response.data.data;
};

/* ────────────────────── Affiliate APIs ────────────────────── */

export const getMyAffiliateDashboard = async (): Promise<AffiliateDashboardData> => {
  const response = await axiosInstance.get<ApiResponse<AffiliateDashboardData>>(
    '/affiliate/my-dashboard',
  );
  return response.data.data;
};

export const getMyCommissionOrders = async (
  from?: string,
  to?: string,
): Promise<AffiliateHistoryItem[]> => {
  const params: Record<string, string> = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const response = await axiosInstance.get<ApiResponse<AffiliateHistoryItem[]>>(
    '/affiliate/my-orders',
    { params },
  );
  return response.data.data ?? [];
};

export const getMyReferralLinks = async (): Promise<ReferralLinksData> => {
  const response = await axiosInstance.get<ApiResponse<ReferralLinksData>>(
    '/affiliate/my-links',
  );
  return response.data.data;
};

export const createWithdrawalRequest = async (amount: number) => {
  const response = await axiosInstance.post<ApiResponse<any>>(
    '/affiliate/my-withdrawals',
    { amount },
  );
  return response.data.data;
};
