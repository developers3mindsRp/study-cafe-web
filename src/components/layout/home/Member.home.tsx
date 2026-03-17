import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    price: "₹ 2,599",
    duration: "Yearly",
    highlight: false,
  },
  {
    name: "Ultimate",
    price: "₹ 8,999",
    duration: "Lifetime",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "₹6,999",
    duration: "Lifetime",
    highlight: false,
  },
];

export default function MembershipPricing() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    // Only run on client and only for mobile widths
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    const middle = Math.floor(plans.length / 2);
    const el = cardRefs.current[middle];
    if (el) {
      // center without animation so the page loads centered
      el.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    }
  }, []);

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

        {/* Prepare refs for mobile slider */}

        <div className="mt-10 md:mt-16">
          <div
            ref={containerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory md:hidden mt-4 pb-4  scrollbar-hide pt-8 pl-6 min-h-[540px]"
          >
            {/* Mobile slider: each card is snap-center */}
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                ref={(el) => { cardRefs.current[index] = el; }}

                className={`w-[320px] snap-center flex-shrink-0 relative rounded-[6px] overflow-hidden bg-white shadow-xl h-[480px] p-2 ${plan.highlight ? "scale-110 z-10" : ""
                  }`}>
                {/* MOST POPULAR */}
                {plan.highlight && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2  text-[#09339B] text-[16px] font-bold px-4 py-1">
                    {plan.badge}
                  </div>
                )}

                {/* HEADER */}
                <div
                  className={` ${plan.highlight
                    ? "bg-gradient-to-b from-[#01BAFF] to-[#09339B] text-white mt-8 rounded-[10px] p-4"
                    : "bg-white p-6"
                    }`}
                >
                  <div className="flex items-center justify-between ">
                    <div>
                      <h3
                        className={`text-[26px] font-semibold ${plan.highlight
                          ? "text-white"
                          : "text-[#1F2937]"
                          }`}
                      >
                        {plan.name}
                      </h3>

                      <p
                        className={`text-[21px] font-bold leading-tight mt-1 ${plan.highlight
                          ? "text-white"
                          : "text-black"
                          }`}
                      >
                        {plan.price}
                      </p>

                      <span
                        className={`text-sm ${plan.highlight
                          ? "text-blue-100"
                          : "text-gray-500"
                          }`}
                      >
                        {plan.duration}
                      </span>
                    </div>

                    <Link href="/plans/premium">
                      <button
                        className={`px-5 py-2 rounded-[10px] text-[12px] font-medium whitespace-nowrap transition mt-14 ${plan.highlight
                          ? "bg-white text-[#09339B] hover:bg-blue-50"
                          : "border border-[#09339B] text-[#09339B] hover:bg-blue-50"
                          }`}

                      >
                        Buy Membership
                      </button>
                    </Link>
                  </div>
                </div>
                {/* DIVIDER (hide on middle card) */}
                {!plan.highlight && (
                  <div className="-mx-6 h-px bg-black shadow-[0_6px_10px_rgba(0,0,0,0.35)]" />


                )}

                {/* FEATURES */}
                <ul className="px-6 py-6 space-y-4 text-gray-400 text-[12px] ">
                  {[...Array(5)].map((_, i) => (
                    <li key={i} className="flex gap-3">
                      <span>
                        <img src="/images/tick.svg" alt="" />
                      </span>
                      Lorem Ipsum is simply dummy text of the printing
                    </li>
                  ))}
                </ul>

              </div>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`
                flex flex-col h-full relative rounded-2xl overflow-hidden bg-white shadow-xl p-2
                ${plan.highlight ? "-mt-4 scale-105 z-10" : ""}
              `}
              >
                {/* MOST POPULAR */}
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[#09339B] text-[18px] xl:text-[24px] font-bold px-4 py-1 ">
                    {plan.badge}
                  </div>
                )}

                {/* HEADER */}
                <div className={`
                 ${plan.highlight
                    ? "bg-gradient-to-b from-[#01BAFF] to-[#09339B] text-white mt-10 rounded-[10px] p-4 "
                    : "bg-white p-6"
                  } flex-shrink-0
      `}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-[26px] font-semibold ${plan.highlight ? "text-white" : "text-[#1F2937]"
                          }`}
                      >
                        {plan.name}
                      </h3>

                      <p
                        className={`xl:text-[32px] font-bold leading-tight mt-1 ${plan.highlight ? "text-white" : "text-black"
                          }`}
                      >
                        {plan.price}
                      </p>

                      <span
                        className={`text-sm ${plan.highlight ? "text-blue-100" : "text-gray-500"
                          }`}
                      >
                        {plan.duration}
                      </span>
                    </div>

                    <button
                      className={`mt-14 px-5 py-2 rounded-[10px] xl:text-[20px] font-medium whitespace-nowrap transition ${plan.highlight
                        ? "bg-white text-[#09339B] hover:bg-blue-50"
                        : "border border-[#09339B] text-[#09339B] hover:bg-blue-50"
                        }`}
                      onClick={() => (window.location.href = "/plans/premium")}
                    >
                      Buy Membership
                    </button>
                  </div>
                </div>

                {/* DIVIDER (hide on middle card) */}
                {!plan.highlight && (
                  <div className="-mx-6 h-[1px] bg-black " />
                )}
                {/* FEATURES */}
                <ul className="px-6 py-6 space-y-4 text-gray-400 md:text-[14px] xl:text-[16px] flex-1 bg-[#F6F9FF]">
                  {[...Array(5)].map((_, i) => (
                    <li key={i} className="flex gap-3">
                      <span>
                        <img src="/images/tick.svg" alt="" />
                      </span>
                      Lorem Ipsum is simply dummy text of the printing
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
