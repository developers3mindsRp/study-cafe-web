"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getOrderInvoice, type OrderInvoice } from "@/services/order.service";

export default function PaymentDetail() {
  const router = useRouter();
  const orderId = router.query.order_id as string | undefined;

  const [invoice, setInvoice] = useState<OrderInvoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    getOrderInvoice(orderId)
      .then(setInvoice)
      .catch(() => setInvoice(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-6 text-center">
        <div className="animate-pulse text-lg text-gray-500">
          Loading order details…
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-6 py-6 text-center">
        <h1 className="text-2xl font-semibold">Order Not Found</h1>
        <p className="text-[#929292] mt-2">
          We couldn&apos;t find this order. Please check your purchase history.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-6 bg-[#09339B] text-white px-8 py-3 rounded-[10px] transition hover:bg-[#072a80]"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const isPaid = invoice.status === "paid";
  const amount = Number(invoice.amount) || 0;
  const formattedAmount = amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const paidDate = invoice.paidAt
    ? new Date(invoice.paidAt).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";
  const itemName = invoice.itemName || (invoice.type === "membership" ? "Membership Plan" : "Course");
  const itemCategory = invoice.itemCategory || (invoice.type === "membership" ? "Membership" : "Course");

  return (
    <div className="container mx-auto px-6 py-6">
      {/* Back */}
      <Link
        href="/dashboard"
        className="text-[16px] text-[#09339B] mb-3 cursor-pointer inline-block"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="md:text-[40px] font-semibold">Payment Details</h1>
          <p className="text-[#252525] mt-1 text-[14px] md:text-[24px]">
            Order ID: {invoice.orderId}
          </p>
        </div>
      </div>

      {/* Status Card */}
      <div className="mt-6 bg-white border border-[#9FBBFF] rounded-lg p-4">
        <div className="flex flex-col justify-between text-sm m-4">
          <div className="flex items-center gap-3">
            {isPaid ? (
              <img
                src="/images/success.svg"
                alt="Success"
                className="w-8 h-8 relative top-2"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center relative top-2">
                <svg
                  className="w-5 h-5 text-red-500"
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
            )}
            <span className="font-bold text-[20px]">
              {isPaid ? "Payment Successful" : "Payment Failed"}
            </span>
          </div>
          <span className="ml-10">{paidDate}</span>
        </div>

        <div className="border-b border-[#AFAFAF] md:m-6"></div>

        <div className="md:flex justify-between text-sm m-4">
          <div className="flex md:flex-col mb-2">
            <div className="flex items-center gap-2">
              <img
                src="/images/id.svg"
                alt="Order ID"
                className="w-5 h-5 brightness-[0.1]"
              />
              <span className="text-[#000] md:text-[20px]">Order ID</span>
            </div>
            <span className="text-black md:text-[16px] font-bold ml-2 md:ml-7 md:mt-2">
              {invoice.orderId}
            </span>
          </div>

          {invoice.paymentId && (
            <div className="flex md:flex-col mb-2">
              <div className="flex items-center gap-2">
                <img
                  src="/images/file-1.svg"
                  alt="Transaction ID"
                  className="w-5 h-5 brightness-[0.1]"
                />
                <span className="text-[#000] md:text-[20px]">
                  Transaction ID
                </span>
              </div>
              <span className="text-black md:text-[16px] font-bold ml-2 md:ml-7 md:mt-2 break-all">
                {invoice.paymentId}
              </span>
            </div>
          )}

          <div className="flex md:flex-col">
            <div className="flex items-center gap-2">
              <img
                src="/images/cc.svg"
                alt="Payment Method"
                className="w-5 h-5  brightness-[0.1]"
              />
              <span className="text-[#000] md:text-[20px]">
                Payment Method
              </span>
            </div>
            <span className="text-black md:text-[16px] mb-1 font-bold ml-2 md:ml-7 md:mt-2">
              {invoice.paymentMethod === "Free" ? "Free" : "Razorpay"}
            </span>
          </div>
        </div>
      </div>

      {/* Item Details */}
      <div className="lg:col-span-2 bg-white border border-[#9FBBFF] rounded-xl p-4 mt-12">
        <div className="flex flex-col justify-between text-sm mb-4">
          <span className="font-bold text-[20px] mb-1 m-4">Item Details</span>
        </div>
        <div className="border-b border-[#AFAFAF]"></div>

        <div className="text-sm mt-4">
          <div className="flex justify-between m-4">
            <span className="text-[#000] text-[20px] mb-2">Item</span>
            <span className="text-black text-[18px] md:text-[20px] mb-2 text-right max-w-[65%]">
              {itemName}
            </span>
          </div>
          <div className="flex justify-between m-4">
            <span className="text-[#000] text-[16px] mb-1">Category</span>
            <span className="text-[#000] text-[16px] mb-1">
              {itemCategory}
            </span>
          </div>

          <div className="border-b border-[#AFAFAF]"></div>

          <div className="flex justify-between m-4">
            <span className="text-[#000] text-[16px] mb-1">Subtotal</span>
            <span className="text-[#000] text-[16px] mb-1">
              ₹{formattedAmount}
            </span>
          </div>
          <div className="border-b border-[#AFAFAF]"></div>
          <div className="flex justify-between m-4">
            <span className="text-black font-semibold text-[16px] mb-1">
              Total Amount
            </span>
            <span className="text-black font-semibold text-[16px] mb-1">
              ₹{formattedAmount}
            </span>
          </div>
        </div>
      </div>

      {/* Retry for failed */}
      {!isPaid && (
        <div className="mt-8 text-center">
          <p className="text-[#929292] text-sm md:text-base mb-4">
            Your payment was not completed. Please try again.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-[#09339B] text-white px-8 py-3 rounded-[10px] transition hover:bg-[#072a80]"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
