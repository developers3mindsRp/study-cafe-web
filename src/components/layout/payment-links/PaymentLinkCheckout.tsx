"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { PublicPaymentLink, PaymentLinkUtm } from "@/services/paymentLink.service";
import { createPaymentLinkOrder, verifyPaymentLinkOrder } from "@/services/paymentLink.service";
import * as authService from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import { queryKeys } from "@/lib/react-query";
import { getReferralCode } from "@/utils/auth.utils";
import { formatPaymentLinkExpiry } from "@/utils/paymentLinkExpiry";
import type { ApiError } from "@/types/api.types";
import {
  Clock3,
  Users,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  IndianRupee,
  GraduationCap,
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

function queryString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Campaign params off the URL, so a link blasted over WhatsApp still reports its source. */
function readUtm(query: Record<string, unknown>): PaymentLinkUtm | undefined {
  const utm: PaymentLinkUtm = {};
  const source = queryString(query.utm_source);
  const medium = queryString(query.utm_medium);
  const campaign = queryString(query.utm_campaign);
  const content = queryString(query.utm_content);
  const term = queryString(query.utm_term);
  if (source) utm.source = source;
  if (medium) utm.medium = medium;
  if (campaign) utm.campaign = campaign;
  if (content) utm.content = content;
  if (term) utm.term = term;
  return Object.keys(utm).length > 0 ? utm : undefined;
}

function errorMessage(err: unknown, fallback: string): string {
  const api = err as ApiError | undefined;
  if (api?.message) return String(api.message);
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: string }).message) || fallback;
  }
  return fallback;
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

/**
 * "details" collects the buyer, then forks on whether that email already has an
 * account: "signin" for returning buyers, "signup" for new ones. Both fork back into
 * the same checkout call, so payment opens immediately after authentication rather
 * than sending the buyer away to /signup and hoping they come back.
 */
type Stage = "details" | "signin" | "signup";

type Props = {
  link: PublicPaymentLink;
  initialExpired: boolean;
  /** Preformatted IST expiry for messaging (from SSR); matches link.expires_at */
  expiryDisplayLabel: string | null;
};

export default function PaymentLinkCheckout({ link, initialExpired, expiryDisplayLabel }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
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

  /** Grants access on its own — drives the "instant access" copy and the success CTA. */
  const grantsAccess = !!link.product && link.product.auto_enroll !== false;

  const expiryLabelForMessage =
    expiryDisplayLabel?.trim() ||
    (link.expires_at ? formatPaymentLinkExpiry(link.expires_at) : "") ||
    "—";

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
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

  // ─── Prefill ────────────────────────────────────────────────────────────────
  // A signed-in buyer should not retype what we already know, and a campaign link can
  // carry the buyer's details so the form is one tap from paid. Fills once per source:
  // re-running would undo a buyer who deliberately cleared a field to correct it.
  const prefilledRef = useRef<"none" | "query" | "user">("none");
  useEffect(() => {
    if (!router.isReady) return;
    // The signed-in profile is better data than URL params, so it may overwrite them.
    const source = user ? "user" : "query";
    if (prefilledRef.current === "user" || prefilledRef.current === source) return;

    const q = router.query as Record<string, unknown>;
    const name = user?.name || queryString(q.name);
    const email = user?.email || queryString(q.email);
    const phone = user?.phone || queryString(q.phone);
    if (!name && !email && !phone) return;

    prefilledRef.current = source;
    if (name) setValue("fullName", name);
    if (email) setValue("email", email);
    if (phone) {
      setValue("mobile", phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "").slice(-10)}`);
    }
  }, [router.isReady, router.query, user, setValue]);

  // ─── Inline auth ────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>("details");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signinMode, setSigninMode] = useState<"password" | "otp">("password");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInfo, setOtpInfo] = useState<string | null>(null);

  const resetAuthState = () => {
    setAuthError(null);
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setOtpSent(false);
    setOtpInfo(null);
    setSigninMode("password");
  };

  const backToDetails = () => {
    resetAuthState();
    setStage("details");
  };

  /** Push the fresh session into the cache so the header updates without a reload. */
  const adoptSession = (nextUser: unknown) => {
    queryClient.setQueryData(queryKeys.auth.currentUser, nextUser);
    void queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
  };

  // ─── Checkout ───────────────────────────────────────────────────────────────
  const startCheckout = async (values: FormValues) => {
    setSubmitError(null);
    if (disabledCheckout) return;

    const orderData = await createPaymentLinkOrder({
      paymentLinkId: link.id,
      fullName: values.fullName,
      email: values.email.trim(),
      mobile: values.mobile.trim(),
      gstNumber: values.gstNumber?.trim() || undefined,
      referralCode: getReferralCode() || undefined,
      utm: readUtm(router.query as Record<string, unknown>),
    });

    const successUrl = (orderId: string) =>
      `/payment-success?order_id=${encodeURIComponent(orderId)}&payment_link=1${grantsAccess ? "&enrolled=1" : ""}`;

    // The server marks the buyer's email verified when the order completes. The
    // fresh flag must be IN the cache before navigating, or the RequireVerifiedEmail
    // gate on the success page bounces the buyer to the OTP screen. Invalidation is
    // not enough: for an account created mid-checkout the auth query is disabled
    // (AuthProvider only reads the token on mount), so a disabled query would never
    // refetch — fetch /auth/me directly and seed the cache instead.
    const goToSuccess = async (orderId: string) => {
      try {
        const freshUser = await authService.getCurrentUser();
        queryClient.setQueryData(queryKeys.auth.currentUser, freshUser);
      } catch {
        /* non-blocking — worst case the gate re-checks on the next full page load */
      }
      void router.push(successUrl(orderId));
    };

    if (orderData.free && orderData.paid) {
      await goToSuccess(orderData.orderId);
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
      description: link.product?.name || link.title || "Payment",
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
          await goToSuccess(orderData.orderId);
        } catch (verifyErr: unknown) {
          alert(
            `${errorMessage(verifyErr, "Payment verification failed.")} If payment was deducted, save this message and contact support with your email and payment time.`,
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
    new Rp(options).open();
  };

  const onSubmitDetails = handleSubmit(async (values) => {
    setSubmitError(null);
    if (disabledCheckout) return;

    // Already signed in — nothing to ask, go straight to payment.
    if (isAuthenticated) {
      try {
        await startCheckout(values);
      } catch (e: unknown) {
        setSubmitError(errorMessage(e, "Checkout failed. Please try again."));
      }
      return;
    }

    try {
      const exists = await authService.accountExists(values.email.trim());
      resetAuthState();
      setStage(exists ? "signin" : "signup");
    } catch {
      setStage("signup");
    }
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const values = getValues();

    if (signinMode === "password" && password.length < 1) {
      setAuthError("Enter your password.");
      return;
    }
    if (signinMode === "otp" && otp.replace(/\D/g, "").length !== 6) {
      setAuthError("Enter the 6-digit code we emailed you.");
      return;
    }

    setAuthBusy(true);
    try {
      const session =
        signinMode === "password"
          ? await authService.login({ email: values.email.trim(), password })
          : await authService.loginWithEmailOtp({
              email: values.email.trim(),
              otp: otp.replace(/\D/g, ""),
            });
      adoptSession(session.user);
      await startCheckout(values);
    } catch (err: unknown) {
      setAuthError(
        errorMessage(
          err,
          signinMode === "password"
            ? "That password did not work. Try again or use a sign-in code."
            : "That code did not work. Request a new one.",
        ),
      );
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSendOtp = async () => {
    setAuthError(null);
    setOtpInfo(null);
    setAuthBusy(true);
    try {
      await authService.requestLoginOtp(getValues("email").trim());
      setOtpSent(true);
      setSigninMode("otp");
      setOtpInfo("We emailed you a 6-digit sign-in code.");
    } catch (err: unknown) {
      setAuthError(errorMessage(err, "Could not send the code. Try again shortly."));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const values = getValues();

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    if (!acceptedTerms) {
      setAuthError("Please accept the Terms & Conditions and Privacy Policy.");
      return;
    }

    setAuthBusy(true);
    try {
      // registerQuick returns a live session immediately — a buyer who is ready to pay
      // should never be parked on an OTP screen. The server marks the email verified
      // once payment completes, so the immediate verification-code email is skipped.
      const session = await authService.registerQuick({
        name: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.mobile.trim(),
        password,
        confirmPassword,
        skipVerificationEmail: true,
      });
      adoptSession(session.user);
      await startCheckout(values);
    } catch (err: unknown) {
      const api = err as ApiError;
      if (api?.statusCode === 409) {
        // They do have an account after all (e.g. registered on another device
        // between the lookup and now) — move them to sign-in rather than dead-end.
        resetAuthState();
        setStage("signin");
        setAuthError("You already have an account with this email. Sign in to finish.");
        return;
      }
      setAuthError(errorMessage(err, "Could not create your account. Try again."));
    } finally {
      setAuthBusy(false);
    }
  };

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
    value: string;
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

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-4 py-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const primaryButtonClass =
    "rounded-lg bg-[#09339B] border border-[#09339B] px-6 py-3 text-lg font-semibold text-white hover:bg-white hover:text-[#09339B] disabled:opacity-50 w-full";

  const payLabel = `Pay ${fmt(grandTotal)}`;

  return (
    <div className="p-[50px_0]">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 mb-10 items-center">
        <div className=" rounded shadow-md  h-full">
          <div className="bg-[url('/images/paymentlink.png')] bg-cover bg-center py-4 px-4 text-center relative">
            <img src="/images/paymentclock.svg" className="m-auto" />
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
            {/* What the payment actually buys — only shown when the link enrols on its own */}
            {link.product && (
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-[#DDE7FF] bg-[#F5F8FF] p-3">
                {link.product.thumbnail_url ? (
                  <img
                    src={link.product.thumbnail_url}
                    alt=""
                    className="h-16 w-24 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-[#E4ECFF]">
                    <GraduationCap className="text-[#09339B]" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#09339B]">
                    {link.product.type === "membership" ? "Membership included" : "Course included"}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {link.product.name || link.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {grantsAccess
                      ? "Added to your account automatically as soon as payment succeeds."
                      : "Our team will activate this on your account after payment."}
                  </div>
                </div>
              </div>
            )}

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
                subtitle={grantsAccess ? "Unlocked right after payment" : "Get access immediately"}
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
          {stage === "details" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Your Details</h2>
              <form onSubmit={onSubmitDetails} className="space-y-4 ">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-[#FF383C]">*</span>
                  </label>
                  <input
                    {...register("fullName")}
                    placeholder="eg. Amit Kumar"
                    className={inputClass}
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-[#FF383C]">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-[#FF383C]">*</span>
                  </label>
                  <input type="email" {...register("email")} className={inputClass} />
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
                    className={`${inputClass} uppercase`}
                  />
                  {errors.gstNumber && <p className="mt-1 text-xs text-[#FF383C]">{errors.gstNumber.message}</p>}
                </div>

                {submitError && <p className="text-sm text-[#FF383C]">{submitError}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting || disabledCheckout}
                  className={primaryButtonClass}
                >
                  {isSubmitting ? "Processing…" : isAuthenticated ? payLabel : "Continue"}
                </button>

                {!isAuthenticated && grantsAccess && (
                  <p className="text-center text-xs text-gray-500">
                    Next: set a password so your access is saved to your account.
                  </p>
                )}
              </form>
            </>
          )}

          {stage === "signin" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-1 mb-4 text-sm text-gray-600">
                You already have an account for{" "}
                <span className="font-semibold">{getValues("email")}</span>. Sign in and your payment
                opens right away.
              </p>

              <form onSubmit={handleSignIn} className="space-y-4">
                {signinMode === "password" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password <span className="text-[#FF383C]">*</span>
                    </label>
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      placeholder="Your password"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sign-in code <span className="text-[#FF383C]">*</span>
                    </label>
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="______"
                      className={`${inputClass} tracking-[0.35em] text-center text-xl`}
                    />
                  </div>
                )}

                {otpInfo && <p className="text-sm text-green-700">{otpInfo}</p>}
                {authError && <p className="text-sm text-[#FF383C]">{authError}</p>}

                <button type="submit" disabled={authBusy || disabledCheckout} className={primaryButtonClass}>
                  {authBusy ? "Please wait…" : `Sign in & ${payLabel.toLowerCase()}`}
                </button>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      if (signinMode === "password" || !otpSent) {
                        void handleSendOtp();
                      } else {
                        setSigninMode("password");
                        setAuthError(null);
                      }
                    }}
                    disabled={authBusy}
                    className="text-[#09339B] hover:underline disabled:opacity-50"
                  >
                    {signinMode === "password"
                      ? "Email me a sign-in code instead"
                      : otpSent
                        ? "Use my password instead"
                        : "Send the code"}
                  </button>
                  {signinMode === "otp" && otpSent && (
                    <button
                      type="button"
                      onClick={() => void handleSendOtp()}
                      disabled={authBusy}
                      className="text-gray-500 hover:underline disabled:opacity-50"
                    >
                      Resend code
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={backToDetails}
                  className="w-full text-sm text-gray-500 hover:underline"
                >
                  Use a different email
                </button>
              </form>
            </>
          )}

          {stage === "signup" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="mt-1 mb-4 text-sm text-gray-600">
                One step so{" "}
                {grantsAccess ? "your access is saved to your account" : "we can send your receipt"} —
                then payment opens straight away.
              </p>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  <div className="font-semibold text-gray-900">{getValues("fullName")}</div>
                  <div>{getValues("email")}</div>
                  <div>{getValues("mobile")}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Create password <span className="text-[#FF383C]">*</span>
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm password <span className="text-[#FF383C]">*</span>
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    placeholder="Repeat your password"
                  />
                </div>

                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="mt-1 shrink-0"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/terms-conditions" className="text-[#09339B] hover:underline">
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy-policy" className="text-[#09339B] hover:underline">
                      Privacy Policy
                    </a>
                    <span className="text-[#FF383C]"> *</span>
                  </span>
                </label>

                {authError && <p className="text-sm text-[#FF383C]">{authError}</p>}

                <button type="submit" disabled={authBusy || disabledCheckout} className={primaryButtonClass}>
                  {authBusy ? "Please wait…" : `Create account & ${payLabel.toLowerCase()}`}
                </button>

                <button
                  type="button"
                  onClick={backToDetails}
                  className="w-full text-sm text-gray-500 hover:underline"
                >
                  Back to my details
                </button>
              </form>
            </>
          )}

          <style jsx global>{`
            .payment-link-phone {
              border: 1px solid #d1d5db;
              border-radius: 0.5rem;
              padding: 10px 10px;
            }
            .payment-link-phone input.PhoneInputInput {
              width: 100%;
              padding: 0;
              font-size: 0.875rem;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
