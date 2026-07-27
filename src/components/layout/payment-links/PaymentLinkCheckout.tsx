"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { PublicPaymentLink } from "@/services/paymentLink.service";
import { createPaymentLinkOrder, verifyPaymentLinkOrder } from "@/services/paymentLink.service";
import { getReferralCode } from "@/utils/auth.utils";
import { formatPaymentLinkExpiry } from "@/utils/paymentLinkExpiry";
import {
  Clock3,
  Users,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  IndianRupee,
} from "lucide-react";

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function parseNum(val?: string | number | null): number {
  if (val == null || val === "") return 0;
  const n = typeof val === "string" ? parseFloat(val) : val;
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const GST_RATE = 0.18;

const schema = yup.object({
  fullName: yup.string().trim().required("Full name is required").max(250),
  email: yup.string().trim().required("Email is required").email("Enter a valid email").max(255),
  mobile: yup
    .string()
    .trim()
    .required("Mobile number is required")
    .test("phone", "Enter a valid mobile number", (v) => !!v && isValidPhoneNumber(v)),
  gstNumber: yup
    .string()
    .trim()
    .defined()
    .test("gst", "Enter a valid 15-character GSTIN", (v) => !v || GSTIN_REGEX.test(v.toUpperCase())),
});

type FormValues = {
  fullName: string;
  email: string;
  mobile: string;
  gstNumber: string;
};

type Props = {
  link: PublicPaymentLink;
  initialExpired: boolean;
  /** Preformatted IST expiry for messaging (from SSR); matches link.expires_at */
  expiryDisplayLabel: string | null;
};

export default function PaymentLinkCheckout({ link, initialExpired, expiryDisplayLabel }: Props) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Avoid hydration mismatch: server time ≠ client time for countdown. */
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => 0);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [mounted]);

  const sale = parseNum(link.sale_price);
  const mrp = parseNum(link.amount);
  const gst = Number((sale * GST_RATE).toFixed(2));
  const grandTotal = Number((sale + gst).toFixed(2));

  const expiryMs = link.expires_at ? new Date(link.expires_at).getTime() : NaN;
  /** Stable on first paint (from SSR); after mount use live clock */
  const expired = mounted ? Number.isFinite(expiryMs) && expiryMs <= now : initialExpired;
  /** Only compute after mount — avoids SSR/client clock mismatch */
  const countdownMs =
    mounted && Number.isFinite(expiryMs) ? Math.max(0, expiryMs - now) : 0;
  const countdownLabel = useMemo(() => {
    const totalSec = Math.floor(countdownMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m} min ${s} sec`;
  }, [countdownMs]);

    const countdown = useMemo(() => {
      const total = Math.max(0, countdownMs);

      const hours = Math.floor(total / 3600000);
      const minutes = Math.floor((total % 3600000) / 60000);
      const seconds = Math.floor((total % 60000) / 1000);
      const ms = Math.floor((total % 1000) / 10);

      return {
        hours,
        minutes,
        seconds,
        ms,
      };
    }, [countdownMs]);
  const soldOut =
    typeof link.total_seats === "number" &&
    link.total_seats > 0 &&
    typeof link.seats_remaining === "number" &&
    link.seats_remaining <= 0;

  const disabledCheckout = expired || soldOut;

  const expiryLabelForMessage =
    expiryDisplayLabel?.trim() ||
    (link.expires_at ? formatPaymentLinkExpiry(link.expires_at) : "") ||
    "—";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      gstNumber: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (disabledCheckout) return;
    try {
      const refCode = getReferralCode() || undefined;
      const orderData = await createPaymentLinkOrder({
        paymentLinkId: link.id,
        fullName: values.fullName,
        email: values.email.trim(),
        mobile: values.mobile.trim(),
        gstNumber: values.gstNumber?.trim() || undefined,
        referralCode: refCode,
      });

      if (orderData.free && orderData.paid) {
        router.push(
          `/payment-success?order_id=${encodeURIComponent(orderData.orderId)}&payment_link=1`,
        );
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setSubmitError("Failed to load payment gateway. Please try again.");
        return;
      }
      if (!orderData.key || !orderData.razorpayOrderId) {
        setSubmitError("Could not start payment. Please try again.");
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Studycafe",
        description: link.title || "Payment",
        order_id: orderData.razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPaymentLinkOrder({
              orderId: orderData.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            router.push(
              `/payment-success?order_id=${encodeURIComponent(orderData.orderId)}&payment_link=1`,
            );
          } catch (verifyErr: unknown) {
            const msg =
              typeof verifyErr === "object" && verifyErr !== null && "message" in verifyErr
                ? String((verifyErr as { message?: string }).message)
                : "Payment verification failed.";
            alert(
              `${msg} If payment was deducted, save this message and contact support with your email and payment time.`,
            );
          }
        },
        prefill: {
          name: orderData.prefill?.name || values.fullName,
          email: orderData.prefill?.email || values.email.trim(),
          contact: orderData.prefill?.contact || values.mobile.replace(/\D/g, "").slice(-10),
        },
        theme: { color: "#dc2626" },
      };

      const Rp = (typeof window !== "undefined" ? (window as unknown as { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (e: string, fn: () => void) => void } }).Razorpay : undefined);
      if (!Rp) {
        setSubmitError("Payment gateway unavailable.");
        return;
      }
      const rzp = new Rp(options);
      rzp.open();
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e !== null && "message" in e
          ? String((e as { message?: string }).message)
          : "Checkout failed. Please try again.";
      setSubmitError(msg);
    }
  });

  if (expired) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 md:p-10 text-center shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{link.title}</h1>
          <p className="mt-8 text-base md:text-lg font-semibold text-red-800">
            Payment Link is Expired on {expiryLabelForMessage}
          </p>
          <p className="mt-4 text-sm text-gray-600">Checkout is closed for this link.</p>
        </div>
      </div>
    );
  }
  function TimeBox({
      value,
      label,
    }: {
      value: any;
      label: string;
    }) {
      return (
        <div className="bg-white shadow-sm rounded-md px-4 py-2 text-center min-w-[70px]">
          <div className="text-3xl font-bold text-orange-500">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      );
    }
function Feature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>

    </div>
  );
}
  return (
    <div className="p-[50px_0]">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 mb-10 items-center">
          <div className=" rounded shadow-md  h-full">
            {/* <h1 className="text-xl md:text-2xl font-bold text-gray-900">{link.title}</h1> */}
            {/* {link.description && (
              <div
                className="mt-3 prose prose-sm max-w-none text-gray-700 [&_a]:text-blue-600"
                dangerouslySetInnerHTML={{ __html: link.description }}
              />
            )} */}

               <div className="bg-[url('/images/paymentlink.png')] bg-cover bg-center py-4 px-4 text-center relative">

                  <img src="/images/paymentclock.svg" className="m-auto"/>
                  {link.total_seats > 0 ? (
                    <>
                       <h2 className="text-4xl font-bold mt-4 text-gray-800">
                          Hurry Up!
                        </h2>

                        <div className="flex justify-center items-center gap-2 mt-2 text-lg">
                          <Users size={20} className="text-blue-700" />
                          <span className="font-semibold text-blue-700">{link.display_sold}</span>
                          <span className="text-gray-700">
                            Sold out of {link.total_seats}
                          </span>
                        </div>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-[#09339B]">{link.display_sold}</span> seats claimed so far (unlimited
                      capacity)
                    </>
                  )}
                 
                </div>
                <div className="p-6">

{/*        
            {!expired && Number.isFinite(expiryMs) && (
              <p className="mt-2 text-sm font-bold text-[#09339B]">
                {mounted ? (
                  <>This Payment Link will Expire in {countdownLabel}</>
                ) : (
                  <>This payment link expires soon — timer updates in a moment.</>
                )}
              </p>
            )} */}

            {!expired && Number.isFinite(expiryMs) && (
              <div className="md:flex items-center gap-4 rounded-md bg-[#FDF6E8] px-2 py-2 border border-[#F5E3BC]">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF3D9]">
                    <Clock3 size={18} className="text-orange-500" />
                  </div>
                  <span className="text-sm text-gray-700">
                    This Payment Link will Expire in
                  </span>
                </div>

                {mounted && (
                  <div className="ml-auto flex items-center justify-center gap-2">
                  <TimeBox value={String(countdown.hours).padStart(2, "0")} label="HRS" />
                  <span className="text-xl font-bold text-gray-400">:</span>
                  <TimeBox value={String(countdown.minutes).padStart(2, "0")} label="MIN" />
                  <span className="text-xl font-bold text-gray-400">:</span>

                  <TimeBox value={String(countdown.seconds).padStart(2, "0")} label="SEC" />
                  {/* <span className="text-xl font-bold text-gray-400">:</span> */}

                  {/* <TimeBox value={String(countdown.ms).padStart(2, "0")} label="MS" /> */}
                  </div>
                )}
              </div>
            )}


             {/* Amount Card */}
        <div className="mt-2 border rounded-lg p-4">

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <IndianRupee className="text-green-600" />
            </div>

            <h3 className="text-2xl font-bold">
              {/* ₹ {amount.toFixed(2)} */}
              {mrp > sale && (
                <del className="text-[#707070] mr-2">{fmt(mrp)}</del>
              )}
               {fmt(sale)}
              
            </h3>
          </div>

          <div className="border-t border-dashed my-4"></div>

          <div className="flex justify-between text-md text-gray-600">
            <span>Plus GST {fmt(gst)}:</span>
            <span>₹ {gst.toFixed(2)}</span>
          </div>

          <div className="mt-2 bg-green-100 rounded-lg p-2 flex justify-between items-center">

            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <ShieldCheck />
              You pay:
            </div>

            <div className="text-2xl font-bold text-green-700">
              {fmt(grandTotal)}
            </div>
          </div>
        </div>
            {/* {soldOut && <p className="mt-2 text-sm font-bold text-[#09339B]">All seats are booked.</p>}
            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-bold text-[#09339B]">{fmt(sale)}</span>
              {mrp > sale && (
                <span className="text-lg text-gray-400 line-through">{fmt(mrp)}</span>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Plus GST (18%): {fmt(gst)} · You pay: <span className="font-semibold text-gray-800">{fmt(grandTotal)}</span>
            </p> */}
              {/* Footer */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            
                      <Feature
                        icon={<ShieldCheck className="text-green-600" />}
                        title="Secure Payment"
                        subtitle="256-bit SSL Encrypted"
                      />
            
                      <Feature
                        icon={<BadgeCheck className="text-purple-600" />}
                        title="Instant Access"
                        subtitle="Get access immediately"
                      />
            
                      <Feature
                        icon={<Headphones className="text-blue-600" />}
                        title="24/7 Support"
                        subtitle="We're here to help"
                      />
            
                    </div>
          </div>
        </div>
          <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Your Details</h2>
              <form onSubmit={onSubmit} className="space-y-4 ">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-[#FF383C]">*</span>
                  </label>
                  <input
                    {...register("fullName")}
                    placeholder="eg. Amit Kumar"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-[#FF383C]">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-[#FF383C]">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#FF383C]">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number <span className="text-[#FF383C]">*</span>
                  </label>
                  <Controller
                    name="mobile"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={value || undefined}
                        onChange={(v) => onChange(v || "")}
                        className="mt-1 payment-link-phone"
                      />
                    )}
                  />
                  {errors.mobile && <p className="mt-1 text-xs text-[#FF383C]">{errors.mobile.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GST number</label>
                  <input
                    {...register("gstNumber")}
                    placeholder="15-character GSTIN (optional)"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-4 text-sm uppercase focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.gstNumber && <p className="mt-1 text-xs text-[#FF383C]">{errors.gstNumber.message}</p>}
                </div>

                {submitError && <p className="text-sm text-[#FF383C]">{submitError}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting || disabledCheckout}
                  className="rounded-lg bg-[#09339B] border border-[#09339B] px-6 py-3 text-lg font-semibold text-white hover:bg-white hover:text-[#09339B] disabled:opacity-50 w-full"
                >
                  {isSubmitting ? "Processing…" : "Checkout"}
                </button>
              </form>
            <style jsx global>{`
            .payment-link-phone{
              border: 1px solid #d1d5db;
              border-radius: 0.5rem;
              
                padding:10px 10px ;
            }
              .payment-link-phone input.PhoneInputInput {
                width: 100%;
                  padding:0;
                font-size: 0.875rem;
              }
            `}</style>
          </div>
          

        
        </div>
    </div>
  );
}
