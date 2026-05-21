import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Bonus_marketing = ({ data }: Props) => {
  const items = data.bonusItems;
  if (!items.length) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-center text-[24px] md:text-[32px] font-semibold mb-2 uppercase">
        <span className="text-yellow-400">Register</span> before Today&apos;s Midnight
      </h2>
      <p className="text-center text-white mb-8">{data.bonusBannerText}</p>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {items.map((bonus, index) => (
          <div
            key={index}
            className="bg-[#fdf8ee] rounded-lg p-6 text-black relative"
          >
            <span className="absolute top-3 left-3 bg-black text-yellow-400 text-xs px-2 py-1 rounded">
              {bonus.label}
            </span>
            <div className="flex gap-4 mt-8 items-start">
              {bonus.icon ? (
                <img src={bonus.icon} alt="" className="w-10 h-10 object-contain" />
              ) : null}
              <p className="text-sm font-medium flex-1">{bonus.description}</p>
            </div>
            {bonus.worth ? (
              <span className="inline-block mt-4 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                {bonus.worth}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Bonus_marketing;
