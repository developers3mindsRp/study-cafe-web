"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getOrderInvoice, type OrderInvoice } from "@/services/order.service";
import PostPurchaseLinks from "./PostPurchaseLinks";
import { getMarketingPageBySlug } from "@/services/platform.service";
import { clearAuthData, getToken, isGuestSession } from "@/utils/auth.utils";

/** Matches the cap the admin form and course-service enforce on the same field. */
const POST_PURCHASE_DELAY_MAX_SECONDS = 600;

/** Campaign redirect config, read from the published page so the URL never comes off the query string. */
interface CampaignRedirect {
  url: string;
  delaySeconds: number | null;
}

function trimmedQuery(raw: string | string[] | undefined): string | undefined {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return undefined;
}

const PaymentSuccess = () => {
  const router = useRouter();
  const orderId = trimmedQuery(router.query.order_id);
  const fromPaymentLink =
    router.query.payment_link === "1" || router.query.payment_link === "true";
  /**
   * The link granted a course or plan, so the buyer already has access — send them
   * to it instead of dropping them on the homepage to work out what happens next.
   */
  const enrolledByLink =
    fromPaymentLink && (router.query.enrolled === "1" || router.query.enrolled === "true");

  /**
   * Set when the buyer paid through a marketing landing page (`?m=<slug>`). That page can
   * name its own thank-you destination, which wins over the course's — the same course sold
   * through a campaign often has to send buyers somewhere else.
   */
  const marketingSlug = trimmedQuery(router.query.m);

  const [invoice, setInvoice] = useState<OrderInvoice | null>(null);
  const [campaignRedirect, setCampaignRedirect] = useState<CampaignRedirect | null>(null);
  /** False until the campaign lookup settles, so the countdown cannot fire at the wrong target. */
  const [campaignChecked, setCampaignChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!router.isReady) return;

    if (!orderId) {
      setLoading(false);
      return;
    }

    /** Payment-link checkouts are often guest (`user_id` null); invoice requires login + ownership → skip fetch */
    if (fromPaymentLink) {
      setLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setLoading(false);
      setInvoice(null);
      return;
    }

    setLoading(true);
    getOrderInvoice(orderId)
      .then(setInvoice)
      .catch(() => setInvoice(null))
      .finally(() => setLoading(false));
  }, [router.isReady, orderId, fromPaymentLink]);

  /**
   * The landing page's own thank-you destination. Only the slug arrives in the URL, so the
   * destination is read back from the published page — a hand-edited link cannot retarget it.
   */
  useEffect(() => {
    if (!router.isReady || !marketingSlug) return;
    let cancelled = false;
    void getMarketingPageBySlug(marketingSlug)
      .then((payload) => {
        if (cancelled || !payload) return;
        const meta = payload.page?.meta ?? {};
        const url = String(meta.post_purchase_redirect_url ?? "").trim();
        // Followed with a full page load, so only an absolute http(s) URL is usable.
        if (!/^https?:\/\//i.test(url)) return;
        const delay = Number.parseInt(String(meta.post_purchase_redirect_delay ?? "").trim(), 10);
        setCampaignRedirect({
          url,
          delaySeconds:
            Number.isFinite(delay) && delay >= 0
              ? Math.min(delay, POST_PURCHASE_DELAY_MAX_SECONDS)
              : null,
        });
      })
      .finally(() => {
        if (!cancelled) setCampaignChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [router.isReady, marketingSlug]);

  /** Payment-link success: redirect home instead of payment-detail (guests cannot open invoice there). */
  useEffect(() => {
    if (!router.isReady || !fromPaymentLink || !orderId) return;
    if (countdown <= 0) {
      router.push(enrolledByLink ? "/dashboard" : "/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [router.isReady, fromPaymentLink, orderId, countdown, router, enrolledByLink]);

  /**
   * A paid course can carry its own thank-you page config: join buttons, and a destination
   * that replaces the default payment-detail redirect.
   */
  const isPaid = invoice?.status === "paid";
  const postPurchase = isPaid ? invoice?.postPurchase ?? null : null;
  const postPurchaseLinks = postPurchase?.links ?? [];
  /** A campaign that names its own destination overrides the course's; join links still apply. */
  const campaign = isPaid ? campaignRedirect : null;
  const customRedirectUrl = campaign?.url ?? postPurchase?.redirectUrl ?? null;
  const customRedirectDelay = campaign
    ? campaign.delaySeconds ?? undefined
    : postPurchase?.redirectDelaySeconds;
  /**
   * Join links are the whole point of the page when they exist, so a course that offers them
   * without naming its own destination keeps the buyer here instead of timing out to the receipt.
   */
  const autoRedirectDisabled = postPurchaseLinks.length > 0 && !customRedirectUrl;

  /** Adopt the course's countdown once the invoice lands; otherwise the default 10s stands. */
  useEffect(() => {
    if (!customRedirectUrl || typeof customRedirectDelay !== "number") return;
    setCountdown(customRedirectDelay);
  }, [customRedirectUrl, customRedirectDelay]);

  useEffect(() => {
    if (fromPaymentLink) return;
    if (loading || !invoice) return;
    // Hold the countdown until the campaign's own destination is known.
    if (marketingSlug && !campaignChecked) return;
    if (autoRedirectDisabled) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (customRedirectUrl) {
      // A buyer who skipped creating an account was signed in only to pay and land here.
      // Sending them off-site (e.g. the WhatsApp group) ends that, so reopening StudyCafe
      // later does not find them signed in.
      if (isGuestSession()) clearAuthData();
      /** Replace, not push — Back should not drop the buyer onto a countdown that fires again. */
      window.location.replace(customRedirectUrl);
      return;
    }
    router.push(`/payment-detail?order_id=${invoice.orderId}`);
  }, [
    countdown,
    loading,
    invoice,
    router,
    fromPaymentLink,
    customRedirectUrl,
    autoRedirectDisabled,
    marketingSlug,
    campaignChecked,
  ]);

  useEffect(() => {
    if (!invoice || invoice.status !== "paid") return;

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: invoice.paymentId,
        value: Number(invoice.amount),
        currency: invoice.currency || "INR",
        order_id: invoice.orderId,
      },
    });

    console.log("Purchase Event Fired");
  }, [invoice]);

  if (!router.isReady) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-10 md:py-16 text-center">
        <div className="animate-pulse text-lg text-gray-500">Loading payment details…</div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-10 md:py-16">
        <div className="border shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] py-8 md:py-12 rounded-[10px] text-center px-4">
          <h1 className="text-2xl md:text-[32px] font-semibold mt-4">Missing order reference</h1>
          <p className="text-sm md:text-[16px] text-[#929292] mt-2 max-w-md mx-auto">
            Open this page from the payment confirmation link, or sign in and open your purchase history.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/login?next=${encodeURIComponent("/dashboard")}`}
              className="inline-block bg-[#09339B] text-white px-8 py-3 rounded-[10px] transition hover:bg-[#072a80]"
            >
              Log in
            </Link>
            <Link
              href="/"
              className="inline-block border border-[#09339B] text-[#09339B] px-8 py-3 rounded-[10px] transition hover:bg-[#09339B]/5"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /** Paid payment link — receipt lives outside “My purchases”; do not call invoice API */
  if (fromPaymentLink) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-10 md:py-16">
        <div className="border shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] py-8 md:py-12 rounded-[10px]">
          <div className="text-center px-4">
            <img src="/images/success.png" alt="" className="mx-auto w-20 md:w-auto" />
            <h1 className="text-2xl md:text-[40px] font-semibold mt-4">
              {enrolledByLink ? "You're in!" : "Payment successful!"}
            </h1>
            <p className="text-sm md:text-[16px] text-[#929292] mt-2">
              {enrolledByLink
                ? "Payment received and your access is already active — start whenever you're ready."
                : "Thank you. Save your order ID for your records."}
            </p>
          </div>

          <div className="p-4 md:p-6 bg-[#F9F9FB] w-full md:max-w-[650px] mx-auto space-y-4 mt-8 md:mt-12 rounded-lg">
            <div className="flex justify-between flex-wrap gap-2">
              <h2 className="text-[#AFAFAF] text-sm md:text-base">Order ID</h2>
              <p className="text-sm md:text-base font-medium break-all">{orderId}</p>
            </div>
            <div className="flex justify-between flex-wrap gap-2">
              <h2 className="text-[#AFAFAF] text-sm md:text-base">Item</h2>
              <p className="text-sm md:text-base text-right md:text-left max-w-[65%] md:max-w-none">
                Payment link purchase
              </p>
            </div>
          </div>

          <div className="mt-8 md:mt-10 text-center px-4 space-y-4">
            <p className="text-[#929292] text-sm md:text-[18px] leading-relaxed">
              Redirecting to {enrolledByLink ? "your dashboard" : "home"} in{" "}
              <span className="text-[#09339B] font-semibold">{countdown}</span> seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              {enrolledByLink ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-block bg-[#09339B] hover:bg-white px-8 md:px-12 py-3 text-white hover:text-[#09339B] border border-[#09339B] rounded-[10px] transition"
                  >
                    Start learning
                  </Link>
                  <Link
                    href="/"
                    className="inline-block border border-[#09339B] text-[#09339B] px-8 md:px-12 py-3 rounded-[10px] hover:bg-[#09339B]/5 transition"
                  >
                    Go to home
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="inline-block bg-[#09339B] hover:bg-white px-8 md:px-12 py-3 text-white hover:text-[#09339B] border border-[#09339B] rounded-[10px] transition"
                  >
                    Go to home
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-block border border-[#09339B] text-[#09339B] px-8 md:px-12 py-3 rounded-[10px] hover:bg-[#09339B]/5 transition"
                  >
                    Browse courses
                  </Link>
                  <Link
                    href={`/login?next=${encodeURIComponent("/dashboard")}`}
                    className="inline-block border border-gray-300 text-gray-800 px-8 md:px-12 py-3 rounded-[10px] hover:bg-gray-50 transition"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-10 md:py-16 text-center">
        <div className="animate-pulse text-lg text-gray-500">Loading payment details…</div>
      </div>
    );
  }

  if (!invoice) {
    const nextAfterLogin =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "/payment-success";
    return (
      <div className="container max-w-3xl mx-auto px-4 py-10 md:py-16">
        <div className="border shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] py-8 md:py-12 rounded-[10px] text-center px-4">
          <h1 className="text-2xl md:text-[32px] font-semibold mt-4">We couldn&apos;t load this order</h1>
          <p className="text-sm md:text-[16px] text-[#929292] mt-2 max-w-lg mx-auto">
            If you completed payment while signed out, sign in with the account you use on Studycafe — your receipt may
            appear under purchase history. You can also continue with the order ID below if you saved it.
          </p>
          <p className="text-sm font-medium text-gray-800 mt-4 break-all">Order ID: {orderId}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Link
              href={`/login?next=${encodeURIComponent(nextAfterLogin)}`}
              className="inline-block bg-[#09339B] text-white px-8 py-3 rounded-[10px] transition hover:bg-[#072a80]"
            >
              Log in
            </Link>
            <Link
              href="/courses"
              className="inline-block border border-[#09339B] text-[#09339B] px-8 py-3 rounded-[10px] hover:bg-[#09339B]/5 transition"
            >
              Browse courses
            </Link>
            <Link href="/" className="inline-block text-[#09339B] underline-offset-2 hover:underline px-4 py-3">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amount = Number(invoice.amount) || 0;
  const formattedAmount = amount.toLocaleString("en-IN", {
    style: "currency",
    currency: invoice.currency || "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const itemLabel =
    invoice.type === "membership" ? "Membership Plan" : invoice.type === "payment_link" ? "Payment link" : "Course";
  const itemName = invoice.itemName || itemLabel;

  const isFailed = invoice && invoice.status !== "paid";
  return (
    <div className="container max-w-3xl mx-auto px-4 py-10 md:py-16">
      <div className="border shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] py-8 md:py-12 rounded-[10px]">
        {/* Top Section */}
        <div className="text-center">
          {isFailed ? (
            <div className="mx-auto w-20 md:w-24 h-20 md:h-24 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <img src="/images/success.png" alt="" className="mx-auto w-20 md:w-auto" />
          )}

          <h1 className="text-2xl md:text-[40px] font-semibold mt-4">
            {isFailed ? "Payment Failed" : "Payment Successful!"}
          </h1>

          <p className="text-sm md:text-[16px] text-[#929292] mt-2">
            {isFailed ? "Your payment could not be processed" : "Your payment has been processed successfully"}
          </p>
        </div>

        {/* Course-configured join buttons (WhatsApp group, Zoom meeting, …) */}
        <PostPurchaseLinks links={postPurchaseLinks} />

        {/* Transaction Details */}
        <div className="p-4 md:p-6 bg-[#F9F9FB] w-full md:max-w-[650px] mx-auto space-y-4 mt-8 md:mt-12 rounded-lg">
          {invoice.paymentId && (
            <div className="flex justify-between flex-wrap gap-2">
              <h1 className="text-[#AFAFAF] text-sm md:text-base">Transaction ID</h1>
              <p className="text-sm md:text-base break-all">{invoice.paymentId}</p>
            </div>
          )}

          <div className="flex justify-between flex-wrap gap-2">
            <h1 className="text-[#AFAFAF] text-sm md:text-base">Order ID</h1>
            <p className="text-sm md:text-base break-all">{invoice.orderId}</p>
          </div>

          <div className="flex justify-between flex-wrap gap-2">
            <h1 className="text-[#AFAFAF] text-sm md:text-base">{itemLabel}</h1>
            <p className="text-sm md:text-base text-right md:text-left max-w-[65%] md:max-w-none">{itemName}</p>
          </div>

          <div className="border-t border-[#E0E0E0]"></div>

          <div className="flex justify-between flex-wrap gap-2">
            <h1 className="text-[#AFAFAF] text-sm md:text-base">Amount {isFailed ? "" : "Paid"}</h1>
            <p className="text-sm md:text-base font-semibold">{formattedAmount}</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 md:mt-10 text-center px-4">
          {isFailed ? (
            <>
              <p className="text-[#929292] text-sm md:text-[18px] leading-relaxed">
                Something went wrong with your payment. Please try again or contact support.
              </p>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto mt-6 bg-[#09339B] hover:bg-white px-8 md:px-16 py-3 text-white hover:text-[#09339B] border border-[#09339B] rounded-[10px] transition"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              {autoRedirectDisabled ? (
                <p className="text-[#929292] text-sm md:text-[18px] leading-relaxed">
                  Use the link above to get started — your receipt stays available any time.
                </p>
              ) : (
                <p className="text-[#929292] text-sm md:text-[18px] leading-relaxed">
                  You&apos;ll be redirected automatically in{" "}
                  <span className="text-[#09339B] font-semibold">{countdown} seconds.</span>
                  <br />
                  Please keep this screen open.
                </p>
              )}

              <Link
                href={`/payment-detail?order_id=${invoice.orderId}`}
                className="inline-block w-full sm:w-auto mt-6 bg-[#09339B] hover:bg-white px-8 md:px-16 py-3 text-white hover:text-[#09339B] border border-[#09339B] rounded-[10px] transition"
              >
                View Payment Details
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
