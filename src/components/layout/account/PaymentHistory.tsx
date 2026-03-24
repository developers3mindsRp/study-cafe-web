"use client";

import { useState } from "react";
import { useUserPurchases } from "@/hooks/usePurchases";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(val?: string | number | null) {
  if (val == null) return "—";
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return String(val);
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function PaymentHistory() {
  const [query, setQuery] = useState("");
  const { data: purchases, isLoading, isError, error } = useUserPurchases();

  const data = (purchases ?? []).map((p) => ({
    date: formatDate(p.purchaseDate),
    orderID: p.transactionId ?? p.id ?? "—",
    item: p.course?.title ?? "Purchase",
    amount: formatAmount(p.price),
    gst: "₹0.00",
    method: p.paymentMethod ?? "—",
    status: p.status === "completed" ? "Paid" : p.status ?? "—",
    rawStatus: p.status,
  }));

  const filtered = data.filter((row) =>
    row.orderID.toLowerCase().includes(query.toLowerCase()) ||
    row.item.toLowerCase().includes(query.toLowerCase())
  );

  const hasRows = filtered.length > 0;
  const emptyNoPurchases = !isLoading && !isError && data.length === 0;
  const emptySearch = !isLoading && !isError && data.length > 0 && filtered.length === 0;

  return (
    <section className="p-6 max-w-5xl mx-auto border bg-white rounded-lg shadow-sm  border-[#9FBBFF]">
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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
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
            className="border border-gray-300 rounded-lg px-10 py-2 text-[16px] w-[200px] placeholder-black"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            </div>
            </div>


      {isLoading && (
        <div className="text-center py-8 text-gray-400">Loading payment history…</div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-600 text-sm">
          {error instanceof Error ? error.message : "Could not load payment history. Please try again."}
        </div>
      )}

      {emptyNoPurchases && (
        <div className="text-center py-12 text-gray-400">
          No payment history yet. Purchases will appear here after you complete a transaction.
        </div>
      )}

      {emptySearch && (
        <div className="text-center py-8 text-gray-400">
          No orders match your search. Try a different order ID or item name.
        </div>
      )}

      {/* Table — only when we have rows to show (avoids duplicate empty messages) */}
      {hasRows && (
      <div className="hidden md:block overflow-x-auto ">
        <table className="w-full bg-white rounded-lg shadow-sm divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50  text-[16px] ">
            <tr>
              <th className="px-4 py-3 text-left font-normal ">Date</th>
              <th className="px-4 py-3 text-left font-normal whitespace-nowrap">Order ID</th>
              <th className="px-4 py-3 text-left font-normal">Item Name</th>
              <th className="px-3 py-3 text-left font-normal">Amount</th>
              <th className="px-4 py-3 text-left font-normal">GST</th>
              <th className="px-4 py-3 text-left font-normal">Method</th>
              <th className="px-4 py-3 text-left font-normal">Status</th>
              <th className="px-4 py-3 text-center font-normal">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 text-[12px] text-[#929292] border-b ">
                <td className="px-4 py-3 whitespace-nowrap">{row.date}</td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{row.orderID}</td>
                <td className="px-4 py-3 whitespace-nowrap">{row.item}</td>
                <td className="px-4 py-3">{row.amount}</td>
                <td className="px-4 py-3">{row.gst}</td>
                <td className="px-4 py-3">{row.method}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-2 rounded-[10px] text-xs font-medium text-white ${row.rawStatus === "completed" ? "bg-[#34C759]" : row.rawStatus === "failed" || row.rawStatus === "refunded" ? "bg-red-500" : "bg-yellow-500"}`}>
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
      </div>
      )}

      {/* Mobile View */}
  {hasRows && (
  <div className="md:hidden space-y-4">
  {filtered.map((row, i) => (
    <div
      key={i}
      className="border rounded-xl p-4 bg-white shadow-sm text-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium">{row.item}</p>
        <span className={`px-3 py-1 rounded-full text-xs text-white ${row.rawStatus === "completed" ? "bg-[#34C759]" : row.rawStatus === "failed" || row.rawStatus === "refunded" ? "bg-red-500" : "bg-yellow-500"}`}>
          {row.status}
        </span>
      </div>

      <p className="text-gray-500 text-xs mb-3">{row.date}</p>

      <div className="grid grid-cols-2 gap-3 text-xs text-[#929292]">
        <div>
          <p className="text-gray-400">Order ID</p>
          <p className="font-medium">{row.orderID}</p>
        </div>
        <div>
          <p className="text-gray-400">Amount</p>
          <p>{row.amount}</p>
        </div>
        <div>
          <p className="text-gray-400">GST</p>
          <p>{row.gst}</p>
        </div>
        <div>
          <p className="text-gray-400">Method</p>
          <p>{row.method}</p>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
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
      </div>
    </div>
  ))}
</div>
  )}

    </section>
  );
}
