"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { X } from "lucide-react";
import { useResumeAfterSignup } from "@/hooks/useResumeAfterSignup";
import type { CoursePublicDetail } from "@/types/models.types";
import { useAuth } from "@/providers/AuthProvider";
import {
  getCouponsForCourse,
  applyCoupon as applyCouponApi,
  createOrder,
  verifyOrder,
  type CouponInfo,
  type ApplyCouponResponse,
} from "@/services/order.service";
import { getReferralCode } from "@/utils/auth.utils";
import {
  getCourseListPrice,
  getEffectiveCoursePrice,
} from "@/utils/coursePrice.utils";

const GST_RATE = 0.18;

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface Props {
  course?: CoursePublicDetail | null;
}

export default function PriceCard({ course }: Props) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const price = getEffectiveCoursePrice(course ?? {});
  const originalPrice = getCourseListPrice(course ?? {}) ?? 0;

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ApplyCouponResponse | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [openCoupon, setOpenCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<CouponInfo[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { ref: cardRef, resumed: resumedAfterSignup } = useResumeAfterSignup();

  const discount = appliedCoupon?.discount ?? 0;
  const afterDiscount = price - discount;
  const gst = Number((afterDiscount * GST_RATE).toFixed(2));
  const grandTotal = Number((afterDiscount + gst).toFixed(2));

  const handleOpenCoupons = useCallback(async () => {
    setOpenCoupon(true);
    if (!course?.id) return;
    setCouponsLoading(true);
    try {
      const data = await getCouponsForCourse(course.id);
      setAvailableCoupons(data.coupons ?? []);
    } catch {
      setAvailableCoupons([]);
    } finally {
      setCouponsLoading(false);
    }
  }, [course?.id]);

  const handleApplyCoupon = useCallback(
    async (code: string) => {
      if (!code.trim() || !course?.id) return;
      setCouponError(null);
      setCouponLoading(true);
      try {
        const result = await applyCouponApi(code.trim(), course.id);
        setAppliedCoupon(result);
        setCouponInput(result.coupon.code);
        setOpenCoupon(false);
      } catch (err: any) {
        setCouponError(err?.message || "Invalid coupon code");
        setAppliedCoupon(null);
      } finally {
        setCouponLoading(false);
      }
    },
    [course?.id],
  );

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  };

  const handleCopyAndApply = (code: string) => {
    setCouponInput(code);
    handleApplyCoupon(code);
  };

  if (!course) return null;

  if (openCoupon) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-[#F9F9FB] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setOpenCoupon(false)}
              className="w-8 h-8 rounded-[10px] bg-white border flex items-center justify-center"
            >
              <img src="/images/arrow-left-b.png" alt="Back" />
            </button>
            <h3 className="font-medium text-[20px]">Offers for you</h3>
          </div>
          <div className="border-t border-[#AFAFAF] mb-6" />

          {couponsLoading ? (
            <p className="text-sm text-[#929292] py-4 text-center">Loading coupons…</p>
          ) : availableCoupons.length === 0 ? (
            <p className="text-sm text-[#929292] py-4 text-center">No coupons available right now.</p>
          ) : (
            availableCoupons.map((c, idx) => (
              <div key={c.id}>
                {idx > 0 && <div className="border-t border-black mb-4" />}
                <div className="pb-4 mb-4">
                  <p className="font-semibold text-sm mb-1">
                    {c.type?.toLowerCase() === "percentage"
                      ? `GET ${c.value}% OFF`
                      : `GET ₹${c.value} OFF`}
                    {c.max_discount > 0 && c.type?.toLowerCase() === "percentage" && (
                      <span className="text-xs font-normal text-[#929292] ml-1">
                        (up to ₹{c.max_discount})
                      </span>
                    )}
                  </p>
                  {c.description && (
                    <p className="text-xs text-[#929292] mb-2">{c.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">USE CODE :</span>
                    <div className="border border-dotted border-black rounded-lg p-2 flex gap-2 bg-[#F2F2F2]">
                      <span className="font-medium text-sm">{c.code}</span>
                      <button
                        onClick={() => handleCopyAndApply(c.code)}
                        className="bg-white flex gap-1 px-2 rounded-md text-sm text-gray-500 items-center"
                        disabled={couponLoading || !c.canApply}
                      >
                        Apply
                        <img src="/images/copy.png" alt="" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {!c.canApply && c.inactiveReason && (
                    <p className="text-xs text-red-500 mt-1">{c.inactiveReason}</p>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="border-t border-black mb-4" />
          <div className="mt-4">
            <p className="text-sm mb-2">Apply Coupon</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="border rounded-lg p-2 flex-1"
              />
              <button
                onClick={() => handleApplyCoupon(couponInput)}
                className="bg-[#09339B] text-white px-4 rounded-lg disabled:opacity-50"
                disabled={couponLoading || !couponInput.trim()}
              >
                {couponLoading ? "…" : "Apply"}
              </button>
            </div>
            {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto" ref={cardRef}>
      <div
        className={
          "bg-[#F9F9FB] rounded-xl p-6" +
          (resumedAfterSignup ? " ring-2 ring-[#09339B] ring-offset-2" : "")
        }
      >
        {resumedAfterSignup && (
          <p className="mb-4 rounded-lg bg-[#E7F0E9] px-3 py-2 text-center text-sm text-[#1B5E20]">
            Your account is ready — continue your purchase below.
          </p>
        )}

        {/* Price */}
        <div className="text-center">
          <p className="text-[30px] md:text-[40px] font-semibold text-[#1A1A1A]">
            {originalPrice > 0 && originalPrice !== price && (
              <span className="line-through text-gray-400 text-[20px] md:text-[30px] mr-2">
                {fmt(originalPrice)}
              </span>
            )}
            {fmt(price)}
          </p>
          <p className="text-[#929292] text-[16px] mt-3">
            Hurry up, few days left at this price!
          </p>
        </div>

        <div className="border-t border-[#AFAFAF] mt-6" />

        {/* Summary */}
        <div className="mt-6 space-y-2 text-sm">
          <h2 className="text-[20px] text-[#252525] font-medium mb-4">Summary</h2>
          <div className="flex justify-between">
            <span>Amount</span>
            <span>{fmt(price)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between">
              <span>{appliedCoupon.coupon.code}</span>
              <span className="text-green-600">-{fmt(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Total</span>
            <span>{fmt(afterDiscount)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>{fmt(gst)}</span>
          </div>
        </div>

        <div className="border-t border-[#AFAFAF] mt-4" />

        <div className="pt-3 flex justify-between font-semibold text-[17px]">
          <span className="text-[20px] text-[#252525] font-medium">Grand Total</span>
          <span>{fmt(grandTotal)}</span>
        </div>

        <div className="border-t border-[#AFAFAF] mt-4" />

        {/* Apply Coupon trigger */}
        <div
          onClick={handleOpenCoupons}
          className="mt-4 p-3 bg-[#EAEAEA] rounded-[10px] text-[#09339B] font-medium flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img src="/images/coupon.png" alt="" />
            <span>Apply Coupon</span>
          </div>
          <img src="/images/left-arrow.png" alt="" />
        </div>

        {/* Coupon input inline */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-700">Coupon Code</label>
          <div className="relative mt-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value.toUpperCase());
                setCouponError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyCoupon(couponInput);
              }}
              placeholder="Enter coupon code"
              className="w-full border rounded-lg py-2 px-3 pr-24 focus:outline-none focus:ring focus:ring-blue-200"
            />
            {appliedCoupon ? (
              <>
                <div className="absolute right-24 top-1/2 -translate-y-1/2 bg-[#D8E3FF] text-[#09339B] px-2 py-1 rounded-md text-xs font-medium">
                  Applied
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : couponInput.trim() ? (
              <button
                onClick={() => handleApplyCoupon(couponInput)}
                disabled={couponLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#09339B] text-white px-3 py-1 rounded-md text-xs font-medium disabled:opacity-50"
              >
                {couponLoading ? "…" : "Apply"}
              </button>
            ) : null}
          </div>
          {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
        </div>

        <div className="border-t border-[#AFAFAF] mt-4" />

        {/* Buy Now */}
        <button
          onClick={async () => {
            if (!isAuthenticated) {
              const returnPath = window.location.pathname + window.location.search;
              router.push(`/login?next=${encodeURIComponent(returnPath)}`);
              return;
            }
            if (!course?.id || paymentLoading) return;
            setPaymentLoading(true);
            try {
              const refCode = getReferralCode() || undefined;
              const orderData = await createOrder({
                type: "course",
                entityId: course.id,
                couponCode: appliedCoupon?.coupon.code || undefined,
                referralCode: refCode,
              });

              if (orderData.free && orderData.paid) {
                router.push(`/payment-success?order_id=${orderData.orderId}`);
                return;
              }

              const loaded = await loadRazorpayScript();
              if (!loaded) { alert("Failed to load payment gateway. Please try again."); return; }

              if (!orderData.key || !orderData.razorpayOrderId) {
                alert("Order could not be started. Please try again.");
                return;
              }

              const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Studycafe",
                description: course.title || "Course Purchase",
                order_id: orderData.razorpayOrderId,
                handler: async (response: any) => {
                  try {
                    await verifyOrder({
                      orderId: orderData.orderId,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                    });
                    router.push(`/payment-success?order_id=${orderData.orderId}`);
                  } catch {
                    alert("Payment verification failed. Please contact support.");
                  }
                },
                prefill: {
                  name: orderData.prefill?.name || user?.name || "",
                  email: orderData.prefill?.email || user?.email || "",
                  contact: orderData.prefill?.contact || user?.phone || "",
                },
                theme: { color: "#09339B" },
                modal: { ondismiss: () => setPaymentLoading(false) },
              };

              const rzp = new window.Razorpay(options);
              rzp.on("payment.failed", () => {
                setPaymentLoading(false);
                router.push(`/payment-success?order_id=${orderData.orderId}`);
              });
              rzp.open();
            } catch (err: any) {
              alert(err?.message || "Failed to create order. Please try again.");
            } finally {
              setPaymentLoading(false);
            }
          }}
          disabled={paymentLoading}
          className="w-full bg-[#09339B] text-white rounded-lg py-3 mt-5 font-medium text-[16px] disabled:opacity-60"
        >
          {paymentLoading ? "Processing…" : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
