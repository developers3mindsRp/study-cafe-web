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
    <section className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 text-center text-black flex flex-col items-center gap-4"
          >
            {card.icon ? (
              <img src={card.icon} alt="" className="w-12 h-12 object-contain" />
            ) : null}
            <p className="font-semibold text-[14px]">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Learning_marketing;
