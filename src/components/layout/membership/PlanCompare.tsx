"use client";

const plans = ["Basic", "Advanced", "Premium"];

const features = [
  { name: "Ad-Free Content", values: [true, true, true] },
  { name: "File Downloads", values: [true, true, true] },
  { name: "Job Updates", values: [true, true, true] },
  { name: "WhatsApp Updates", values: [true, true, true] },
  { name: "Basic Courses", values: [true, true, true] },
  { name: "Advanced Courses", values: [false, true, true] },
  { name: "GST Return Training", values: [false, true, true] },
  { name: "Telegram Channel", values: [false, true, true] },
  { name: "Live Doubt Sessions", values: [false, false, true] },
  { name: "Priority Support", values: [false, false, true] },
  { name: "1-on-1 Mentorship", values: [false, false, true] },
  { name: "Career Guidance", values: [false, false, true] },
  { name: "Internship Opportunities", values: [false, false, true] },
  { name: "Exclusive Webinars", values: [false, false, true] },
  { name: "Lifetime Access", values: [false, false, true] },
];

const Check = () => <img src="/images/tick.png" alt="" className="mx-auto" />
const Cross = () => <img src="/images/cancel.png" alt="" className="mx-auto" />

export default function PlansComparisonTable() {
  return (
    <div className="w-full container px-4 mx-auto md:py-10">
      <h2 className="text-[30px] md:text-[40px] text-[#252525] font-bold text-center mb-2">Compare Plans</h2>
      <p className="text-center text-[#454545] mb-16 text-[18px] md:text-[24px]">
        See what's included in each membership tier
      </p>

    <div className="overflow-x-auto w-full scrollbar-hide">
  <table className="min-w-[700px] w-full border-collapse bg-white shadow-sm rounded-lg border-l border-gray-300">
    <thead>
      <tr className="bg-gray-100 text-[#252525] font-bold text-[20px]">
        <th className="py-3 px-4 text-center sticky left-0 bg-gray-100 z-10">
          Features
        </th>
        {plans.map((p) => (
          <th
            key={p}
            className="py-3 px-4 text-center border-r border-gray-300"
          >
            {p}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {features.map((feature, index) => (
        <tr key={index} className="border-b border-gray-300">
          <td className="py-3 font-medium text-[#252525] text-[16px] text-center
            sticky left-0 bg-white z-10 border-r border-gray-300">
            {feature.name}
          </td>

          {feature.values.map((v, i) => (
            <td
              key={i}
              className="py-3 px-4 text-center border-r border-gray-300"
            >
              {v ? <Check /> : <Cross />}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
}
