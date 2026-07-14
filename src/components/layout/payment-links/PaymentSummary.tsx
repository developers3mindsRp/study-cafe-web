"use client";

import { useEffect, useState } from "react";
import {
  Clock3,
  Users,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  IndianRupee,
} from "lucide-react";

interface PaymentSummaryProps {
  amount?: number;
  gstRate?: number;
  sold?: number;
  totalSeats?: number;
  expiryTime?: Date;
}

export default function PaymentSummary({
  amount = 1,
  gstRate = 18,
  sold = 0,
  totalSeats = 1,
  expiryTime = new Date(Date.now() + 15 * 60 * 1000),
}: PaymentSummaryProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const diff = expiryTime.getTime() - Date.now();
      setTimeLeft(Math.max(diff, 0));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const minutes = String(Math.floor(timeLeft / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((timeLeft % 60000) / 1000)).padStart(
    2,
    "0"
  );
  const ms = String(Math.floor((timeLeft % 1000) / 10)).padStart(2, "0");

  const gst = Number(((amount * gstRate) / 100).toFixed(2));
  const total = Number((amount + gst).toFixed(2));

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg border">

      {/* Header */}
      <div className="bg-[#eef5ff] py-8 px-6 text-center relative">

        <div className="w-20 h-20 rounded-full bg-white shadow mx-auto flex items-center justify-center">
          <Clock3 className="w-10 h-10 text-blue-600" />
        </div>

        <h2 className="text-4xl font-bold mt-4 text-gray-800">
          Hurry Up!
        </h2>

        <div className="flex justify-center items-center gap-2 mt-2 text-lg">
          <Users size={20} className="text-blue-700" />
          <span className="font-semibold text-blue-700">{sold}</span>
          <span className="text-gray-700">
            Sold out of {totalSeats}
          </span>
        </div>
      </div>

      <div className="p-6">

        {/* Timer */}
        <div className="border bg-[#fff8ea] rounded-lg p-4 flex justify-between items-center">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full bg-[#ffecc2] flex items-center justify-center">
              <Clock3 className="text-orange-500" />
            </div>

            <span className="font-medium text-gray-700">
              This Payment Link will Expire in
            </span>
          </div>

          <div className="flex items-center gap-3">

            <TimeBox value={minutes} label="MIN" />

            <span className="text-2xl font-bold">:</span>

            <TimeBox value={seconds} label="SEC" />

            <span className="text-2xl font-bold">:</span>

            <TimeBox value={ms} label="MS" />

          </div>
        </div>

        {/* Amount Card */}
        <div className="mt-6 border rounded-lg p-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <IndianRupee className="text-green-600" />
            </div>

            <h3 className="text-5xl font-bold">
              ₹ {amount.toFixed(2)}
            </h3>
          </div>

          <div className="border-t border-dashed my-6"></div>

          <div className="flex justify-between text-lg text-gray-600">
            <span>Plus GST ({gstRate}%):</span>
            <span>₹ {gst.toFixed(2)}</span>
          </div>

          <div className="mt-4 bg-green-100 rounded-lg p-4 flex justify-between items-center">

            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <ShieldCheck />
              You pay:
            </div>

            <div className="text-3xl font-bold text-green-700">
              ₹ {total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-3 gap-4 mt-8">

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