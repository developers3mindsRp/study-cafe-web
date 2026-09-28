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
  // The subtitle and the price used to be two separate blocks with only the
  // price clickable. They read as one offer, so they render as one highlighted
  // pill — and the whole red banner is the click target.
  const offerText = [data.ctaSubtitle, data.ctaPriceText]
    .map((t) => t?.trim())
    .filter(Boolean)
    .join(" · ");

  // Nothing to say and nothing to click — don't paint a bare red slab.
  if (!data.ctaTitle?.trim() && !offerText) return null;

  // Phrasing content only: this is rendered inside a <button>, where <h2>/<p>
  // would be invalid HTML.
  // The pill sits on a red banner, so its hover state must not be red. Hover is
  // gated to real pointers: Tailwind v3 applies :hover on touch too, and a tap
  // leaves it stuck on phones after the checkout modal closes.
  const inner = (
    <span className="relative z-10 block w-full text-center">
      {data.ctaTitle ? (
        <span className="block text-white text-[18px] md:text-[28px] xl:text-[40px] font-semibold leading-snug mb-3 md:mb-4 px-2 md:px-8">
          {data.ctaTitle}
        </span>
      ) : null}
      {offerText ? (
        <span className="inline-flex items-center justify-center gap-2 bg-white text-black text-[14px] md:text-[18px] xl:text-[22px] font-semibold px-5 py-2.5 md:px-7 md:py-3 rounded-[15px] border transition [@media(hover:hover)]:group-hover:bg-[#09339B] [@media(hover:hover)]:group-hover:text-white group-focus-visible:bg-[#09339B] group-focus-visible:text-white">
          {offerText}
        </span>
      ) : null}
    </span>
  );

  // min-height (not fixed height) so a long title grows the box instead of
  // spilling past the background image on narrow screens.
  const boxClass = `group flex w-full max-w-[935px] mx-auto min-h-[150px] md:min-h-[209px] items-center justify-center
bg-[url('/images/red-bg.png')] bg-cover bg-center bg-no-repeat
px-4 py-6 md:py-8 md:rounded-[10px] cursor-pointer transition hover:brightness-110`;

  return (
    <section
      className={`${hideOnMobile ? "hidden md:block" : "block"} container mx-auto my-8 md:my-0 md:mt-8`}
    >
      {onBuy ? (
        <button type="button" onClick={onBuy} className={boxClass}>
          {inner}
        </button>
      ) : (
        <Link href={data.checkoutUrl} className={boxClass}>
          {inner}
        </Link>
      )}
    </section>
  );
};

export default Expert_marketing;
