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
      <h2 className="text-center text-[30px] md:text-[40px] mb-8 uppercase">Who Can Attend?</h2>
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white rounded-lg p-4 text-black"
          >
            <img src="/images/tick1.png" alt="" width={32} height={32} />
            <span className="font-medium">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Attend_marketing;
