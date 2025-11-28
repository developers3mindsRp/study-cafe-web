"use client";
import { FaCheckCircle } from "react-icons/fa";

const plans = [
  {
    title: "Basic",
    price: "₹1,299",
    duration: "Yearly",
    features: [
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
    ],
    highlight: false,
  },
  {
    title: "Advanced",
    price: "₹3,999",
    duration: "Yearly",
    features: [
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
    ],
    highlight: true,
  },
  {
    title: "Premium",
    price: "₹7,999",
    duration: "Lifetime",
    features: [
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
      "Lorem Ipsum is simply dummy text of the printing",
    ],
    highlight: false,
  },
];

export default function MembershipPricing() {
  return (
    <section className="bg-white py-16 ">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#121B31]">
          Choose Your Membership
        </h2>
        <p className="text-[#6A7181] mt-2">
          Get unlimited access to all courses and exclusive benefits
        </p>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`border rounded-xl p-8 shadow-md relative ${
                plan.highlight ? "border-[#09339B]" : "border-gray-300"
              }`}
            >
              {plan.highlight && (
                <span className="absolute top-4 right-4 bg-[#3FB3E7] text-white text-xs px-3 py-1 rounded-md">
                  Most Popular
                </span>
              )}

              <h3 className="text-[26px] font-medium text-[#252525]">{plan.title}</h3>

              <p className="text-[54px] font-medium text-[#252525] mt-3">
                {plan.price}
              </p>
              <p className="text-[#6A7181] mt-1 text-[16px]">{plan.duration}</p>

              <ul className="mt-6 space-y-3 text-left  text-[#AFAFAF]">
                {plan.features.map((feat, index) => (
                  <li key={index} className="flex items-start gap-3 text-[#6A7181] text-[16px]">
                   <img src="/images/tick.svg" alt="" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full mt-8 py-3 rounded-md border font-semibold transition 
                  ${
                    plan.highlight
                      ? "bg-[#09339B] text-white border-[#09339B] text-[20px]"
                      : "bg-white text-[#09339B] border-[#09339B] text-[20px]"
                  }`}
              >
                Buy Membership
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
