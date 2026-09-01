import { useEffect, useRef, useState } from "react";
import type { Membership } from "@/types/models.types";

function formatPrice(price: string | number, currency: string) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return `${currency} ${price}`;
  return `₹ ${num.toLocaleString("en-IN")}`;
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

interface MembershipPricingProps {
  memberships?: Membership[];
}

/**
 * Reorder plans so the popular one sits at the center index.
 * Only applied client-side after hydration to avoid SSR/client mismatch.
 */
function centerPopular(plans: Membership[]): Membership[] {
  if (plans.length === 0) return plans;
  const popularIdx = plans.findIndex((p) => p.is_popular);
  if (popularIdx < 0) return plans;
  const centerIdx = Math.floor(plans.length / 2);
  if (popularIdx === centerIdx) return plans;
  const reordered = [...plans];
  const [popular] = reordered.splice(popularIdx, 1);
  reordered.splice(centerIdx, 0, popular);
  return reordered;
}

export default function MembershipPricing({ memberships: initialData }: MembershipPricingProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popularCardRef = useRef<HTMLDivElement | null>(null);

  // Render the original SSR order during first paint, then reorder client-side
  // to put the popular plan at center. Using state avoids a hydration mismatch
  // because the server always renders in the original order.
  const [plans, setPlans] = useState<Membership[] | undefined>(initialData);
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setPlans(centerPopular(initialData));
    }
  }, [initialData]);

  useEffect(() => {
    if (typeof window === "undefined" || !plans?.length) return;
    if (window.innerWidth >= 768) return;

    const container = containerRef.current;
    const card = popularCardRef.current;
    if (!container || !card) return;

    const containerWidth = container.offsetWidth;
    const cardOffsetLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    container.scrollLeft = cardOffsetLeft - containerWidth / 2 + cardWidth / 2;
  }, [plans]);

  if (!plans || plans.length === 0) return null;

  return (
    <section
      className="w-full py-12 xl:py-12 bg-cover bg-center pb-10 pt-10"
      style={{ backgroundImage: "url('/images/membership-bg.svg')" }}
    >
      <div className="max-w-7xl mx-auto md:px-4 md:pt-4">
        <h2 className="text-center text-white text-[30px] xl:text-[40px] font-semibold ">
          Choose Your  Membership
        </h2>
        <p className="text-center text-blue-100 mt-2 text-[16px] xl:text-[24px]">
          Get unlimited access to all courses and <br /> exclusive benefits
        </p>

        <div className="mt-10 md:mt-16">
          {/* Mobile slider */}
          <div
            ref={containerRef}
            className="flex gap-8 overflow-x-auto overflow-y-hidden  md:hidden mt-4 pb-4 scrollbar-hide pt-0 pl-6 px-6"
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                ref={plan.is_popular ? popularCardRef : undefined}
                mobile
              />
            ))}
          </div>

          {/* Desktop grid — popular is always at center column */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { forwardRef } from "react";

interface PlanCardProps {
  plan: Membership;
  mobile?: boolean;
}

/** Bullets on the pricing card: only included lines (not comparison table, not excluded). */
const normalizeFeatures = (features: unknown): string[] => {
  if (!features) return [];

  if (Array.isArray(features)) {
    return features.map((f) => String(f).trim()).filter(Boolean);
  }

  if (typeof features === "object" && features !== null && "included" in features) {
    const inc = (features as { included?: unknown }).included;
    if (!Array.isArray(inc)) return [];
    return inc.map((f) => String(f).trim()).filter(Boolean);
  }

  return [];
};

const PlanCard = forwardRef<HTMLDivElement, PlanCardProps>(
  ({ plan, mobile }, ref) => {
    const highlight = !!plan.is_popular;
    const priceStr = formatPrice(plan.price, plan.currency);
    const mrpPriceStr = formatPrice(plan.mrp ?? 0, plan.currency);
    const durationStr = formatDuration(plan.duration_days, plan.is_lifetime);
    const features = normalizeFeatures(plan.features);
    const [showAll, setShowAll] = useState(false);
    const visibleFeatures = showAll ? features : features.slice(0, 10);
    const [showPopup, setShowPopup] = useState(false);


    if (mobile) {
      return (
        <div
          ref={ref}
          className={`w-[320px] snap-center flex-shrink-0 relative rounded-[6px] overflow-hidden bg-white shadow-xl  min-h-[480px] p-2  `}
        >
          {highlight && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[#09339B] text-[16px] font-bold px-4 py-1">
              Most Popular
            </div>
          )}

          <div
            className={`${highlight
              ? "bg-gradient-to-b from-[#01BAFF] to-[#09339B] text-white mt-8 rounded-[10px] p-4"
              : "bg-white p-6"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-[26px] font-semibold ${highlight ? "text-white" : "text-[#1F2937]"
                    }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-[21px] font-bold leading-tight mt-1 ${highlight ? "text-white" : "text-black"
                    }`}
                >
                    <del className=" mr-2">{mrpPriceStr}</del>
                  
                  {priceStr}
                </p>
                <span
                  className={`text-sm ${highlight ? "text-blue-100" : "text-gray-500"
                    }`}
                >
                  {durationStr}
                </span>
              </div>
              <button
                className={`px-5 py-2 rounded-[10px] text-[14px] font-medium whitespace-nowrap transition mt-14 ${highlight
                  ? "bg-white text-[#09339B] hover:bg-blue-50"
                  : "border border-[#09339B] text-[#09339B] hover:bg-blue-50"
                  }`}
                onClick={() => (window.location.href = `/plans/${plan.slug}`)}
              >
                Buy Membership
              </button>
            </div>
          </div>

          {!highlight && (
            <div className="-mx-6 h-px bg-black shadow-[0_6px_10px_rgba(0,0,0,0.35)]" />
          )}

           {features.length > 0 && (
          <div className="flex-1 bg-[#F6F9FF]">
            <ul className="px-6 py-6 space-y-4 text-gray-400 md:text-[14px] xl:text-[16px]">
              {visibleFeatures.map((f, i) => (
                <li key={i} className="flex gap-3">
                  <span>
                    <img
                      className="w-6 h-6 min-w-[24px] min-h-[24px] object-contain flex-shrink-0"
                      src="/images/tick.svg"
                      alt=""
                    />
                  </span>

                  <p className="text-md text-[#3a3c3e]">{f}</p>
                </li>
              ))}
            </ul>

           
            {features.length > 6 && (
              <div className="px-6 pb-6">
                <button
                  onClick={() => setShowPopup(true)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Read More
                </button>
              </div>
            )}
          </div>
        )}
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-xl">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-xl font-semibold">All Features</h3>

                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-500 hover:text-black text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[65vh]">
                  <ul className="space-y-4">
                    {features.map((f, i) => (
                      <li key={i} className="flex gap-3">
                        <span>
                          <img
                            className="w-6 h-6 min-w-[24px] min-h-[24px] object-contain flex-shrink-0"
                            src="/images/tick.svg"
                            alt=""
                          />
                        </span>

                        <p className="text-md text-[#3a3c3e]">{f}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
         
        </div>
      );
    }

    // Desktop card
    return (
    <div
      ref={ref}
      className="relative flex h-full flex-col rounded-2xl bg-white p-2"
    >
      {highlight && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap px-4 py-1 text-[18px] font-bold text-[#09339B] xl:text-[24px]">
          Most Popular
        </div>
      )}

      <div
        className={`flex-shrink-0 rounded-[12px] transition-all duration-300 ${
          highlight
            ? "mt-10 bg-gradient-to-b from-[#01BAFF] to-[#09339B] p-5 text-white shadow-[0_10px_25px_rgba(9,51,155,0.25)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(9,51,155,0.3)]"
            : "border border-[#E8EDF5] bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
        }`}
      >
        <div className="flex items-center justify-between gap-5">
          <div className="min-w-0">
            {/* Plan Name */}
            <h3
              className={`text-[26px] font-semibold tracking-[-0.3px] ${
                highlight ? "text-white" : "text-[#1F2937]"
              }`}
            >
              {plan.name}
            </h3>

            {/* Price */}
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <del
                className={`text-[24px] font-semibold leading-none ${
                  highlight ? "text-white/60" : "text-[#8C8C8C]"
                }`}
              >
                {mrpPriceStr}
              </del>

              <span
                className={`text-[30px] font-bold leading-none tracking-[-0.5px] xl:text-[32px] ${
                  highlight ? "text-white" : "text-black"
                }`}
              >
                {priceStr}
              </span>
            </div>

            {/* Duration */}
            <span
              className={`mt-2 block text-sm font-medium ${
                highlight ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {durationStr}
            </span>
          </div>

          {/* Buy Button */}
          <button
            className={`mt-10 shrink-0 rounded-[10px] px-4 py-2 text-[17px] font-medium whitespace-nowrap transition-all duration-200 xl:text-[20px] ${
              highlight
                ? "bg-white text-[#09339B] shadow-sm hover:bg-[#F3F7FF] hover:shadow-md"
                : "border border-[#09339B] bg-white text-[#09339B] hover:bg-[#09339B] hover:text-white"
            }`}
            onClick={() => (window.location.href = `/plans/${plan.slug}`)}
          >
            Buy Membership
          </button>
        </div>
      </div>


        {!highlight && <div className=" h-[1px] bg-black" />}
        {features.length > 0 && (
          <div className="flex-1 bg-[#F6F9FF]">
            <ul className="px-6 py-6 space-y-4 text-gray-400 md:text-[14px] xl:text-[16px]">
              {visibleFeatures.map((f, i) => (
                <li key={i} className="flex gap-3">
                  <span>
                    <img
                      className="w-6 h-6 min-w-[24px] min-h-[24px] object-contain flex-shrink-0"
                      src="/images/tick.svg"
                      alt=""
                    />
                  </span>

                  <p className="text-md text-[#3a3c3e]">{f}</p>
                </li>
              ))}
            </ul>

           
            {features.length > 10 && (
              <div className="px-6 pb-6">
                <button
                  onClick={() => setShowPopup(true)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Read More
                </button>
              </div>
            )}
          </div>
        )}

        {/* {features.length > 0 && (
          <ul className="px-6 py-6 space-y-4 text-gray-400 md:text-[14px] xl:text-[16px] flex-1 bg-[#F6F9FF] ">
            {features.map((f, i) => (
              <li key={i} className="flex gap-3">
                <span>
                  <img
                    className="w-6 h-6 min-w-[24px] min-h-[24px] object-contain flex-shrink-0"
                    src="/images/tick.svg"
                    alt=""
                  />

                </span>
                <p className="text-md"> {f}</p>
              </li>
            ))}
          </ul>
        )} */}
         {/* Popup Modal */}
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-xl">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-xl font-semibold">All Features</h3>

                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-500 hover:text-black text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[65vh]">
                  <ul className="space-y-4">
                    {features.map((f, i) => (
                      <li key={i} className="flex gap-3">
                        <span>
                          <img
                            className="w-6 h-6 min-w-[24px] min-h-[24px] object-contain flex-shrink-0"
                            src="/images/tick.svg"
                            alt=""
                          />
                        </span>

                        <p className="text-md text-[#3a3c3e]">{f}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
);

PlanCard.displayName = "PlanCard";
