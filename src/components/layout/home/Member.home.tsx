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

export default function MembershipPricing({ bgImage }:any) {
  return (
    <section className="relative bg-white">
      {/* Top banner with gradient fade */}
      {bgImage && (
        <div
          className="absolute top-0 left-0 w-full h-[500px] bg-top bg-cover bg-no-repeat"
          style={{
            backgroundImage: ` url(${bgImage})`,
          }}
        />
      )}
        {/* Content wrapper */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h2 className={`text-3xl md:text-[40px] font-semibold text-center ${bgImage ? "text-[#121B31]" : "text-[#121B31]"}`}>
          Choose Your Membership
        </h2>
        <p className={`${bgImage ? "text-[#454545]" : "text-[#454545]"} mt-2 text-center text-[24px]`}>
          Get unlimited access to all courses and exclusive benefits
        </p>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 ">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`border rounded-xl p-8 shadow-md relative bg-white ${
                plan.highlight ? "border-[#09339B]" : "border-gray-300"
              }`}
            >
              {plan.highlight && (
                <span className="absolute top-4 right-4 bg-[#3FB3E7] text-white text-xs px-3 py-1 rounded-md">
                  Most Popular
                </span>
              )}

              <h3 className="text-[26px] font-normal text-[#252525] text-center">{plan.title}</h3>

              <p className="text-[54px] font-medium text-[#252525] mt-3 text-center">
                {plan.price}
              </p>
              <p className="text-[#6A7181] mt-1 text-[16px] text-center">{plan.duration}</p>

              <ul className="mt-6 space-y-3 text-center  text-[#AFAFAF]">
                {plan.features.map((feat, index) => (
                  <li key={index} className="flex items-start gap-3 text-[#6A7181] text-[16px]">
                   <img src="/images/tick.svg" alt="" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className="w-full mt-8 py-3 rounded-md border font-semibold transition bg-[#09339B] hover:bg-white text-white hover:text-[#09339B] border-[#09339B]"
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
