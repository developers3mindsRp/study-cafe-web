"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout";
import Breadcrumbs from "@/components/Breadcrumb";
import MemberDetail from "@/components/layout/membership/details/MemberDetail";
import MemberPrice from "@/components/layout/membership/details/SidebarMember";
import { useAuth } from "@/providers/AuthProvider";
import { getMembershipBySlug, getMembershipSummaryById } from "@/services/platform.service";
import type { Membership } from "@/types/models.types";

export default function MembershipDetailPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const slug = (router.query.slug as string) ?? "";

  const [plan, setPlan] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    if (!slug) {
      setError("No plan selected. Please go back and choose a plan.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMembershipBySlug(slug);
        if (cancelled) return;
        if (!data) {
          setError("Plan not found. It may have been removed or is inactive.");
          setPlan(null);
        } else {
          setPlan(data);
        }
      } catch {
        if (!cancelled) setError("Failed to load plan details. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, slug]);



  
  /**
   * The pricing summary below is an authenticated endpoint, so an anonymous
   * visitor cannot be served this page at all — the 401 used to trip the axios
   * interceptor and dump them on the login form. Send them to the short
   * checkout signup instead, and bring them straight back here afterwards.
   */
  useEffect(() => {
    if (!router.isReady || authLoading || isAuthenticated) return;
    const returnPath = router.asPath.split("#")[0];
    void router.replace(`/signup?next=${encodeURIComponent(returnPath)}`);
  }, [router, authLoading, isAuthenticated]);

 useEffect(() => {
  if (!plan?.id || !isAuthenticated) return;

  const fetchMembershipSummary = async () => {
    try {
      setSummaryLoading(true);

      const response = await getMembershipSummaryById({
        targetPlanId: Number(plan.id),
      });

      // console.log("Membership Summary API:", response);

      // Adjust according to API structure
      setSummary(response?.data || response);

    } catch (error) {
      console.error("Failed to fetch membership summary", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  fetchMembershipSummary();
}, [plan?.id, isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-24 text-center text-gray-600">
          Taking you to sign up…
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4 mx-auto">
        <Breadcrumbs
          content={[
            { label: "Plans", href: "/plans" },
            ...(plan ? [{ label: plan.name }] : []),
          ]}
        />
      </div>

      {summaryLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#09339B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[#929292] text-[16px]">Loading plan details…</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4 max-w-md px-4">
            <p className="text-[#929292] text-[16px]">{error}</p>
            <button
              onClick={() => router.push("/plans")}
              className="bg-[#09339B] text-white px-6 py-2 rounded-lg font-medium"
            >
              Browse Plans
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto min-h-[calc(100vh-200px)] gap-8 px-4 pb-10 mt-6 container">
          {/* <div className="lg:col-span-2 space-y-10">
            <MemberDetail plan={plan} />
          </div> */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <MemberPrice plan={summary} />
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
