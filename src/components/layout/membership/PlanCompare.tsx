"use client";

import type { Membership, ComparisonFeature } from "@/types/models.types";

interface PlansComparisonTableProps {
  memberships?: Membership[];
}

const Check = () => <img src="/images/tick.png" alt="Included" className="mx-auto" />;
const Cross = () => <img src="/images/cancel.png" alt="Not included" className="mx-auto" />;

export default function PlansComparisonTable({ memberships }: PlansComparisonTableProps) {
  if (!memberships || memberships.length === 0) return null;

  // Sort plans by sort_order ascending
  const sortedPlans = [...memberships].sort((a, b) => a.sort_order - b.sort_order);

  // Build the union of all comparison features, preserving their order.
  // Features arrive pre-sorted by sort_order from the API; the first plan
  // that defines them typically carries the full list.
  const featureMap = new Map<number, ComparisonFeature>();
  for (const plan of sortedPlans) {
    for (const cf of plan.comparison_features ?? []) {
      if (!featureMap.has(cf.id)) {
        featureMap.set(cf.id, cf);
      }
    }
  }

  const allFeatures = Array.from(featureMap.values());

  // Fall back gracefully when no comparison features exist yet
  if (allFeatures.length === 0) return null;

  return (
    <div className="w-full container px-4 mx-auto py-6 md:py-10">
      <h2 className="text-[30px] md:text-[40px] text-[#252525] font-bold text-center mb-2">Compare Plans</h2>
      <p className="text-center text-[#454545] mb-6 md:mb-16 text-[18px] md:text-[24px]">
        See what&apos;s included in each membership tier
      </p>

      <div className="overflow-x-auto w-full scrollbar-hide">
        <table className="min-w-[700px] w-full border-collapse bg-white shadow-sm rounded-lg border-l border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-[#252525] font-bold text-[20px]">
              <th className="py-3 px-4 text-center sticky left-0 bg-gray-100 z-10">
                Features
              </th>
              {sortedPlans.map((p) => (
                <th
                  key={p.id}
                  className="py-3 px-4 text-center border-r border-gray-300"
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {allFeatures.map((feature) => (
              <tr key={feature.id} className="border-b border-gray-300">
                <td className="py-3 font-medium text-[#252525] text-[16px] text-center sticky left-0 bg-white z-10 border-r border-gray-300">
                  {feature.name}
                </td>

                {sortedPlans.map((plan) => {
                  const cf = plan.comparison_features?.find((f) => f.id === feature.id);
                  const available = cf?.available ?? false;
                  return (
                    <td key={plan.id} className="py-3 px-4 text-center border-r border-gray-300">
                      {available ? <Check /> : <Cross />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
