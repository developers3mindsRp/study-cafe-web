"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { isAxiosError } from "axios";
import { Download, FileSpreadsheet, Info, Copy  } from "lucide-react";
import { X } from "lucide-react";

import {
  getMyCommissionOrders,
  getMyAffiliateDashboard,
  getMyWithdrawals,
  createWithdrawalRequest,
  type AffiliateHistoryItem,
  type AffiliateDashboardData,
  type UserWithdrawalRequest,
} from "@/services/order.service";
import { useAuth } from "@/providers/AuthProvider";
import EditProfile from "./EditProfile";
import { useUpdateProfile, useUploadAvatar } from "@/hooks/usePurchases";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error) || !error.response?.data) return fallback;
  const data = error.response.data as { error?: string; message?: string };
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  return fallback;
}

function isoDateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function firstDayOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function AffiliateReportPage() {
  const router = useRouter();
  const { user, refetchUser } = useAuth();

  console.log(user,"user")
    const updateProfile = useUpdateProfile();


  const today = useMemo(() => new Date(), []);
  const [fromDate, setFromDate] = useState(() => isoDateLocal(firstDayOfMonth(today)));
  const [toDate, setToDate] = useState(() => isoDateLocal(today));
  const [allTime, setAllTime] = useState(false);
   const [form, setForm] = useState({   
     // Bank Details
    bank_account_holder_name: "",
    bank_account_number: "",
    bank_name: "",
    bank_branch: "",
    bank_ifsc: "",
  });
 const [errors, setErrors] = useState<Record<string, string>>({});
 
   const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [orders, setOrders] = useState<AffiliateHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [dashboard, setDashboard] = useState<AffiliateDashboardData | null>(null);
  const [withdrawals, setWithdrawals] = useState<UserWithdrawalRequest[]>([]);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);

  const loadSummary = useCallback(async () => {
    const [dash, wd] = await Promise.all([
      getMyAffiliateDashboard(),
      getMyWithdrawals(),
    ]);
    setDashboard(dash);
    setWithdrawals(wd);
  }, []);

  const fetchOrders = useCallback(
    async (opts?: { all?: boolean }) => {
      setLoading(true);
      setError(null);
      try {
        const useAll = opts?.all ?? allTime;
        const data = await getMyCommissionOrders(
          useAll ? undefined : fromDate || undefined,
          useAll ? undefined : toDate || undefined,
        );
        setOrders(data);
      } catch (err: unknown) {
        console.error("Failed to fetch commission orders:", err);
        setOrders([]);
        setError("Could not load commission orders. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [allTime, fromDate, toDate],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const now = new Date();
        const initialFrom = isoDateLocal(firstDayOfMonth(now));
        const initialTo = isoDateLocal(now);
        const [dash, wd, orderRows] = await Promise.all([
          getMyAffiliateDashboard(),
          getMyWithdrawals(),
          getMyCommissionOrders(initialFrom, initialTo),
        ]);
        if (!cancelled) {
          setDashboard(dash);
          setWithdrawals(wd);
          setOrders(orderRows);
        }
      } catch {
        if (!cancelled) {
          setOrders([]);
          setError("Could not load your report. Please refresh.");
        }
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);




    useEffect(() => {
      if (showBankModal && user?.bank_account_holder_name) {
        // Normalize phone: store internally as "+91XXXXXXXXXX" regardless of what comes from API
        const rawPhone: string = user.phone ?? "";
        const normalizedPhone = rawPhone.startsWith("+") ? rawPhone : rawPhone ? `+91${rawPhone}` : "";
        setForm({
        
          bank_account_holder_name: user.bank_account_holder_name ?? "",
          bank_account_number: user.bank_account_number ?? "",
          bank_name: user.bank_name ?? "",
          bank_branch: user.bank_branch ?? "",
          bank_ifsc: user.bank_ifsc ?? "",
        });
      }
    }, [user?.bank_account_holder_name]);
  const periodCommission = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "expired")
        .reduce((s, o) => s + parseFloat(String(o.commission_amount || 0)), 0),
    [orders],
  );

  const periodExpiredCommission = useMemo(
    () =>
      orders
        .filter((o) => o.status === "expired")
        .reduce((s, o) => s + parseFloat(String(o.commission_amount || 0)), 0),
    [orders],
  );

  const available =
    dashboard?.available_for_withdrawal ??
    Math.max(
      0,
      parseFloat(String(dashboard?.balance?.current_balance ?? 0)) -
        (dashboard?.pending_withdrawal_total ?? 0),
    );

  const minWithdrawal = dashboard?.settings?.minWithdrawal ?? 1000;
  const earningsExpiryDays = dashboard?.settings?.earningsExpiryDays ?? 90;

  const handleSearch = useCallback(async () => {
    setSuccess(null);
    if (!allTime) {
      if (!fromDate || !toDate) {
        setError("Please select both From and To dates, or enable “All time”.");
        return;
      }
      if (new Date(fromDate) > new Date(toDate)) {
        setError("“From” date must be on or before “To” date.");
        return;
      }
    }
    setError(null);
    await fetchOrders();
  }, [allTime, fromDate, toDate, fetchOrders]);

  const handleToggleAllTime = useCallback(
    (checked: boolean) => {
      setAllTime(checked);
      setError(null);
    },
    [],
  );


  const handleExportCSV = useCallback(() => {
  if (orders.length === 0) {
    setError("No commission orders available to export.");
    return;
  }

  const headers = [
    "Order ID",
    "Buyer Name",
    "Buyer Email",
    "Buyer Phone",
    "Item",
    "Entity Type",
    "Order Amount",
    "Commission Amount",
    "Status",
    "Earned Date",
    "Expiry Date",
  ];

  const rows = orders.map((order) => [
    order.order_id,
    order.buyer_name,
    order.buyer_email,
    order.buyer_phone ?? "",
    order.item_title,
    order.entity_type,
    order.order_amount,
    order.commission_amount,
    order.status,
    formatDate(order.created_at),
    order.expires_at ? formatDate(order.expires_at) : "",
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `commission-orders-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}, [orders]);

  const handleWithdraw = useCallback(async () => {
    const amount = parseFloat(withdrawAmount);
     if(!user?.bank_account_holder_name){
      setShowBankModal(true);
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }
    if (amount + 1e-6 < minWithdrawal) {
      setError(`Minimum withdrawal amount is ₹${minWithdrawal.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}.`);
      return;
    }
    if (amount > available + 1e-6) {
      setError(`Amount cannot exceed available balance (₹${available.toFixed(2)}).`);
      return;
    }
    setWithdrawSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await createWithdrawalRequest(amount);
      setWithdrawAmount("");
      setSuccess("Withdrawal request submitted. Our team will process it and update your balance.");
      await loadSummary();
      await fetchOrders({ all: allTime });
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, "Could not submit withdrawal. Please try again."));
    } finally {
      setWithdrawSubmitting(false);
    }
  }, [withdrawAmount, available, minWithdrawal, loadSummary, fetchOrders, allTime]);

  if (initialLoading) {
    return (
      <section className="md:p-6 max-w-6xl mx-auto bg-white px-6 py-12 text-center text-gray-500">
        Loading your report…
      </section>
    );
  }

  const bal = dashboard?.balance;


/*-------save banks details----------*/

 
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    // Auto-uppercase GST number as the user types
    const finalValue = name === "gst" ? value.toUpperCase() : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }
function validate() {
  const errs: Record<string, string> = {};

  if (!form.bank_account_holder_name.trim()) {
    errs.bank_account_holder_name = "Account holder name is required.";
  } else if (form.bank_account_holder_name.trim().length < 3) {
    errs.bank_account_holder_name =
      "Account holder name must be at least 3 characters.";
  }

  if (!form.bank_account_number.trim()) {
    errs.bank_account_number = "Account number is required.";
  } else if (!/^\d{9,18}$/.test(form.bank_account_number.trim())) {
    errs.bank_account_number =
      "Account number must be between 9 and 18 digits.";
  }

  if (!form.bank_name.trim()) {
    errs.bank_name = "Bank name is required.";
  } else if (form.bank_name.trim().length < 2) {
    errs.bank_name = "Enter a valid bank name.";
  }

  if (!form.bank_branch.trim()) {
    errs.bank_branch = "Branch name is required.";
  } else if (form.bank_branch.trim().length < 2) {
    errs.bank_branch = "Enter a valid branch name.";
  }

  const ifsc = form.bank_ifsc.trim().toUpperCase();

  if (!ifsc) {
    errs.bank_ifsc = "IFSC code is required.";
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
    errs.bank_ifsc = "Enter a valid IFSC code.";
  }

  setErrors(errs);

  return Object.keys(errs).length === 0;
}

  function handleSave() {
    if (!validate()) return;
    setSaveMsg(null);
    updateProfile.mutate(
      {
       
        bank_account_holder_name: form.bank_account_holder_name.trim() || undefined,
        bank_account_number:
          form.bank_account_number.trim() || undefined,
        bank_name:
          form.bank_name.trim() || undefined,
        bank_branch:
          form.bank_branch.trim() || undefined,
        bank_ifsc:
          form.bank_ifsc.trim().toUpperCase() || undefined,
      },
      {
        onSuccess: () => {
          setSaveMsg({ type: "success", text: "Profile updated successfully!" });
          refetchUser();
          setShowBankModal(false);
          setTimeout(() => setSaveMsg(null), 4000);
        },
        onError: (err: any) => {
          setSaveMsg({
            type: "error",
            text: err?.response?.data?.message || err?.message || "Failed to update profile",
          });
        },
      }
    );
  }








  return (
    <section className="md:p-6 max-w-6xl mx-auto bg-white px-4 sm:px-6 pb-16">
      <button
        type="button"
        className="text-[16px] text-[#09339B] mb-3 hover:underline"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Affiliate Dashboard
      </button>

      <h1 className="text-[26px] md:text-[34px] font-semibold text-[#252525] mb-1">
        Commission report
      </h1>
      <p className="text-[#454545] text-[15px] md:text-[18px] mb-6">
        Filter referral commissions by period and request payouts. Withdrawals stay pending until
        staff marks them approved in admin after paying you manually.
        {earningsExpiryDays > 0 && (
          <> Each commission expires {earningsExpiryDays} days after it is earned if not withdrawn.</>
        )}
      </p>

      {/* Balance overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
        <div className="border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-sm text-[#717171]">Current balance</p>
          <p className="text-xl font-semibold text-[#252525]">
            ₹{parseFloat(String(bal?.current_balance ?? 0)).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-sm text-[#717171]">Pending withdrawal requests</p>
          <p className="text-xl font-semibold text-[#252525]">
            ₹{(dashboard?.pending_withdrawal_total ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-sm text-[#717171]">Monthly commission total</p>
          <p className="text-xl font-semibold text-[#252525]">
            ₹{(dashboard?.monthly_commission_total ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
        </div>

        
        <div className="border border-[#B4C6FF] rounded-xl p-4 bg-[#F8FAFF]">
          <p className="text-sm text-[#09339B]">Available to withdraw</p>
          <p className="text-xl font-semibold text-[#09339B]">
            ₹{available.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-sm text-[#717171]">Lifetime commission (earned)</p>
          <p className="text-xl font-semibold text-[#252525]">
            ₹{parseFloat(String(bal?.total_earned ?? 0)).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
        </div>
        {(dashboard?.expired_commission_total ?? 0) > 0 && (
          <div className="border border-[#FECACA] rounded-xl p-4 bg-[#FEF2F2]">
            <p className="text-sm text-[#B91C1C]">Expired commission</p>
            <p className="text-xl font-semibold text-[#B91C1C]">
              ₹{(dashboard?.expired_commission_total ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </div>

      {earningsExpiryDays > 0 && dashboard?.next_expiry_at && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-6">
          Your earliest active commission expires on{" "}
          <span className="font-semibold">{formatDate(dashboard.next_expiry_at)}</span>.
          Withdraw before expiry to avoid losing that amount.
        </p>
      )}

      {(error || success) && (
        <div className="mb-6 space-y-2">
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{error}</p>
          )}
          {success && (
            <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-900">{success}</p>
          )}
        </div>
      )}

      {/* Date filter */}
      <div className="border border-[#B4C6FF] rounded-xl p-4 shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-end flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer order-first md:order-none">
            <input
              type="checkbox"
              checked={allTime}
              onChange={(e) => handleToggleAllTime(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-[15px] text-[#252525]">All time (ignore dates)</span>
          </label>

          <div className="flex-1 min-w-[140px]">
            <label className="text-[14px] text-[#555]">From</label>
            <input
              type="date"
              disabled={allTime}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 w-full h-[44px] px-3 border border-gray-300 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#09339B] disabled:opacity-50"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-[14px] text-[#555]">To</label>
            <input
              type="date"
              disabled={allTime}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 w-full h-[44px] px-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09339B] disabled:opacity-50"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#09339B] text-white px-6 py-2.5 rounded-xl hover:bg-[#0F2E75] transition text-[15px] disabled:opacity-60 h-[44px] self-end"
          >
            {loading ? "Loading…" : "Apply filter"}
          </button>
        </div>

        {!loading && orders.length > 0 && (
          <p className="mt-4 text-[18px] text-[#252525]">
            <span className="font-semibold">{orders.length}</span> order
            {orders.length !== 1 ? "s" : ""} in this view · Active commission:{" "}
            <span className="font-semibold text-[#275934]">
              ₹{periodCommission.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {periodExpiredCommission > 0 && (
              <>
                {" "}
                · Expired in period:{" "}
                <span className="font-semibold text-[#B91C1C]">
                  ₹{periodExpiredCommission.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </>
            )}
          </p>
        )}
      </div>

      {/* Withdrawal request */}
      <div className="border border-[#E5E7EB] rounded-xl p-5 mb-10">
        <h2 className="text-lg font-semibold text-[#252525] mb-2">Request withdrawal</h2>
        <p className="text-sm text-[#616161] mb-4">
          Submit the amount you want paid out. Admin will transfer funds offline and mark the request
          approved in the system (which updates your balance). Rejected requests do not change your
          balance. Minimum withdrawal: ₹{minWithdrawal.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end max-w-xl">
          <div className="flex-1">
            {/* <label className="text-sm text-[#555]">Amount (₹)</label> */}
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm text-[#555]">
                Amount (₹)
              </label>
             
             

         
            </div>
            <input
              type="number"
              min={minWithdrawal}
              step={0.01}
              max={available}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder={`Min ₹${minWithdrawal.toLocaleString("en-IN")} · Max ₹${available.toFixed(2)}`}
              className="mt-1 w-full h-[44px] px-3 border border-gray-300 rounded-xl"
            />
          </div>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={withdrawSubmitting || available < minWithdrawal}
            className="bg-[#09339B] text-white px-6 py-2.5 rounded-xl hover:bg-[#0F2E75] disabled:opacity-50 h-[44px]"
          >
            {withdrawSubmitting ? "Submitting…" : "Submit request"}
          </button>
          
        </div>
         {
                user?.bank_account_holder_name &&
                <div className="relative group ">
                 

                  <div className=" w-[575px] rounded-lg border border-gray-200 bg-white p-4 mt-2 group-hover:block">
                    <h4 className="mb-3 text-sm font-semibold text-[#252525]">
                      Bank Details
                    </h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Account Holder</span>
                        <span className="font-medium text-right">
                          {user?.bank_account_holder_name || "Not Added"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Account Number</span>
                        <span className="font-medium text-right">
                          {user?.bank_account_number || "Not Added"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Bank</span>
                        <span className="font-medium text-right">
                          {user?.bank_name || "Not Added"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Branch</span>
                        <span className="font-medium text-right">
                          {user?.bank_branch || "Not Added"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">IFSC</span>
                        <span className="font-medium text-right">
                          {user?.bank_ifsc || "Not Added"}
                        </span>
                      </div>
                    </div>

                    {!user?.bank_account_number && (
                      <p className="mt-3 rounded bg-yellow-50 p-2 text-xs text-yellow-700">
                        Please update your bank details in your profile before requesting a
                        withdrawal.
                      </p>
                    )}
                  </div>
                </div>
              }
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl">
              {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Bank Details
              </h2>

              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="rounded-full p-2 hover:bg-gray-100 transition"
              >
                <X size={22} className="text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[80vh] overflow-y-auto px-6 py-2">
             
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="text-sm font-medium">Account Holder Name</label>
                      <input
                        type="text"
                        name="bank_account_holder_name"
                        value={form.bank_account_holder_name}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1"
                        placeholder="Account Holder Name"
                      />
                      {errors.bank_account_holder_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.bank_account_holder_name}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Account Number</label>
                      <input
                        type="text"
                        name="bank_account_number"
                        value={form.bank_account_number}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1"
                        placeholder="Account Number"
                      />

                      {errors.bank_account_number && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.bank_account_number}
                        </p>
                      )}

                    </div>

                    <div>
                      <label className="text-sm font-medium">Bank Name</label>
                      <input
                        type="text"
                        name="bank_name"
                        value={form.bank_name}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1"
                        placeholder="Bank Name"
                      />

                        {errors.bank_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.bank_name}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Branch</label>
                      <input
                        type="text"
                        name="bank_branch"
                        value={form.bank_branch}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1"
                        placeholder="Branch Name"
                      />
                      {errors.bank_branch && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.bank_branch}
                          </p>
                        )}

                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">IFSC Code</label>
                      <input
                        type="text"
                        name="bank_ifsc"
                        value={form.bank_ifsc}
                        onChange={handleChange}
                        className="w-full border border-[#1A1A1A] px-3 py-2 rounded-md mt-1 uppercase"
                        placeholder="SBIN0001234"
                        style={{ textTransform: "uppercase" }}
                      />
                      {errors.bank_ifsc && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.bank_ifsc}
                          </p>
                        )}
                    </div>

                  </div>
                    {/* Save + Messages */}
                 {saveMsg && (
                    <p className={`text-sm  ${saveMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                      {saveMsg.text}
                    </p>
                  )}
                <div className="flex justify-between items-center mt-6">
                 
                  <div className="w-full">
                    <button
                      type="button"
                      disabled={updateProfile.isPending}
                      onClick={handleSave}
                      className="bg-[#09339B] px-5 py-2 text-white rounded-md disabled:opacity-60 w-full"
                    >
                      {updateProfile.isPending ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}
       
      </div>

      {/* Your withdrawal history */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-[#252525] mb-3">Your withdrawal requests</h2>
        {withdrawals.length === 0 ? (
          <p className="text-gray-500 text-sm">No withdrawal requests yet.</p>
        ) : (
          <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F9FAFB] text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Amount</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-t border-[#EEE]">
                    <td className="px-4 py-2 whitespace-nowrap">{formatDate(w.created_at)}</td>
                    <td className="px-4 py-2">
                      ₹{parseFloat(String(w.amount)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          w.status === "approved"
                            ? "text-green-700"
                            : w.status === "rejected"
                              ? "text-red-700"
                              : "text-amber-700"
                        }
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[#555] max-w-xs truncate" title={w.remarks || ""}>
                      {w.remarks || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Commission orders list */}
     

      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-[#252525]">
            Commission Orders
          </h2>
                {!loading && orders.length === 0 && (
                <p className="text-center text-gray-500 ">No commission orders for the selected period.</p>
              )}
        </div>
        

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={orders.length === 0}
          className="flex items-center gap-2 rounded-lg bg-[#09339B] px-4 py-2 text-white hover:bg-[#0F2E75] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {orders.map((order) => (
        <div
          key={order.id}
          className="grid grid-cols-1 gap-3 mt-4 border hover:border-[#9FBBFF] shadow-md rounded-lg p-4 px-4 md:px-6 md:mx-0"
        >
          <div className="flex justify-between md:text-[18px] flex-wrap gap-2">
            <p className="font-bold">Order — {order.order_id}</p>
            <div className="text-right">
              <p className="text-[#555]">Earned {formatDate(order.created_at)}</p>
              {order.status === "expired" && order.expires_at && (
                <p className="text-xs text-red-600 font-medium">
                  Expired on {formatDate(order.expires_at)}
                </p>
              )}
              {order.status === "expired" && !order.expires_at && (
                <p className="text-xs text-red-600 font-medium">Expired</p>
              )}
              {order.status === "confirmed" && order.expires_at && (
                <p className="text-xs text-amber-700">
                  Expires {formatDate(order.expires_at)}
                </p>
              )}
            </div>
          </div>

          <p className="font-medium">{order.buyer_name}</p>
          <ul className="text-sm text-gray-600 flex flex-wrap gap-2 list-disc marker:text-[#D9D9D9] mb-2">
            <span>{order.buyer_email}</span>
            {order.buyer_phone && (
              <li className="ml-4">
                <span>{order.buyer_phone}</span>
              </li>
            )}
          </ul>

          <div className="border-t border-[#AFAFAF]" />

          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col min-w-0">
              <p className="font-medium mt-2">{order.item_title}</p>
              <p className="text-sm mt-1">
                Order amount:{" "}
                <span className="font-semibold">
                  ₹{parseFloat(String(order.order_amount)).toLocaleString("en-IN")}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5 capitalize">Type: {order.entity_type}</p>
            </div>
            <p
              className={`px-3 md:px-5 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 ${
                order.status === "expired"
                  ? "bg-[#FEE2E2] text-[#B91C1C] line-through"
                  : "bg-[#C5FFD4] text-[#275934]"
              }`}
            >
              ₹
              {parseFloat(String(order.commission_amount)).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}{" "}
              commission
            </p>
          </div>
          {order.status === "expired" && (
            <p className="text-sm text-red-600">
              This commission expired before withdrawal and is no longer available.
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
