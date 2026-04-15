"use client";

import Image from "next/image";
import type { Membership, MembershipFeatures, ComparisonFeature } from "@/types/models.types";

interface Props {
  plan: Membership | null;
}

function formatDuration(days: number, isLifetime?: boolean) {
  if (isLifetime || days >= 3650) return "Lifetime";
  if (days >= 365) {
    const years = Math.round(days / 365);
    return `${years} Year${years > 1 ? "s" : ""}`;
  }
  if (days >= 30) {
    const months = Math.round(days / 30);
    return `${months} Month${months > 1 ? "s" : ""}`;
  }
  return `${days} Day${days !== 1 ? "s" : ""}`;
}

function getIncludedFeatures(features: Membership["features"]): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features.map(String).filter(Boolean);
  if (typeof features === "object" && "included" in features) {
    return ((features as MembershipFeatures).included ?? []).map(String).filter(Boolean);
  }
  return [];
}

export default function MemberDetail({ plan }: Props) {
  if (!plan) {
    return (
      <div className="min-h-[200px] container px-4 mx-auto flex items-center justify-center">
        <p className="text-[#929292] text-[16px]">Plan details not available.</p>
      </div>
    );
  }

  const durationStr = formatDuration(plan.duration_days, plan.is_lifetime);
  const includedFeatures = getIncludedFeatures(plan.features);
  const comparisonFeatures = plan.comparison_features ?? [];
  const includedComparison = comparisonFeatures.filter((f) => f.available);
  const excludedComparison = comparisonFeatures.filter((f) => !f.available);

  return (
    <div className="container px-4 mx-auto">
      <div className="lg:col-span-2 space-y-6 mt-6">
        <p className="bg-[#F9F9FB] w-fit px-4 p-2 text-[#454545] font-normal text-[16px]">
          <strong>{durationStr}</strong>
        </p>

        <h1 className="text-[30px] font-medium text-gray-900 leading-snug">
          {plan.name}
        </h1>

        {plan.description && (
          <p className="text-[#929292] text-[16px] leading-relaxed">
            {plan.description}
          </p>
        )}

        {/* Included features from plan.features JSON */}
        {includedFeatures.length > 0 && (
          <div className="space-y-3 pt-4">
            <h2 className="text-[20px] text-[#252525] font-medium">What&apos;s Included</h2>
            <ul className="space-y-3 text-[#929292]">
              {includedFeatures.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Image src="/images/tick.svg" alt="tick" width={22} height={22} className="flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Comparison features — included */}
        {includedComparison.length > 0 && (
          <div className="space-y-3 pt-4">
            {includedFeatures.length === 0 && (
              <h2 className="text-[20px] text-[#252525] font-medium">What&apos;s Included</h2>
            )}
            <ul className="space-y-3 text-[#929292]">
              {includedComparison.map((f) => (
                <li key={f.id} className="flex items-start gap-2">
                  <Image src="/images/tick.svg" alt="included" width={22} height={22} className="flex-shrink-0 mt-0.5" />
                  <span>{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Comparison features — not included */}
        {excludedComparison.length > 0 && (
          <div className="space-y-3 pt-4">
            <h2 className="text-[20px] text-[#252525] font-medium">Not Included</h2>
            <ul className="space-y-3 text-[#929292]">
              {excludedComparison.map((f) => (
                <li key={f.id} className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-0.5 w-[22px] h-[22px] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4L12 12M12 4L4 12" stroke="#AFAFAF" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="line-through">{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
