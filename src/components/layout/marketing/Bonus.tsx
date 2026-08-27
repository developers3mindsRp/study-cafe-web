import { resolveImageUrl } from '@/lib/parseCourseContent';
import type { ResolvedMarketingPage } from '@/lib/marketing/types';

interface Props {
  data: ResolvedMarketingPage;
}

const Bonus_marketing = ({ data }: Props) => {
  const items = data.bonusItems;
  if (!items.length) return null;

  const totalWorth = items.reduce((sum, b) => {
    const n = Number(String(b.worth).replace(/[^0-9.]/g, ''));
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-center text-[22px] sm:text-[28px] lg:text-[40px] font-bold px-2 sm:px-8 mt-4 sm:mt-8 uppercase">
        <span className="text-yellow-400">Register</span> before Today&apos;s Midnight
      </h2>
      <p className="text-center text-[16px] sm:text-[28px] lg:text-[24px] font-regular mt-4 sm:mt-8 px-2 sm:px-12">{data.bonusBannerText}</p>

      {/* <div className="flex items-center justify-center gap-2 mb-8">
        <img src="/images/gift.svg" alt="" className="w-5 h-5" />
        <span className="text-sm text-white/90">Exclusive bonuses</span>
      </div> */}

      {totalWorth > 0 ? (
        <p className="text-center text-white text-lg md:text-2xl font-bold mb-8">
          Register fast to unlock bonuses worth {totalWorth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-0 sm:px-8 xl:px-32 mt-8 sm:mt-12 pb-8 sm:pb-12">
        {items.map((bonus, index) => (
          <div
            key={index}
            className="relative bg-[#FEF9F1] border border-[#F59F0A] rounded-lg p-4 md:p-6 text-black shadow-sm"
          >
            <span className="absolute -top-3 left-4 text-sm font-semibold bg-black text-[#FFCC33] px-3 py-1 rounded-[10px]">
              {bonus.label}
            </span>
            <div className="flex items-start gap-3 mt-6">
              {bonus.image ? (
                <img
                  src={resolveImageUrl(bonus.image)}
                  alt=""
                  className="w-10 h-10 md:w-11 md:h-11 object-contain flex-shrink-0"
                />
              ) : (
                <img src="/images/gift.svg" alt="" className="w-10 h-10 flex-shrink-0" />
              )}
              <p
                className="text-sm md:text-base font-semibold text-left flex-1"
                dangerouslySetInnerHTML={{ __html: bonus.title }}
              />
            </div>
            {bonus.worth ? (
              <span className="inline-block mt-6 text-base font-bold text-green-700 bg-green-100 px-3 py-2 rounded-[10px]">
                Worth {bonus.worth}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Bonus_marketing;
