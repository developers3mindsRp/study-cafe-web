import Link from "next/link";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
  /** Opens the inline checkout; when absent the CTA navigates to data.checkoutUrl. */
  onBuy?: () => void;
  /**
   * Phones already carry the sticky bottom CTA, so the page hides some of the
   * five inline repeats there to keep the content readable. Desktop shows all.
   */
  hideOnMobile?: boolean;
}

const Expert_marketing = ({ data, onBuy, hideOnMobile = false }: Props) => {
  const ctaButton = (
    <button
      type="button"
      onClick={onBuy}
      className="bg-white text-black text-[14px] md:text-base px-5 py-2 md:px-6 md:py-3 rounded-[15px] hover:bg-[#FF0000] border hover:text-white transition flex mx-auto items-center gap-2"
    >
      {data.ctaPriceText}
    </button>
  );

  // min-height (not fixed height) so a long title grows the box instead of
  // spilling past the background image on narrow screens.
  return (
    <section
      className={`${hideOnMobile ? "hidden md:flex" : "flex"} relative max-w-[935px] min-h-[150px] md:min-h-[209px] items-center justify-center
bg-[url('/images/red-bg.png')] bg-cover bg-center bg-no-repeat
container mx-auto px-4 py-5 md:py-8 md:mt-8 md:rounded-[10px]`}
    >
      <div className="relative z-10 text-center w-full">
        <h2 className="text-white text-[18px] md:text-[28px] xl:text-[40px] font-semibold leading-snug mb-1 md:mb-2 px-2 md:px-8">
          {data.ctaTitle}
        </h2>
        <p className="text-white text-[14px] md:text-[18px] xl:text-[24px] font-normal max-w-xl mx-auto mb-3 md:mb-4 px-2 md:px-8">
          {data.ctaSubtitle}
        </p>
        {onBuy ? ctaButton : <Link href={data.checkoutUrl}>{ctaButton}</Link>}
      </div>
    </section>
  );
};

export default Expert_marketing;