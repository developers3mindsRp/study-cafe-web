"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getOrderInvoice, type OrderInvoice } from "@/services/order.service";

const PaymentSuccess = () => {
  const router = useRouter();
  const orderId = router.query.orderId as string | undefined;

  const [invoice, setInvoice] = useState<OrderInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    getOrderInvoice(orderId)
      .then(setInvoice)
      .catch(() => setInvoice(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (loading || !invoice) return;
    if (countdown <= 0) {
      router.push(`/payment-detail?orderId=${invoice.orderId}`);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, loading, invoice, router]);

  const isFailed = invoice && invoice.status !== "paid";

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-10 md:py-16 text-center">
        <div className="animate-pulse text-lg text-gray-500">
          Loading payment details…
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-10 md:py-16">
        <div className="border shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] py-8 md:py-12 rounded-[10px] text-center">
          <h1 className="text-2xl md:text-[32px] font-semibold mt-4">
            Order Not Found
          </h1>
          <p className="text-sm md:text-[16px] text-[#929292] mt-2">
            We couldn&apos;t find the order. Please check your purchase history.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-6 bg-[#09339B] text-white px-8 py-3 rounded-[10px] transition hover:bg-[#072a80]"
          >
            Go to Dashboard
          </Link>
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
    invoice.type === "membership" ? "Membership Plan" : "Course";
  const itemName = invoice.itemName || itemLabel;

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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : (
            <img
              src="/images/success.png"
              alt=""
              className="mx-auto w-20 md:w-auto"
            />
          )}

          <h1 className="text-2xl md:text-[40px] font-semibold mt-4">
            {isFailed ? "Payment Failed" : "Payment Successful!"}
          </h1>

          <p className="text-sm md:text-[16px] text-[#929292] mt-2">
            {isFailed
              ? "Your payment could not be processed"
              : "Your payment has been processed successfully"}
          </p>
        </div>

        {/* Transaction Details */}
        <div className="p-4 md:p-6 bg-[#F9F9FB] w-full md:max-w-[650px] mx-auto space-y-4 mt-8 md:mt-12 rounded-lg">
          {invoice.paymentId && (
            <div className="flex justify-between flex-wrap gap-2">
              <h1 className="text-[#AFAFAF] text-sm md:text-base">
                Transaction ID
              </h1>
              <p className="text-sm md:text-base break-all">
                {invoice.paymentId}
              </p>
            </div>
          )}

          <div className="flex justify-between flex-wrap gap-2">
            <h1 className="text-[#AFAFAF] text-sm md:text-base">Order ID</h1>
            <p className="text-sm md:text-base break-all">{invoice.orderId}</p>
          </div>

          <div className="flex justify-between flex-wrap gap-2">
            <h1 className="text-[#AFAFAF] text-sm md:text-base">{itemLabel}</h1>
            <p className="text-sm md:text-base text-right md:text-left max-w-[65%] md:max-w-none">
              {itemName}
            </p>
          </div>

          <div className="border-t border-[#E0E0E0]"></div>

          <div className="flex justify-between flex-wrap gap-2">
            <h1 className="text-[#AFAFAF] text-sm md:text-base">
              Amount {isFailed ? "" : "Paid"}
            </h1>
            <p className="text-sm md:text-base font-semibold">
              {formattedAmount}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 md:mt-10 text-center px-4">
          {isFailed ? (
            <>
              <p className="text-[#929292] text-sm md:text-[18px] leading-relaxed">
                Something went wrong with your payment. Please try again or
                contact support.
              </p>
              <button
                onClick={() => router.back()}
                className="w-full sm:w-auto mt-6 bg-[#09339B] hover:bg-white px-8 md:px-16 py-3 text-white hover:text-[#09339B] border border-[#09339B] rounded-[10px] transition"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <p className="text-[#929292] text-sm md:text-[18px] leading-relaxed">
                You&apos;ll be redirected automatically in{" "}
                <span className="text-[#09339B] font-semibold">
                  {countdown} seconds.
                </span>
                <br />
                Please keep this screen open.
              </p>

              <Link
                href={`/payment-detail?orderId=${invoice.orderId}`}
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
