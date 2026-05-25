import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

/** e.g. "10000" → "10,000+" */
function formatStatValue(raw: string): string {
  const cleaned = raw.replace(/,/g, "").replace(/\+/g, "").trim();
  const n = Number(cleaned);
  if (Number.isFinite(n)) {
    return `${n.toLocaleString("en-IN")}+`;
  }
  return raw.includes("+") ? raw : `${raw}+`;
}

const STAT_ITEMS = [
  { key: "people_coached" as const, label: "People Coached" },
  { key: "preferred_by" as const, label: "Prefered By AI Experts" },
  { key: "attended" as const, label: "Attended" },
];

const Stats_marketing = ({ data }: Props) => {
  const { stats } = data;

  return (
    <section className=" py-4 md:py-4 px-4 md:w-[850px] mx-auto">
      <div className="mx-auto max-w-5xl rounded-full bg-[#09339B] px-6 py-6 md:px-14 md:py-8">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {STAT_ITEMS.map(({ key, label }) => (
            <div key={key} className="flex flex-col items-center justify-center px-1 text-center text-white sm:px-3">
              <p className="text-[22px] font-bold leading-none sm:text-[28px] md:text-[36px] lg:text-[40px]">
                {formatStatValue(stats[key])}
              </p>
              <p className="mt-2 text-[14px] font-normal leading-snug sm:text-xs md:text-[16px] md:mt-3">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 md:ml-12">
         <p className="text-2xl md:text-[40px] font-medium leading-snug  px-12 md:px-2 text-center mb-8">
          <span className="text-[#FFCC00]">REGISTER</span>{" "}
          <span className="text-white">BEFORE TODAY&apos;S MIDNIGHT</span>
        </p>

      </div>

     
    </section>
  );
};

export default Stats_marketing;
