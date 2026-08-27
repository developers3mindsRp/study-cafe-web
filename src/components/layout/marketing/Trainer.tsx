import Image from "next/image";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Trainer_marketing = ({ data }: Props) => {
  const { trainer } = data;
  if (!trainer.bioPoints.length && !trainer.highlights.length) return null;

  return (
    <section className="">
      <div className="bg-[#000A1F] text-white text-center py-4 mb-6 md:mb-10">
        <h2 className="px-4 text-[24px] md:text-[40px] font-semibold tracking-wide uppercase">Know your Trainer</h2>
      </div>
      <div className="bg-white py-6 md:py-10">
        <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32  grid grid-cols-1 md:grid-cols-2  gap-8 md:gap-12 items-center">
          
          <div className="w-full flex justify-center">
              <div className="rounded-xl overflow-hidden w-full max-w-[500px]">
                <Image  src={trainer.imageUrl}
                  alt="Trainer"  width={400}
                  height={500} decoding="async" data-nimg="1" className="w-full h-auto object-cover" />
              </div>
          </div>
          <div>
            {/* One per row on phones: two columns leave ~100px for the label text. */}
            {trainer.highlights.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {trainer.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="border border-green-500 rounded-lg px-3 py-2 text-sm flex items-center gap-2"
                  >
                    <img src="/images/tick1.png" alt="" width={25} height={25} className="flex-shrink-0" />
                    <p className="min-w-0 text-[14px] xl:text-[16px] font-semibold text-black">{h}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <ul className="space-y-2 md:space-y-4 text-black text-[14px] xl:text-[18px] leading-relaxed list-disc pl-5">
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
