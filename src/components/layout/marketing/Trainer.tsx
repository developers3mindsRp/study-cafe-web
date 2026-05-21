import Image from "next/image";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Trainer_marketing = ({ data }: Props) => {
  const { trainer } = data;
  if (!trainer.bioPoints.length && !trainer.highlights.length) return null;

  return (
    <section>
      <div className="bg-[#000A1F] py-6">
        <h2 className="text-center text-[30px] md:text-[40px] uppercase">Know your Trainer</h2>
      </div>
      <div className="bg-white text-black">
        <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 items-start">
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src={trainer.imageUrl}
              alt="Trainer"
              width={400}
              height={500}
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
          <div>
            {trainer.highlights.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {trainer.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="border border-green-500 rounded-lg px-3 py-2 text-sm flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {h}
                  </div>
                ))}
              </div>
            ) : null}
            <ul className="list-disc pl-5 space-y-3 text-[15px] leading-relaxed">
              {trainer.bioPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trainer_marketing;
