import Link from "next/link";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
  /** Opens the inline checkout; when absent the CTA navigates to data.checkoutUrl. */
  onBuy?: () => void;
}

const Expert_marketing = ({ data, onBuy }: Props) => {
  const ctaButton = (
    <button
      type="button"
      onClick={onBuy}
      className="bg-white text-black px-6 py-2 md:py-3 rounded-[15px] hover:bg-[#FF0000] border hover:text-white transition flex mx-auto items-center gap-2"
    >
      {data.ctaPriceText}
    </button>
  );

  return (
    <section
      className="relative max-w-[935px] h-[150px] md:h-[209px] flex items-center justify-center
bg-[url('/images/red-bg.png')] bg-cover bg-no-repeat
container mx-auto px-4 md:mt-8 md:rounded-[10px]"
    >
      <div className="relative z-10 text-center">
        <h2 className="text-white text-[20px] xl:text-[40px] font-semibold mb-2 px-8">
          {data.ctaTitle}
        </h2>
        <p className="text-white text-[18px] xl:text-[24px] font-normal max-w-xl mx-auto mb-4 px-8">
          {data.ctaSubtitle}
        </p>
        {onBuy ? ctaButton : <Link href={data.checkoutUrl}>{ctaButton}</Link>}
      </div>
    </section>
  );
};

export default Expert_marketing;