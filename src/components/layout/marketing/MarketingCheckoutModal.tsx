"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";
import {
  createMarketingGuestOrder,
  createOrder,
  verifyMarketingGuestOrder,
  verifyOrder,
} from "@/services/order.service";
import { checkPurchaseStatus } from "@/services/purchases.service";
import * as authService from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import { queryKeys } from "@/lib/react-query";
import { getReferralCode } from "@/utils/auth.utils";
import type { ApiError } from "@/types/api.types";
import { BadgeCheck, ShieldCheck, X } from "lucide-react";

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

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function queryString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Campaign params off the ad URL, so the order records which campaign converted. */
function readUtm(query: Record<string, unknown>) {
  const utm: Record<string, string> = {};
  for (const key of ["source", "medium", "campaign", "content", "term"] as const) {
    const v = queryString(query[`utm_${key}`]);
    if (v) utm[key] = v;
  }
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
});

type FormValues = {
  fullName: string;
  email: string;
  mobile: string;
};

/**
 * Same fork as PaymentLinkCheckout: "details" collects the buyer, then splits on
 * whether the email already has an account. registerQuick returns a live session
 * with NO OTP gate, so a brand-new ad visitor goes details → Razorpay without ever
 * leaving the landing page.
 *
 * Creating an account is optional, and only a buyer who ticks "Create a StudyCafe
 * account" is ever asked for a password or a code — new email → "signup" (choose a
 * password), existing email → "signin". Everyone else goes straight to payment:
 *  - new email: stored without a password (registerQuick), then the normal checkout;
 *  - existing email: a guest order placed on that account with no session at all,
 *    ending on the in-modal "paid" stage (the thank-you page needs a session).
 *
 * "owned": the buyer already has this course. Shown instead of a Pay button so a
 * returning learner (or a double click after paying) is sent to their dashboard
 * rather than at order-service's double-payment guard.
 */
type Stage = "details" | "signin" | "signup" | "owned" | "paid";

/** order-service refuses a repeat paid order inside its double-payment window with this 409. */
function isAlreadyPurchasedError(err: unknown): boolean {
  const api = err as ApiError | undefined;
  return api?.statusCode === 409 && /already gone through|already (have|available)/i.test(String(api.message || ""));
}

/** order-service's per-user idempotency lock: a second create arrived while the first was still running. */
function isDuplicateInProgressError(err: unknown): boolean {
  const api = err as ApiError | undefined;
  return api?.statusCode === 429 && /duplicate order/i.test(String(api.message || ""));
}

/** Guest checkout: this email's account already holds the course. */
function isGuestAlreadyPurchasedError(err: unknown): boolean {
  return (err as ApiError | undefined)?.code === "ALREADY_PURCHASED";
}

/** Guest checkout: the email has no account after all (lookup failed or raced). */
function isAccountNotFoundError(err: unknown): boolean {
  return (err as ApiError | undefined)?.code === "ACCOUNT_NOT_FOUND";
}

/** registerQuick 409s for a duplicate email OR a duplicate phone — only the former means "sign in". */
function isDuplicatePhoneError(err: unknown): boolean {
  const api = err as ApiError | undefined;
  return api?.statusCode === 409 && /phone|mobile|number/i.test(String(api.message || ""));
}

type Props = {
  data: ResolvedMarketingPage;
  open: boolean;
  onClose: () => void;
};

export default function MarketingCheckoutModal({ data, open, onClose }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Razorpay is open or a redirect is in flight — closing now would strand the buyer. */
  const [payBusy, setPayBusyState] = useState(false);
  /**
   * Synchronous twin of payBusy. State updates land on the next render, so a fast
   * double-tap on "Pay" could fire createOrder twice before the button disables —
   * the second one then trips order-service's idempotency lock (429 "Duplicate
   * order in progress"). The ref is checked and set in the same tick.
   */
  const payBusyRef = useRef(false);
  const setPayBusy = (v: boolean) => {
    payBusyRef.current = v;
    setPayBusyState(v);
  };

  const sale = data.salePrice;
  const mrp = data.listPrice;
  const gst = Number((sale * GST_RATE).toFixed(2));
  const grandTotal = Number((sale + gst).toFixed(2));

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { fullName: "", email: "", mobile: "" },
  });

  // ─── Prefill ────────────────────────────────────────────────────────────────
  // Signed-in profile beats URL params; either fills once so a buyer who cleared
  // a field to correct it is not fought by the effect.
  const prefilledRef = useRef<"none" | "query" | "user">("none");
  useEffect(() => {
    if (!open || !router.isReady) return;
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
  }, [open, router.isReady, router.query, user, setValue]);

  // Landing page behind the overlay must not scroll while the buyer is checking out.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ─── Inline auth ────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>("details");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  /** Opt-in, so unticked by default: without it the buyer is stored with no password. */
  const [createAccount, setCreateAccount] = useState(false);
  const [signinMode, setSigninMode] = useState<"password" | "otp">("password");
  /** false: the account on file has no password, so sign-in is code-only. */
  const [accountHasPassword, setAccountHasPassword] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInfo, setOtpInfo] = useState<string | null>(null);

  const resetAuthState = () => {
    setAuthError(null);
    setPassword("");
    setOtp("");
    setOtpSent(false);
    setOtpInfo(null);
    setSigninMode("password");
    setAccountHasPassword(true);
  };

  const backToDetails = () => {
    resetAuthState();
    setStage("details");
  };

  const handleClose = () => {
    if (payBusy) return;
    setSubmitError(null);
    backToDetails();
    onClose();
  };

  /** Push the fresh session into the cache so the header updates without a reload. */
  const adoptSession = (nextUser: unknown) => {
    queryClient.setQueryData(queryKeys.auth.currentUser, nextUser);
    void queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
  };

  // ─── Guest "paid" stage ─────────────────────────────────────────────────────
  /** The campaign's own post-purchase destination; full page load, so absolute http(s) only. */
  const campaignRedirectUrl =
    data.postPurchaseRedirectUrl && /^https?:\/\//i.test(data.postPurchaseRedirectUrl)
      ? data.postPurchaseRedirectUrl
      : null;
  const [paidCountdown, setPaidCountdown] = useState(10);

  useEffect(() => {
    if (stage !== "paid" || !campaignRedirectUrl) return;
    const delay = data.postPurchaseRedirectDelay;
    setPaidCountdown(typeof delay === "number" && delay >= 0 ? delay : 10);
  }, [stage, campaignRedirectUrl, data.postPurchaseRedirectDelay]);

  useEffect(() => {
    if (stage !== "paid" || !campaignRedirectUrl) return;
    if (paidCountdown <= 0) {
      window.location.replace(campaignRedirectUrl);
      return;
    }
    const timer = setTimeout(() => setPaidCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [stage, campaignRedirectUrl, paidCountdown]);

  // ─── Already-owned check ────────────────────────────────────────────────────
  /**
   * Does the signed-in session already have access to this course? Uses
   * /access/check (covers direct purchase and membership). A failed lookup
   * returns false so a flaky call never blocks a sale — order-service's own guard
   * still backstops it and is mapped to the "owned" stage below.
   */
  const alreadyOwnsCourse = async (): Promise<boolean> => {
    try {
      return await checkPurchaseStatus(String(data.courseId));
    } catch {
      return false;
    }
  };

  // A signed-in learner who already has the course should see "go to dashboard"
  // the moment the modal opens, not a Pay button that 409s.
  useEffect(() => {
    if (!open || !isAuthenticated) return;
    let cancelled = false;
    void alreadyOwnsCourse().then((owned) => {
      if (!cancelled && owned) setStage("owned");
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isAuthenticated, data.courseId]);

  // ─── Checkout ───────────────────────────────────────────────────────────────
  const goToSuccess = async (orderId: string) => {
    // The server marks the buyer's email verified when the order completes. The
    // fresh flag must be IN the cache before navigating, or the RequireVerifiedEmail
    // gate on the success page bounces the buyer to the OTP screen. Invalidation is
    // not enough: for an account created mid-checkout the auth query is disabled
    // (AuthProvider only reads the token on mount), so a disabled query would never
    // refetch — fetch /auth/me directly and seed the cache instead.
    try {
      const freshUser = await authService.getCurrentUser();
      queryClient.setQueryData(queryKeys.auth.currentUser, freshUser);
    } catch {
      /* non-blocking — worst case the gate re-checks on the next full page load */
    }
    // Naming the campaign lets the thank-you page use THIS page's post-purchase redirect
    // instead of the course's. Only the slug travels in the URL — the destination itself
    // is read back from the published page, so a tampered link cannot retarget it.
    const campaign = data.postPurchaseRedirectUrl
      ? `&m=${encodeURIComponent(data.slug)}`
      : "";
    void router.push(`/payment-success?order_id=${encodeURIComponent(orderId)}${campaign}`);
  };

  /** Guest checkout has no session for the thank-you page — finish inside the modal. */
  const showGuestPaid = () => {
    setPayBusy(false);
    setStage("paid");
  };

  /**
   * `guest`: the email already has an account but the buyer is not signed in and did
   * not ask for one — the order goes on that account without a session.
   */
  const startCheckout = async ({ guest = false }: { guest?: boolean } = {}) => {
    if (payBusyRef.current) return; // a checkout is already in flight — ignore the repeat tap
    setSubmitError(null);
    setPayBusy(true);
    try {
      const values = getValues();
      const referralCode = getReferralCode() || undefined;
      const utm = readUtm(router.query as Record<string, unknown>);
      const orderData = guest
        ? await createMarketingGuestOrder({
            courseId: data.courseId,
            marketingSlug: data.slug,
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            mobile: values.mobile.trim(),
            referralCode,
            utm,
          })
        : await createOrder({
            type: "course",
            entityId: data.courseId,
            marketingSlug: data.slug,
            referralCode,
            utm,
          });
      const onPaid = guest ? async () => showGuestPaid() : () => goToSuccess(orderData.orderId);

      if (orderData.free && orderData.paid) {
        await onPaid();
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setSubmitError("Failed to load payment gateway. Please try again.");
        setPayBusy(false);
        return;
      }
      if (!orderData.key || !orderData.razorpayOrderId) {
        setSubmitError("Could not start payment. Please try again.");
        setPayBusy(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Studycafe",
        description: data.courseTitle || data.headline || "Course Purchase",
        order_id: orderData.razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await (guest ? verifyMarketingGuestOrder : verifyOrder)({
              orderId: orderData.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await onPaid();
          } catch (verifyErr: unknown) {
            setPayBusy(false);
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
        modal: { ondismiss: () => setPayBusy(false) },
      };

      const Rp = (typeof window !== "undefined"
        ? (window as unknown as { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay
        : undefined);
      if (!Rp) {
        setSubmitError("Payment gateway unavailable.");
        setPayBusy(false);
        return;
      }
      new Rp(options).open();
    } catch (e: unknown) {
      setPayBusy(false);
      throw e;
    }
  };

  /**
   * Checkout for a session that is now signed in. Learners who already hold the
   * course go to the "owned" stage — checked up front, and again via the 409 that
   * order-service raises inside its double-payment window (e.g. Buy clicked twice,
   * or again after the success page failed to load).
   */
  const checkoutAsSignedIn = async () => {
    if (await alreadyOwnsCourse()) {
      setStage("owned");
      return;
    }
    try {
      await startCheckout();
    } catch (e: unknown) {
      if (isAlreadyPurchasedError(e)) {
        setStage("owned");
        return;
      }
      if (isDuplicateInProgressError(e)) {
        throw new Error("Your previous attempt is still being processed. Please wait a few seconds and try again.");
      }
      throw e;
    }
  };

  const onSubmitDetails = handleSubmit(async (values) => {
    setSubmitError(null);

    // Already signed in — nothing to ask, go straight to payment.
    if (isAuthenticated) {
      try {
        await checkoutAsSignedIn();
      } catch (e: unknown) {
        setSubmitError(errorMessage(e, "Checkout failed. Please try again."));
      }
      return;
    }

    // Never throws: a failed lookup reads as "no account", and registerQuick's own 409
    // corrects that below.
    const account = await authService.lookupAccount(values.email.trim());
    resetAuthState();
    // Only a buyer who asked for an account is ever asked to sign in.
    if (account.exists && createAccount) {
      if (account.hasPassword) setStage("signin");
      else await beginCodeSignIn();
      return;
    }
    if (createAccount) {
      setStage("signup");
      return;
    }
    try {
      if (account.exists) await checkoutAsGuest();
      else await registerAndCheckout();
    } catch (err: unknown) {
      const message = await recoverFromSignupError(err, "Could not start checkout. Please try again.");
      if (message) setSubmitError(message);
    }
  });

  /**
   * Existing email, box unticked: straight to payment on that account, no sign-in.
   * `fallbackToSignup` handles a lookup that was wrong (no account after all); it is
   * off when we got here from registerQuick's own 409, so the two cannot ping-pong.
   */
  const checkoutAsGuest = async ({ fallbackToSignup = true }: { fallbackToSignup?: boolean } = {}) => {
    try {
      await startCheckout({ guest: true });
    } catch (e: unknown) {
      if (isGuestAlreadyPurchasedError(e)) {
        setStage("owned");
        return;
      }
      if (fallbackToSignup && isAccountNotFoundError(e)) {
        await registerAndCheckout();
        return;
      }
      if (isDuplicateInProgressError(e)) {
        throw new Error("Your previous attempt is still being processed. Please wait a few seconds and try again.");
      }
      throw e;
    }
  };

  /**
   * Store the buyer and open payment. With a password this is a real account; without
   * one (box left unticked) the buyer is stored with no password and signs in later
   * with an emailed code. Either way registerQuick returns a live session — no OTP
   * screen between the buyer and the payment. The server marks the email verified once
   * they pay, so the immediate verification-code email is skipped to avoid confusion.
   */
  const registerAndCheckout = async (accountPassword?: string) => {
    const values = getValues();
    const identity = {
      name: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.mobile.trim(),
      skipVerificationEmail: true,
    };
    const session = await authService.registerQuick(
      accountPassword
        ? { ...identity, password: accountPassword }
        : { ...identity, createAccount: false },
    );
    adoptSession(session.user);
    await startCheckout();
  };

  /**
   * Move a failed registerAndCheckout to the stage that lets the buyer finish. Returns
   * the message to show on the current stage, or null when the stage change says it all.
   */
  const recoverFromSignupError = async (err: unknown, fallback: string): Promise<string | null> => {
    if (isDuplicatePhoneError(err)) {
      // The EMAIL is new but the PHONE belongs to another account. Sending them to
      // sign-in would dead-end (there is no account for this email) — send them
      // back to the form with the real reason so they can change the number.
      resetAuthState();
      setStage("details");
      setSubmitError(errorMessage(err, "This phone number is already registered. Use a different number."));
      return null;
    }
    const api = err as ApiError;
    if (api?.statusCode === 409 && !createAccount) {
      // They do have an account after all, but never asked to use it — pay as a guest.
      resetAuthState();
      try {
        await checkoutAsGuest({ fallbackToSignup: false });
        return null;
      } catch (guestErr: unknown) {
        return errorMessage(guestErr, fallback);
      }
    }
    if (api?.statusCode === 409) {
      // They do have an account after all (e.g. registered on another device
      // between the lookup and now) — move them to sign-in rather than dead-end.
      resetAuthState();
      if (authService.isPasswordNotSetError(err)) {
        await beginCodeSignIn();
      } else {
        setStage("signin");
        setAuthError("You already have an account with this email. Sign in to finish.");
      }
      return null;
    }
    if (isDuplicateInProgressError(err)) {
      return "Your previous attempt is still being processed. Please wait a few seconds and try again.";
    }
    return errorMessage(err, fallback);
  };

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
      // A returning learner may already own the course — checkoutAsSignedIn
      // routes them to the dashboard instead of a second payment.
      await checkoutAsSignedIn();
    } catch (err: unknown) {
      if (authService.isPasswordNotSetError(err)) {
        // Bought before without creating an account — there is no password to type.
        setAccountHasPassword(false);
        setPassword("");
        await handleSendOtp("This account has no password yet, so we emailed you a 6-digit sign-in code instead.");
        return;
      }
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

  const handleSendOtp = async (sentInfo = "We emailed you a 6-digit sign-in code.") => {
    setAuthError(null);
    setOtpInfo(null);
    setAuthBusy(true);
    try {
      await authService.requestLoginOtp(getValues("email").trim());
      setOtpSent(true);
      setSigninMode("otp");
      setOtpInfo(sentInfo);
    } catch (err: unknown) {
      setAuthError(errorMessage(err, "Could not send the code. Try again shortly."));
    } finally {
      setAuthBusy(false);
    }
  };

  /**
   * Sign-in for an account with no password (bought before without creating one):
   * straight to an emailed code. A password box they never filled in would dead-end them.
   */
  const beginCodeSignIn = async () => {
    setAccountHasPassword(false);
    setSigninMode("otp");
    setStage("signin");
    await handleSendOtp();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setAuthBusy(true);
    try {
      await registerAndCheckout(password);
    } catch (err: unknown) {
      const message = await recoverFromSignupError(err, "Could not create your account. Try again.");
      if (message) setAuthError(message);
    } finally {
      setAuthBusy(false);
    }
  };

  if (!open) return null;

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";
  const primaryButtonClass =
    "rounded-lg bg-[#FF383C] px-6 py-3 text-lg font-semibold text-white hover:bg-red-700 disabled:opacity-50 w-full";

  const payLabel = `Pay ${fmt(grandTotal)}`;

  // No close-on-backdrop-click: a stray tap outside, or a text selection that ends
  // outside the box (copying an email or code), used to wipe the half-filled form.
  // Only the X / Close buttons close it.
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-8 text-gray-900"
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={payBusy}
          aria-label="Close checkout"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40"
        >
          <X size={22} />
        </button>

        {/* Order summary — same numbers the server charges */}
        <div className="mb-5 rounded-xl border border-gray-200 p-4 pr-10">
          <div className="text-sm font-semibold text-gray-900">
            {data.courseTitle || data.headline}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {mrp != null && mrp > sale && (
              <del className="text-base text-[#707070]">{fmt(mrp)}</del>
            )}
            <span className="text-2xl font-bold">{fmt(sale)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-dashed pt-2 text-sm text-gray-600">
            <span>Plus GST (18%)</span>
            <span>{fmt(gst)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-green-100 p-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
              <ShieldCheck size={18} />
              You pay
            </div>
            <div className="text-xl font-bold text-green-700">{fmt(grandTotal)}</div>
          </div>
        </div>

        {stage === "owned" && (
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <BadgeCheck className="text-green-600" size={30} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">You already have this course</h2>
            <p className="mt-2 text-sm text-gray-600">
              {user?.email ? (
                <>
                  <span className="font-semibold">{user.email}</span> already has access — no need to
                  pay again. Find it under My Courses.
                </>
              ) : getValues("email") ? (
                <>
                  <span className="font-semibold">{getValues("email")}</span> already has access — no
                  need to pay again. Sign in to open it from My Courses.
                </>
              ) : (
                "This account already has access — no need to pay again. Find it under My Courses."
              )}
            </p>
            <button
              type="button"
              onClick={() => void router.push("/dashboard")}
              className={`${primaryButtonClass} mt-5`}
            >
              Go to My Courses
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full text-sm text-gray-500 hover:underline"
            >
              Close
            </button>
          </div>
        )}

        {stage === "paid" && (
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <BadgeCheck className="text-green-600" size={30} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment successful</h2>
            <p className="mt-2 text-sm text-gray-600">
              {data.courseTitle || data.headline} has been added to your StudyCafe account for{" "}
              <span className="font-semibold">{getValues("email")}</span>. We&apos;ve emailed your
              receipt and access details — sign in with a one-time code sent to that email to start
              learning.
            </p>
            {campaignRedirectUrl ? (
              <>
                <a href={campaignRedirectUrl} className={`${primaryButtonClass} mt-5 block`}>
                  Continue
                </a>
                <p className="mt-3 text-sm text-gray-500">
                  Redirecting in <span className="font-semibold text-[#09339B]">{paidCountdown}</span>{" "}
                  seconds…
                </p>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void router.push("/login")}
                className={`${primaryButtonClass} mt-5`}
              >
                Sign in to start learning
              </button>
            )}
          </div>
        )}

        {stage === "details" && (
          <>
            <h2 className="mb-4 text-xl font-bold text-gray-900">Enter Your Details</h2>
            <form onSubmit={onSubmitDetails} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-[#FF383C]">*</span>
                </label>
                <input {...register("fullName")} placeholder="eg. Amit Kumar" className={inputClass} />
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
                      className="mt-1 marketing-checkout-phone"
                    />
                  )}
                />
                {errors.mobile && <p className="mt-1 text-xs text-[#FF383C]">{errors.mobile.message}</p>}
              </div>

              {!isAuthenticated && (
                <div className="space-y-3">
                  <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="mt-1 shrink-0"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                    />
                    <span>
                      <span className="font-medium text-gray-900">Create a StudyCafe account</span>{" "}
                      <span className="text-gray-500">(optional)</span>
                      {createAccount && (
                        <span className="mt-0.5 block text-xs text-gray-500">
                          You&apos;ll choose a password on the next step.
                        </span>
                      )}
                    </span>
                  </label>
                </div>
              )}

              {submitError && <p className="text-sm text-[#FF383C]">{submitError}</p>}

              <button type="submit" disabled={isSubmitting || payBusy} className={primaryButtonClass}>
                {isSubmitting || payBusy
                  ? "Processing…"
                  : !isAuthenticated && createAccount
                    ? "Continue"
                    : payLabel}
              </button>
            </form>
          </>
        )}

        {stage === "signin" && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
            <p className="mb-4 mt-1 text-sm text-gray-600">
              {accountHasPassword ? (
                <>
                  You already have an account for{" "}
                  <span className="font-semibold">{getValues("email")}</span>. Sign in and your payment
                  opens right away.
                </>
              ) : (
                <>
                  You&apos;ve bought with <span className="font-semibold">{getValues("email")}</span>{" "}
                  before. Enter the code we email you and your payment opens right away.
                </>
              )}
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
                    className={`${inputClass} text-center text-xl tracking-[0.35em]`}
                  />
                </div>
              )}

              {otpInfo && <p className="text-sm text-green-700">{otpInfo}</p>}
              {authError && <p className="text-sm text-[#FF383C]">{authError}</p>}

              <button type="submit" disabled={authBusy || payBusy} className={primaryButtonClass}>
                {authBusy || payBusy ? "Please wait…" : `Sign in & ${payLabel.toLowerCase()}`}
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                {/* A code-only account has no password to switch back to. */}
                {(accountHasPassword || !otpSent) && (
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
                )}
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
            <h2 className="text-xl font-bold text-gray-900">Create your account</h2>
            <p className="mb-4 mt-1 text-sm text-gray-600">
              Choose a password so you can sign in with it next time — then payment opens
              straight away. No OTP needed.
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

              {authError && <p className="text-sm text-[#FF383C]">{authError}</p>}

              <button type="submit" disabled={authBusy || payBusy} className={primaryButtonClass}>
                {authBusy || payBusy ? "Please wait…" : `Create account & ${payLabel.toLowerCase()}`}
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
          .marketing-checkout-phone {
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            padding: 10px 10px;
          }
          .marketing-checkout-phone input.PhoneInputInput {
            width: 100%;
            padding: 0;
            font-size: 0.875rem;
            color: #111827;
          }
        `}</style>
      </div>
    </div>
  );
}
