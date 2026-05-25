import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Alumini_marketing = ({ data }: Props) => {
  const logos = data.alumniLogos;
  if (!logos.length) return null;

  return (
    <section className="bg-[url('/images/alumini-bg.png')] bg-no-repeat bg-cover py-3 md:py-12 px-4 md:px-8 pb-8 md:pb-20 mb-8 mt-12">
      <h2 className="text-center text-white text-[24px] md:text-[32px] font-semibold mb-8">
        Our Alumni at Leading Companies
      </h2>
      <div className="flex flex-wrap justify-center gap-4 px-4 max-w-5xl mx-auto">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 w-[120px] h-[60px] flex items-center justify-center"
          >
            <img
              src={logo.image}
              alt={logo.name || "Partner"}
              className="max-h-10 max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Alumini_marketing;
