"use client";

import { useState } from "react";

export default function PaymentHistory() {
  const [query, setQuery] = useState("");

  const data = [
    {
      date: "12 Mar 2025",
      orderID: "ORD-72619",
      item: "Premium Membership",
      amount: "₹7,999",
      gst: "₹0.00",
      method: "Razorpay",
      status: "Paid",
    },
    {
      date: "12 Mar 2025",
      orderID: "ORD-72619",
      item: "Premium Membership",
      amount: "₹7,999",
      gst: "₹0.00",
      method: "Razorpay",
      status: "Paid",
    },
    {
      date: "12 Mar 2025",
      orderID: "ORD-72619",
      item: "Premium Membership",
      amount: "₹7,999",
      gst: "₹0.00",
      method: "Razorpay",
      status: "Paid",
    },
  ];

  const filtered = data.filter((row) =>
    row.orderID.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-[26px] ">Payment History</h2>
          <p className="text-[#AFAFAF] text-[16px]">
            View all your transactions and download invoices
          </p>
        </div>
        
            <div className="relative mt-4 sm:mt-0">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
                type="text"
                placeholder="Search Orders…"
                className="border border-gray-300 rounded-lg px-10 py-2 text-sm w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            </div>
            </div>


      {/* Table */}
      <div className="overflow-x-auto ">
        <table className="w-full bg-white rounded-lg shadow-sm divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50  text-[16px]">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Item Name</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">GST</th>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 text-[12px] text-[#929292] border-b ">
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3 font-medium">{row.orderID}</td>
                <td className="px-4 py-3">{row.item}</td>
                <td className="px-4 py-3">{row.amount}</td>
                <td className="px-4 py-3">{row.gst}</td>
                <td className="px-4 py-3">{row.method}</td>
                <td className="px-4 py-3">
                  <span className="bg-[#34C759] text-white px-3 py-3 rounded-[10px] text-xs font-medium ">
                    {row.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center space-x-2">
                  <button className="text-lg hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1.5 6C1.5 6 4.85786 2.25 9 2.25C13.1421 2.25 16.5 6 16.5 6" stroke="#454545" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M16.158 9.78375C16.386 10.1035 16.5 10.2634 16.5 10.5C16.5 10.7366 16.386 10.8965 16.158 11.2162C15.1334 12.6529 12.5169 15.75 9 15.75C5.48309 15.75 2.86657 12.6529 1.84203 11.2162C1.61401 10.8965 1.5 10.7366 1.5 10.5C1.5 10.2634 1.61401 10.1035 1.84203 9.78375C2.86657 8.34705 5.48309 5.25 9 5.25C12.5169 5.25 15.1334 8.34705 16.158 9.78375Z" stroke="#454545" stroke-width="1.5"/>
                    <path d="M11.25 10.5C11.25 9.25732 10.2427 8.25 9 8.25C7.75732 8.25 6.75 9.25732 6.75 10.5C6.75 11.7427 7.75732 12.75 9 12.75C10.2427 12.75 11.25 11.7427 11.25 10.5Z" stroke="#454545" stroke-width="1.5"/>
                    </svg>
                  </button>
                  <button className="text-lg hover:text-green-600 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                 <path d="M2.24976 12.75C2.24976 13.4475 2.24976 13.7962 2.32643 14.0824C2.53448 14.8588 3.14096 15.4653 3.91742 15.6734C4.20354 15.75 4.55228 15.75 5.24976 15.75H12.7498C13.4473 15.75 13.796 15.75 14.0821 15.6734C14.8585 15.4653 15.4651 14.8588 15.6731 14.0824C15.7498 13.7962 15.7498 13.4475 15.7498 12.75" stroke="#454545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.3748 8.62503C12.3748 8.62503 9.88914 12 8.99971 12C8.11036 12 5.62476 8.62503 5.62476 8.62503M8.99971 11.25V2.25" stroke="#454545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-4">
            No orders found.
          </p>
        )}
      </div>
    </section>
  );
}
