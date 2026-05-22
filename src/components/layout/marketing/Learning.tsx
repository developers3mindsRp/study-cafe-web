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
    <section className="py-10 container md:px-32 mx-auto ">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 container px-4 mx-auto ">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-[#F3F4F6] border border-green-400 rounded-xl  flex flex-col items-center justify-center text-center  p-2 md:p-8 aspect-[1.2/1] h-[150px] md:h-[200px] xl:h-auto hover:shadow-xl transition duration-300"
          >
            {card.icon ? (
              <img src={card.icon} alt="" className="w-14 h-14 md:w-16 md:h-16 mb-6" />
            ) : null}
            <p className="font-semibold text-[12px] md:text-[18px] text-black leading-snug">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Learning_marketing;
