import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Features_marketing = ({ data }: Props) => {
  const features = data.learningBullets;
  if (!features.length) return null;

  return (
    <div
      className="grid md:grid-cols-2 gap-6 mb-6 md:mb-12 mt-8 scroll-mt-28 container px-4 mx-auto"
      id="features"
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border bg-white p-4"
        >
          <img src="/images/tick1.png" alt="" width={45} height={45} />
          <p className="text-[14px] text-black font-semibold">{feature}</p>
        </div>
      ))}
    </div>
  );
};

export default Features_marketing;
