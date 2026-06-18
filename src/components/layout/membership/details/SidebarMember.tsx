"use client";

import { useState, useCallback, useEffect  } from "react";
import { useRouter } from "next/router";
import { X } from "lucide-react";
import type { Membership } from "@/types/models.types";
import { useAuth } from "@/providers/AuthProvider";
import {
  getCouponsForMembership,
  applyCouponForMembership,
  createOrder,
  verifyOrder,

  type CouponInfo,
  type ApplyCouponResponse,
} from "@/services/order.service";
import { getReferralCode } from "@/utils/auth.utils";
import {getMembershipSummaryById}  from "@/services/platform.service";


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

function parseNum(val?: string | number | null): number {
  if (val == null) return 0;
  const n = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(n) ? 0 : n;
}

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDuration(days: number, isLifetime?: boolean) {
  if (isLifetime || days >= 3650) return "Lifetime";
  if (days >= 365) {
    const years = Math.round(days / 365);
    return `${years} Year${years > 1 ? "s" : ""}`;
  }
  if (days >= 30) {
    const months = Math.round(days / 30);
    return `${months} Month${months > 1 ? "s" : ""}`;
  }
  return `${days} Day${days !== 1 ? "s" : ""}`;
}

interface Props {
  plan?: any | null;
}

export default function MemberPrice({ plan }: Props) {

  console.log(plan,"plan details")
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [summaryData, setSummaryData] = useState(plan);
  useEffect(() => {
  setSummaryData(plan);
}, [plan]);

  const pricing = summaryData?.pricing;
  const currentPlan = summaryData?.currentPlan;
  const targetPlan = summaryData?.targetPlan;

  const price = parseNum(pricing?.targetAmount);
  const deductAmount = parseNum(pricing?.deductAmount);
  const finalAmount = parseNum(pricing?.finalAmount);
  const gst = parseNum(pricing?.gstAmount);
  const grandTotal = parseNum(pricing?.grandTotal);

  // const price = parseNum(plan?.targetAmount);
  const durationStr = plan
    ? formatDuration(plan.duration_days, plan.is_lifetime)
    : "";

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] =
    useState<ApplyCouponResponse | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [openCoupon, setOpenCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<CouponInfo[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const discount = appliedCoupon?.discount ?? 0;
  const afterDiscount = price - discount;
  // const gst = Number((afterDiscount * GST_RATE).toFixed(2));
  // const grandTotal = Number((afterDiscount + gst).toFixed(2));

  const handleOpenCoupons = useCallback(async () => {
    setOpenCoupon(true);
    if (!targetPlan?.id) return;
    setCouponsLoading(true);
    try {
      const data = await getCouponsForMembership(targetPlan?.id);
      setAvailableCoupons(data.coupons ?? []);
    } catch {
      setAvailableCoupons([]);
    } finally {
      setCouponsLoading(false);
    }
  }, [targetPlan?.id]);

  // const handleApplyCoupon = useCallback(
  //   async (code: string) => {
  //     if (!code.trim() || !targetPlan?.id) return;
  //     setCouponError(null);
  //     setCouponLoading(true);
  //     try {
  //       const result = await getMembershipSummaryById(code.trim(), targetPlan?.id);
  //       setAppliedCoupon(result);
  //       setCouponInput(result.coupon.code);
  //       setOpenCoupon(false);
  //     } catch (err: any) {
  //       setCouponError(err?.message || "Invalid coupon code");
  //       setAppliedCoupon(null);
  //     } finally {
  //       setCouponLoading(false);
  //     }
  //   },
  //   [targetPlan?.id],
  // );

const handleApplyCoupon = useCallback(
  async (code: string) => {
    if (!code.trim() || !targetPlan?.id) return;

    setCouponError(null);
    setCouponLoading(true);

    try {
      const payload = {
        targetPlanId: targetPlan.id,
        code: code.trim(),
      };

      const result = await getMembershipSummaryById(payload);

      const updatedData = result?.data || result;

      // update pricing summary
      setSummaryData(updatedData);

      setAppliedCoupon({
        coupon: {
          code: code.trim(),
          id: updatedData?.coupon?.id || 1,
        },
        discount:
          updatedData?.coupon?.deductAmount ||
          updatedData?.coupon?.discountAmount ||
          0,
      } as any);

      setCouponInput(code.trim());
      setOpenCoupon(false);

    } catch (err: any) {
      setCouponError(err?.message || "Invalid coupon code");

      // reset original data on error
      setSummaryData(plan);

      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  },
  [targetPlan?.id, plan]
);
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
      setSummaryData(plan);
  };

  const handleCopyAndApply = (code: string) => {
    setCouponInput(code);
    handleApplyCoupon(code);
  };

  if (!plan) return null;
console.log(appliedCoupon,"appliedCoupon")
  if (openCoupon) {
    return (
      <div className="w-full max-w-sm mx-auto">
        {/* flex-col so the scrollable list and the pinned footer stack vertically */}
        <div className="bg-[#F9F9FB] rounded-xl flex flex-col h-[calc(100vh-200px)]">

          {/* Sticky header */}
          <div className="px-6 pt-6 pb-0 flex-shrink-0">
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
          </div>

          {/* Scrollable coupon list — takes all remaining space */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-6">
            {couponsLoading ? (
              <p className="text-sm text-[#929292] py-4 text-center">
                Loading coupons…
              </p>
            ) : availableCoupons.length === 0 ? (
              <p className="text-sm text-[#929292] py-4 text-center h-full flex items-center justify-center">
                No coupons available right now.
              </p>
            ) : (
              availableCoupons.map((c, idx) => (
                <div key={c.id}>
                  {idx > 0 && <div className="border-t border-black mb-4" />}
                  <div className="pb-4 mb-4">
                    <p className="font-semibold text-sm mb-1">
                      {c.type?.toLowerCase() === "percentage"
                        ? `GET ${c.value}% OFF`
                        : `GET ₹${c.value} OFF`}
                      {c.max_discount > 0 &&
                        c.type?.toLowerCase() === "percentage" && (
                          <span className="text-xs font-normal text-[#929292] ml-1">
                            (up to ₹{c.max_discount})
                          </span>
                        )}
                    </p>
                    {c.description && (
                      <p className="text-xs text-[#929292] mb-2">
                        {c.description}
                      </p>
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
                          <img
                            src="/images/copy.png"
                            alt=""
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </div>
                    {!c.canApply && c.inactiveReason && (
                      <p className="text-xs text-red-500 mt-1">
                        {c.inactiveReason}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pinned coupon input — always visible at the bottom */}
          <div className="flex-shrink-0 px-6 pb-4 bg-[#F9F9FB] rounded-b-xl">
            <div className="border-t border-black mb-4" />
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
            {couponError && (
              <p className="text-xs text-red-500 mt-1">{couponError}</p>
            )}
          </div>

        </div>
      </div>
    );
  }




  return (
    <>
    
  

      {
         plan.requiresAdminAction == true &&  plan.canUpgrade == false ?
         <div className="mb-6 min-h-[420px] rounded-3xl bg-gradient-to-br from-[#EEF4FF] via-white to-[#F5F9FF] p-8 shadow-[0_10px_40px_rgba(9,51,155,0.08)] border border-[#DCE7FF] flex items-center justify-center relative overflow-hidden group transition-all duration-500 hover:shadow-[0_20px_60px_rgba(9,51,155,0.15)]">
            
            {/* Background Blur Effects */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-[#09339B]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-32 w-32 bg-blue-200/30 rounded-full blur-2xl"></div>

            <div className="relative z-10 text-center max-w-[500px]">
              
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full bg-[#09339B]/20 animate-ping"></div>

                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#09339B] to-[#1D4ED8] text-white shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Heading */}
            

              {/* Message */}
              <p className="text-[15px] md:text-[17px] text-[#4B5563] leading-7 font-normal">
                {plan.message}
              </p>

              {/* Optional Button */}
             <a href="/plans">
                <button className="mt-8 px-6 py-3 rounded-full bg-[#09339B] text-white text-sm font-medium shadow-md hover:bg-[#0A2B80] transition-all duration-300 hover:scale-105">
                  Continue
                </button>
              </a>
            </div>
          </div>

        :

        plan.canUpgrade == false ?
        
          <div className="mb-6 min-h-[420px] rounded-3xl bg-gradient-to-br from-[#EEF4FF] via-white to-[#F5F9FF] p-8 shadow-[0_10px_40px_rgba(9,51,155,0.08)] border border-[#DCE7FF] flex items-center justify-center relative overflow-hidden group transition-all duration-500 hover:shadow-[0_20px_60px_rgba(9,51,155,0.15)]">
            
            {/* Background Blur Effects */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-[#09339B]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-32 w-32 bg-blue-200/30 rounded-full blur-2xl"></div>

            <div className="relative z-10 text-center max-w-[500px]">
              
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full bg-[#09339B]/20 animate-ping"></div>

                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#09339B] to-[#1D4ED8] text-white shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Heading */}
            

              {/* Message */}
              <p className="text-[15px] md:text-[17px] text-[#4B5563] leading-7 font-normal">
                {plan.message}
              </p>

              {/* Optional Button */}
              <a href="/plans">
                <button className="mt-8 px-6 py-3 rounded-full bg-[#09339B] text-white text-sm font-medium shadow-md hover:bg-[#0A2B80] transition-all duration-300 hover:scale-105">
                  Continue
                </button>
              </a>
              
            </div>
          </div>
       
      :
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-[#F9F9FB] rounded-xl p-6">
        {/* Price */}
        <div className="text-center">
          <p className="text-[30px] md:text-[40px] font-semibold text-[#1A1A1A]">
            {fmt(price)}
          </p>
          {/* <p className="text-[#929292] text-[16px] mt-1">{currentPlan?.remainingDays} Days</p> */}
          <p className="text-[#929292] text-[16px] mt-1">{targetPlan?.name}</p>
        </div>

        <div className="border-t border-[#AFAFAF] mt-6" />
          <div className="mt-6 space-y-2 text-sm">
            <h2 className="text-[20px] text-[#252525] font-medium mb-4">
              Current Plan Summary
            </h2>
            <div className="flex justify-between">
              <span>Name</span>
              <span>{currentPlan?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Price</span>
              <span>{currentPlan?.price}</span>
            </div>
          </div>

        {/* Summary */}
        <div className="mt-6 space-y-2 text-sm">
          <h2 className="text-[20px] text-[#252525] font-medium mb-4">
            Summary
          </h2>
          <div className="flex justify-between">
            <span>Amount</span>
            <span>{fmt(price)}</span>
          </div>
          {
            deductAmount &&
               <div className="flex justify-between">
                <span>Deduct Amount</span>
                <span className="text-green-600">
                  -{fmt(deductAmount)}
                </span>
              </div>

          }
       
          {appliedCoupon && (
            <div className="flex justify-between">
              <span>{appliedCoupon.coupon.code}</span>
              <span className="text-green-600">-{fmt(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Total</span>
            <span>{fmt(finalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>{fmt(gst)}</span>
          </div>
        </div>

        <div className="border-t border-[#AFAFAF] mt-4" />

        <div className="pt-3 flex justify-between font-semibold text-[17px]">
          <span className="text-[20px] text-[#252525] font-medium">
            Grand Total
          </span>
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
          <label className="text-sm font-semibold text-gray-700">
            Coupon Code
          </label>
          <div className="relative mt-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value.toUpperCase());
                setCouponError(null);
              }}
              disabled={couponLoading || !!appliedCoupon?.coupon.id}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyCoupon(couponInput);
              }}
              placeholder="Enter coupon code"
              className="w-full border rounded-lg py-2 px-3 pr-24 focus:outline-none focus:ring focus:ring-blue-200"
            />
            {appliedCoupon ? (
              <>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-[#D8E3FF] text-[#09339B] px-2 py-1 rounded-md text-xs font-medium">
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
          {couponError && (
            <p className="text-xs text-red-500 mt-2">{couponError}</p>
          )}
        </div>

        <div className="border-t border-[#AFAFAF] mt-4" />

        {/* Buy Membership */}
        <button
          onClick={async () => {
            if (!isAuthenticated) {
              const returnPath =
                window.location.pathname + window.location.search;
              router.push(`/login?next=${encodeURIComponent(returnPath)}`);
              return;
            }
            if (!targetPlan?.id || paymentLoading) return;
            setPaymentLoading(true);
            try {
              const refCode = getReferralCode() || undefined;
              const orderData = await createOrder({
                type: "membership",
                entityId: targetPlan?.id,
                couponCode: appliedCoupon?.coupon.code || undefined,
                referralCode: refCode,
              });

              if (orderData.free && orderData.paid) {
                router.push(`/payment-success?orderId=${orderData.orderId}`);
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
                description: plan.name || "Membership Plan",
                order_id: orderData.razorpayOrderId,
                handler: async (response: any) => {
                  try {
                    await verifyOrder({
                      orderId: orderData.orderId,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                    });
                    router.push(`/payment-success?orderId=${orderData.orderId}`);
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
                router.push(`/payment-success?orderId=${orderData.orderId}`);
              });
              rzp.open();
            } catch (err: any) {
              alert(err?.message || "Failed to create order. Please try again.");
            } finally {
              setPaymentLoading(false);
            }
          }}
          disabled={paymentLoading}
          className="w-full bg-[#09339B] hover:bg-white text-white hover:text-[#09339B] border border-[#09339B] rounded-lg py-3 mt-5 font-medium text-[16px] transition disabled:opacity-60"
        >
          {paymentLoading ? "Processing…" : "Buy Membership"}
        </button>
      </div>
       </div>
      }
   
    </>
  );
}
