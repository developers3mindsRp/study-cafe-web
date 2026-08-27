import type { ResolvedMarketingPage } from "@/lib/marketing/types";

const DEFAULT_ATTEND = [
  "Finance Professionals",
  "Lawyers",
  "Any Graduate",
  "Corporate Professionals",
  "Qualified CA/CS/CMA",
  "Any Student",
  "Tax Professionals",
  "Semi-qualified CA/CS/CMA",
  "Anyone Not Listed in Above List",
];

interface Props {
  data: ResolvedMarketingPage;
}

const Attend_marketing = ({ data }: Props) => {
  const items = data.whoCanAttend.length ? data.whoCanAttend : DEFAULT_ATTEND;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-[24px] md:text-[40px] uppercase text-center font-semibold">Who Can Attend?</h2>
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-12 mt-6 md:mt-8 scroll-mt-28">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white rounded-lg p-3 md:p-4 text-black"
          >
            <img src="/images/tick1.png" alt="" width={45} height={45} className="flex-shrink-0" />
            <span className="min-w-0 font-medium">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Attend_marketing;
