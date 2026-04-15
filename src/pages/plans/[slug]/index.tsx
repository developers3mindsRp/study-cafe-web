"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout";
import Breadcrumbs from "@/components/Breadcrumb";
import MemberDetail from "@/components/layout/membership/details/MemberDetail";
import MemberPrice from "@/components/layout/membership/details/SidebarMember";
import { getMembershipBySlug } from "@/services/platform.service";
import type { Membership } from "@/types/models.types";

export default function MembershipDetailPage() {
  const router = useRouter();
  const slug = (router.query.slug as string) ?? "";

  const [plan, setPlan] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      {loading ? (
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
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-10 mt-6 container">
          <div className="lg:col-span-2 space-y-10">
            <MemberDetail plan={plan} />
          </div>
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <MemberPrice plan={plan} />
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
