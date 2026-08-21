import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import type { CreateOrderResponse, VerifyOrderPayload } from '@/services/order.service';

/** What the link grants on payment. "custom" links collect money and grant nothing. */
export type PaymentLinkProductType = 'custom' | 'course' | 'membership';

export interface PaymentLinkProduct {
  type: 'course' | 'membership';
  id: string;
  name: string | null;
  slug: string | null;
  /** Courses only. */
  thumbnail_url: string | null;
  /** False when an admin fulfils this link by hand despite it naming a product. */
  auto_enroll: boolean;
}

export interface PublicPaymentLink {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  amount: string | number;
  sale_price: string | number;
  expiry?: string;
  total_seats: number;
  /** Paid payment-link orders (real checkouts); matches DB column name for backwards compatibility */
  seats_booked: number;
  random_value?: string | null;
  status?: string;
  display_sold: number;
  seats_remaining?: number;
  expires_at: string | null;
  product_type?: PaymentLinkProductType;
  product_id?: string | null;
  /** Resolved course/plan this link enrols the buyer into; null for money-only links. */
  product?: PaymentLinkProduct | null;
}

export async function getPaymentLinkBySlug(slug: string): Promise<PublicPaymentLink | null> {
  try {
    const response = await axiosInstance.get<ApiResponse<PublicPaymentLink>>(
      `/platform/payment-links/${encodeURIComponent(slug)}`,
    );
    return response.data.data;
  } catch {
    return null;
  }
}

export interface PaymentLinkUtm {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export interface PaymentLinkCheckoutPayload {
  paymentLinkId: number | string;
  fullName: string;
  email: string;
  mobile: string;
  gstNumber?: string;
  referralCode?: string;
  utm?: PaymentLinkUtm;
}

export async function createPaymentLinkOrder(
  payload: PaymentLinkCheckoutPayload,
): Promise<CreateOrderResponse> {
  const response = await axiosInstance.post<ApiResponse<CreateOrderResponse>>('/orders/payment-link/create', {
    paymentLinkId: payload.paymentLinkId,
    fullName: payload.fullName,
    email: payload.email,
    mobile: payload.mobile,
    gstNumber: payload.gstNumber || undefined,
    referralCode: payload.referralCode || undefined,
    utm: payload.utm && Object.keys(payload.utm).length > 0 ? payload.utm : undefined,
  });
  return response.data.data;
}

export async function verifyPaymentLinkOrder(
  payload: VerifyOrderPayload,
): Promise<{ verified?: boolean; alreadyPaid?: boolean; message?: string }> {
  const response = await axiosInstance.post<ApiResponse<{ verified?: boolean; alreadyPaid?: boolean }>>(
    '/orders/payment-link/verify',
    payload,
  );
  return response.data.data;
}
