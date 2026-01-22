import { Check } from "lucide-react";
import { useEffect, useRef } from "react";

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
      className="w-full py-18 md:py-24 bg-cover bg-center pb-20"
      style={{ backgroundImage: "url('/images/member_bg.png')" }}
    >
      <div className="max-w-7xl mx-auto md:px-4 pt-4">
        <h2 className="text-center text-white text-[30px] md:text-[40px] font-semibold ">
          Choose Your <br className="block md:hidden" /> Membership
        </h2>
        <p className="text-center text-blue-100 mt-2 text-[16px] md:text-[24px]">
          Get unlimited access to all courses and <br /> exclusive benefits
        </p>

        {/* Prepare refs for mobile slider */}
        {/* Note: slider visible on small screens, hidden on md+ */}
        <div className="mt-16">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden mt-4 pb-4  scrollbar-hide"
          >
            {/* Mobile slider: each card is snap-center */}
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                ref={(el) => { cardRefs.current[index] = el; }}

                className={`w-[320px] snap-center flex-shrink-0 relative rounded-2xl overflow-hidden bg-white shadow-xl h-[480px] p-2 ${plan.highlight ? "scale-105 z-10" : ""
                  }`}>
                {/* MOST POPULAR */}
                {plan.highlight && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2  text-[#09339B] text-[13px] font-bold px-4 py-1">
                    {plan.badge}
                  </div>
                )}

                {/* HEADER */}
                <div
                  className={`p-6 ${plan.highlight
                      ? "bg-gradient-to-b from-[#01BAFF] to-[#09339B] text-white mt-10"
                      : "bg-white"
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

                    <button
                      className={`px-5 py-2 rounded-lg text-[10px] font-medium whitespace-nowrap transition mt-14 ${plan.highlight
                          ? "bg-white text-[#09339B] hover:bg-blue-50"
                          : "border border-[#09339B] text-[#09339B] hover:bg-blue-50"
                        }`}
                    >
                      Buy Membership
                    </button>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-black " />

                {/* FEATURES */}
                <ul className="px-6 py-6 space-y-4 text-gray-400 text-[10px]">
                  {[...Array(5)].map((_, i) => (
                    <li key={i} className="flex gap-3 ">
                      <span className="">
                        <img src="/images/tick.svg" alt="" className="" />
                      </span>
                      Lorem Ipsum is simply dummy text of the printing
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Desktop grid (unchanged) */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl overflow-hidden bg-white shadow-xl min-h-[520px] p-2  ${plan.highlight ? "scale-105 z-10" : ""
                  }`}
              >
                {/* MOST POPULAR */}
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2  text-[#09339B] text-[24px] font-bold px-4 py-1">
                    {plan.badge}
                  </div>
                )}

                {/* HEADER */}
                <div
                  className={`p-6 ${plan.highlight
                      ? "bg-gradient-to-b from-[#01BAFF] to-[#09339B] text-white mt-10"
                      : "bg-white"
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
                        className={`text-[32px] font-bold leading-tight mt-1 ${plan.highlight
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

                    <button
                      className={`px-5 py-2 rounded-lg text-[20px] font-medium whitespace-nowrap transition mt-14 ${plan.highlight
                          ? "bg-white text-[#09339B] hover:bg-blue-50"
                          : "border border-[#09339B] text-[#09339B] hover:bg-blue-50"
                        }`}
                    >
                      Buy Membership
                    </button>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-black " />

                {/* FEATURES */}
                <ul className="px-6 py-6 space-y-4 text-gray-400 text-[16px]">
                  {[...Array(5)].map((_, i) => (
                    <li key={i} className="flex gap-3 ">
                      <span className="">
                        <img src="/images/tick.svg" alt="" className="" />
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
