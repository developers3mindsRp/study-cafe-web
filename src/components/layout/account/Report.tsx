import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getMyCommissionOrders,
  type AffiliateHistoryItem,
} from "@/services/order.service";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Commission() {
  const router = useRouter();
  const [orders, setOrders] = useState<AffiliateHistoryItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyCommissionOrders(fromDate || undefined, toDate || undefined);
      setOrders(data);
      setSearched(true);
    } catch (err) {
      console.error("Failed to fetch commission orders:", err);
      setOrders([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  return (
    <section className="md:p-6 max-w-6xl mx-auto bg-white px-6">
      <div className="text-[16px] text-[#09339B] mb-3 cursor-pointer" onClick={() => router.back()}>
         ← Back to Affiliate Dashboard
      </div>
      <h2 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-1">
       Commission Orders
      </h2>
      <p className="text-[#252525] text-[16px] md:text-[26px] mb-6">
        Search your affiliate commission orders by date or month.
      </p>
      <div className="border border-[#B4C6FF] rounded-xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-6 md:items-end">
          <div className="flex-1 min-w-0">
            <label className="text-[16px]">
              From <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ WebkitAppearance: 'none' }}
                className="w-full min-w-0 h-[48px] px-4 border border-gray-300 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#09339B]"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <label className="text-[16px]">
              To <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full min-w-0 h-[48px] appearance-none pl-4 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09339B]"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#09339B] text-white px-6 py-2 rounded-xl hover:bg-[#0F2E75] transition text-[16px] w-full md:w-auto disabled:opacity-60"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      <div className="py-4">
        {searched && (
          <div className="flex flex-col md:flex-row mt-4 px-2">
            <h2 className="font-regular text-[20px] mb-2">
              {orders.length} Order{orders.length !== 1 ? "s" : ""} Found
            </h2>
          </div>
        )}

        {!searched && !loading && (
          <p className="text-center text-gray-400 py-8">
            Select a date range and click Search to view commission orders.
          </p>
        )}

        {searched && orders.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            No commission orders found for the selected period.
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-1 gap-3 mt-4 border hover:border-[#9FBBFF] shadow-md rounded-lg p-4 px-4 md:px-6 md:mx-2"
          >
            <div className="flex justify-between md:text-[20px]">
              <p className="font-bold">Order - {order.order_id}</p>
              <p>{formatDate(order.created_at)}</p>
            </div>

            <p className="font-regular">{order.buyer_name}</p>
            <ul className="text-sm text-gray-600 flex flex-wrap gap-2 list-disc marker:text-[#D9D9D9] mb-4">
              <span>{order.buyer_email}</span>
              {order.buyer_phone && (
                <li className="ml-4"><span>{order.buyer_phone}</span></li>
              )}
            </ul>

            <div className="border-t border-[#AFAFAF]"></div>

            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <p className="font-medium mt-4 whitespace-nowrap">{order.item_title}</p>
                <p className="mt-1">Amount: <span className="font-semibold">₹{parseFloat(order.order_amount).toLocaleString("en-IN")}</span></p>
              </div>
              <p className="bg-[#C5FFD4] px-2 md:px-6 py-1 rounded-lg text-[#275934] font-medium mt-6 text-[14px] md:text-[16px] whitespace-nowrap">
                ₹{parseFloat(order.commission_amount).toLocaleString("en-IN")} Commission
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
