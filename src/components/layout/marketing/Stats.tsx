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
    <section className="container mx-auto px-4 py-10 md:py-14">
      <div className="mx-auto max-w-5xl rounded-full bg-[#1685FF] px-6 py-8 md:px-14 md:py-10">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {STAT_ITEMS.map(({ key, label }) => (
            <div key={key} className="flex flex-col items-center justify-center px-1 text-center text-white sm:px-3">
              <p className="text-[22px] font-bold leading-none sm:text-[28px] md:text-[36px] lg:text-[40px]">
                {formatStatValue(stats[key])}
              </p>
              <p className="mt-2 text-[10px] font-normal leading-snug sm:text-xs md:text-sm md:mt-3">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-base font-bold uppercase tracking-wide sm:text-lg md:mt-10 md:text-[22px] lg:text-[26px]">
        <span className="text-[#FFCC00]">REGISTER</span>{" "}
        <span className="text-white">BEFORE TODAY&apos;S MIDNIGHT</span>
      </p>
    </section>
  );
};

export default Stats_marketing;
