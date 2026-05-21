import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Stats_marketing = ({ data }: Props) => {
  const { stats } = data;
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-[#0099FF] rounded-full py-6 px-8 flex flex-col md:flex-row justify-around items-center gap-6 text-center">
        <div>
          <p className="text-[28px] md:text-[36px] font-bold">{stats.people_coached}+</p>
          <p className="text-sm">People Coached</p>
        </div>
        <div>
          <p className="text-[28px] md:text-[36px] font-bold">{stats.preferred_by}+</p>
          <p className="text-sm">Prefered By AI Experts</p>
        </div>
        <div>
          <p className="text-[28px] md:text-[36px] font-bold">{stats.attended}+</p>
          <p className="text-sm">Attended</p>
        </div>
      </div>
      <p className="text-center mt-8 text-[18px] md:text-[24px] font-semibold uppercase">
        <span className="text-yellow-400">REGISTER</span> BEFORE TODAY&apos;S MIDNIGHT
      </p>
    </section>
  );
};

export default Stats_marketing;
