"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getMyAffiliateDashboard,
  getMyReferralLinks,
  type AffiliateDashboardData,
  type ReferralLinksData,
} from "@/services/order.service";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://studycafe.io";

function ReferralImage({ src, alt }: { src?: string | null; alt: string }) {
  const resolved = resolveApiAssetUrl(src);
  if (!resolved) return null;
  return (
    <div className="relative w-full h-[140px] rounded-md overflow-hidden border border-[#E5E7EB]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolved} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

export default function Earning() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<AffiliateDashboardData | null>(null);

  const [links, setLinks] = useState<ReferralLinksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
const [search, setSearch] = useState("");
const [searchLoading, setSearchLoading] = useState(false);
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const [dashData, linkData] = await Promise.all([
  //         getMyAffiliateDashboard(),
  //         getMyReferralLinks(search)
  //       ]);
  //       setDashboard(dashData);
  //       setLinks(linkData);
  //     } catch (err: any) {
  //       console.error("Failed to load affiliate data:", err);
  //       setError(err?.response?.data?.message || "Failed to load affiliate data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

useEffect(() => {
  const timer = setTimeout(async () => {
    try {
      setSearchLoading(true);

      const data = await getMyReferralLinks(search);
      setLinks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  }, 500); // 500ms debounce

  return () => clearTimeout(timer);
}, [search]);

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const dashData = await getMyAffiliateDashboard();
      setDashboard(dashData);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load affiliate data");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);
  const copyUrl = useCallback((path: string, key: string) => {
    const url = `${BASE_URL}${path}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  }, []);

  if (loading) {
    return (
      <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm border-[#9FBBFF] p-4">
        <div className="text-center py-12 text-gray-400">Loading affiliate data…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm border-[#9FBBFF] p-4">
        <h2 className="text-[26px] font-normal text-gray-800 mb-1">Affiliate Dashboard</h2>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
            className="px-4 py-2 border border-[#09339B] text-[#09339B] rounded-md"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const visibleCourses = showAllCourses ? (links?.courses ?? []) : (links?.courses ?? []).slice(0, 4);

  return (
    <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm border-[#9FBBFF] p-4">
      <h2 className="text-[26px] font-normal text-gray-800 mb-1">
       Affiliate Dashboard
      </h2>
      <p className="text-gray-500 text-[16px] mb-2">
        Manage your referral links and track your performance.
      </p>
     
      <h2 className="text-[16px] font-bold mb-4">Overall Earning</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
          <h2 className="xl:text-[20px] text-[#6a6969]">Total Order</h2>
          <h3 className="font-bold">{dashboard?.totalOrders ?? 0}</h3>
        </div>
        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
          <h2 className="xl:text-[20px] text-[#6a6969]">Order Value</h2>
          <h3 className="font-bold">₹{dashboard?.totalOrderValue?.toLocaleString("en-IN") ?? "0"}</h3>
        </div>
        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
            <h2 className="xl:text-[20px] text-[#6a6969]">Total Commission</h2>
            <h3 className="font-bold">₹{dashboard?.totalCommission?.toLocaleString("en-IN") ?? "0"}</h3>
        </div>
      </div>

      {(dashboard?.available_for_withdrawal != null ||
        dashboard?.pending_withdrawal_total != null ||
        dashboard?.settings) && (
        <div className="mt-4 px-2 flex flex-wrap gap-6 text-sm text-[#555]">
          <p>
            Available to withdraw:{" "}
            <span className="font-semibold text-[#09339B]">
              ₹{(dashboard?.available_for_withdrawal ?? 0).toLocaleString("en-IN")}
            </span>
          </p>
          <p>
            Pending withdrawal requests:{" "}
            <span className="font-semibold">
              ₹{(dashboard?.pending_withdrawal_total ?? 0).toLocaleString("en-IN")}
            </span>
          </p>
          {dashboard?.settings?.minWithdrawal != null && (
            <p>
              Minimum withdrawal:{" "}
              <span className="font-semibold">
                ₹{dashboard.settings.minWithdrawal.toLocaleString("en-IN")}
              </span>
            </p>
          )}
          {(dashboard?.expired_commission_total ?? 0) > 0 && (
            <p>
              Expired commission:{" "}
              <span className="font-semibold text-[#B91C1C]">
                ₹{(dashboard?.expired_commission_total ?? 0).toLocaleString("en-IN")}
              </span>
            </p>
          )}
          {(dashboard?.settings?.earningsExpiryDays ?? 0) > 0 && (
            <p>
              Commission expires{" "}
              <span className="font-semibold">{dashboard?.settings?.earningsExpiryDays} days</span> after each earning if not withdrawn.
            </p>
          )}
          {dashboard?.next_expiry_at && (
            <p>
              Next expiry:{" "}
              <span className="font-semibold text-amber-700">
                {new Date(dashboard.next_expiry_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </p>
          )}
        </div>
      )}

      <div className="px-2 mt-6">
        <button
          className="px-4 py-2 bg-[#09339B] text-white rounded-lg text-sm md:text-base font-medium hover:bg-white hover:text-[#09339B] border border-[#09339B] transition-colors duration-300"
          onClick={() => router.push("/report")}
        >
          View Full Report
        </button>
      </div>

      {/* Affiliate Links */}
      <div>
        <div className="flex mt-4 px-2 items-center justify-between">
          <p className="flex"><img src="/images/link.svg" alt="" /> <span className="font-bold">Affiliate URLs</span></p>
           <div className="relative w-[50%]">

            <div className="relative mt-4 sm:mt-0 mb-4">
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
                placeholder="Search..."
               className="border border-gray-300 rounded-lg px-10 py-2 text-[16px] w-full placeholder-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              
            </div>
             

              {searchLoading && (
                <div className="absolute right-3 top-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#09339B] border-t-transparent" />
                </div>
              )}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-stretch">
          <div className="border border-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg ">
            <img src="/images/home.svg" alt="" />
            <h2 className="font-bold">Homepage</h2>
            <p className="line-clamp-2 flex-grow">Direct traffic to our main landing page for general visitors.</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md break-all">
              {BASE_URL}{links?.homepage ?? ""}
            </p>
            <button
              onClick={() => copyUrl(links?.homepage ?? "", "homepage")}
              className={`flex justify-center gap-2 px-4 py-2 w-full rounded-md border transition-colors ${
                copiedKey === "homepage"
                  ? "bg-green-50 text-green-600 border-green-400"
                  : "text-[#1F4FBF] border-[#1F4FBF]"
              }`}
            >
              <img src="/images/copy-b.svg" alt="" />
              {copiedKey === "homepage" ? "Copied!" : "Copy URL"}
            </button>
          </div>
          <div className="border border-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
            <img src="/images/member-b.svg" alt="" />
            <h2 className="font-bold">Membership</h2>
            <p className="line-clamp-2 px-1">Direct users to the membership page with your referral.</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md break-all">
              {BASE_URL}{links?.membership ?? ""}
            </p>
            <button
              onClick={() => copyUrl(links?.membership ?? "", "membership")}
              className={`flex justify-center gap-2 px-4 py-2 w-full rounded-md border transition-colors ${
                copiedKey === "membership"
                  ? "bg-green-50 text-green-600 border-green-400"
                  : "text-[#1F4FBF] border-[#1F4FBF]"
              }`}
            >
              <img src="/images/copy-b.svg" alt="" />
              {copiedKey === "membership" ? "Copied!" : "Copy URL"}
            </button>
          </div>
        </div>
      </div>

      {/* Course Categories */}
      {(links?.categories?.length ?? 0) > 0 && (
        <div>
          <div className="flex mt-4 px-2">
            <img src="/images/category.svg" alt="" /> <span className="font-bold">Courses Categories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {links!.categories.map((category) => (
              <div key={category.id} className="border border-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
                <ReferralImage src={category.imageUrl} alt={category.title} />
                <h2 className="text-[16px] font-bold">{category.title}</h2>
                <p className="line-clamp-2">{category.description}</p>
                <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md break-all">
                  {BASE_URL}{category.url}
                </p>
                <button
                  onClick={() => copyUrl(category.url, `cat-${category.id}`)}
                  className={`flex justify-center items-center gap-2 px-4 py-2 w-full rounded-md border transition-colors ${
                    copiedKey === `cat-${category.id}`
                      ? "bg-green-50 text-green-600 border-green-400"
                      : "text-[#1F4FBF] border-[#1F4FBF]"
                  }`}
                >
                  <img src="/images/copy-b.svg" alt="" />
                  {copiedKey === `cat-${category.id}` ? "Copied!" : "Copy URL"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Courses */}
      {(links?.courses?.length ?? 0) > 0 && (
        <div>
          <div className="flex mt-4 px-2">
            <img src="/images/all-course.svg" alt="" /> <span className="font-bold">All Courses</span>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-4">
            {visibleCourses.map((item) => (
              <div key={item.id} className="border border-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
                 <img src={item?.imageUrl}/>
                {item.originalPrice > 0 && (
                  <div className="flex flex-col">
                    {item.originalPrice !== item.discountedPrice && (
                      <span className="line-through text-[#929292] font-medium">
                        ₹{item.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="text-[#09339B] font-bold text-[16px]">
                      ₹{item.discountedPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
               

                <h2 className="text-[16px] font-bold">{item.title}</h2>
                <p>{item.description}</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md break-all md:w-3/4">
                    {BASE_URL}{item.url}
                  </p>
                  <button
                    onClick={() => copyUrl(item.url, `course-${item.id}`)}
                    className={`flex justify-center items-center gap-2 xl:px-4 xl:py-2 rounded-md border md:w-1/4 transition-colors ${
                      copiedKey === `course-${item.id}`
                        ? "bg-green-50 text-green-600 border-green-400"
                        : "text-[#1F4FBF] border-[#1F4FBF]"
                    }`}
                  >
                    <img src="/images/copy-b.svg" alt="" />
                    {copiedKey === `course-${item.id}` ? "Copied!" : "Copy URL"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {(links?.courses?.length ?? 0) > 4 && !showAllCourses && (
            <button
              onClick={() => setShowAllCourses(true)}
              className="bg-[#09339B] text-white px-12 py-2 rounded-md mt-4 mx-auto block text-sm md:text-base font-medium hover:bg-white hover:text-[#09339B] border border-[#09339B] transition-colors duration-300"
            >
              View All
            </button>
          )}
        </div>
      )}
    </section>
  );
}
