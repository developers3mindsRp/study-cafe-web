import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Learning_marketing = ({ data }: Props) => {
  const cards = data.featureCards.length
    ? data.featureCards
    : data.learningBullets.map((text) => ({ icon: "/images/tick1.png", text }));

  if (!cards.length) return null;

  return (
    <section className="container mx-auto py-8 md:py-10 px-4 md:px-32">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-[#F3F4F6] border border-green-400 rounded-xl flex flex-col items-center justify-center text-center p-3 md:p-8 min-h-[140px] md:h-[200px] xl:h-auto hover:shadow-xl transition duration-300"
          >
            {card.icon ? (
              <img src={card.icon} alt="" className="w-10 h-10 md:w-16 md:h-16 mb-2 md:mb-6" />
            ) : null}
            <p className="font-semibold text-[13px] md:text-[18px] text-black leading-snug">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Learning_marketing;
