import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { runWithServerApiBase } from '@/lib/serverApiContext';
import { resolveMarketingPage } from '@/lib/marketing/resolveMarketingPage';
import type { MarketingPageProps } from '@/lib/marketing/types';
import type { MediaTestimonial } from '@/types/models.types';
import {
  getFaq,
  getGoogleReviews,
  getMarketingPageBySlug,
  getTestimonials,
} from '@/services/platform.service';
import BannerSection_digital from '@/components/layout/marketing/BannerSection';
import Expert_marketing from '@/components/layout/marketing/Expert';
import Features_marketing from '@/components/layout/marketing/Features';
import Stats_marketing from '@/components/layout/marketing/Stats';
import Learning_marketing from '@/components/layout/marketing/Learning';
import Timer_marketing from '@/components/layout/marketing/Timer';
import Bonus_marketing from '@/components/layout/marketing/Bonus';
import Attend_marketing from '@/components/layout/marketing/Attend';
import Reviews_marketing from '@/components/layout/marketing/Reviews';
import Testimonials_marketing from '@/components/layout/marketing/Testimonial';
import Alumini_marketing from '@/components/layout/marketing/Alumini';
import Gallery_marketing from '@/components/layout/marketing/Gallery';
import Google_review from '@/components/layout/marketing/Google_review';
import Faqs_marketing from '@/components/layout/marketing/Faqs';
import Trainer_marketing from '@/components/layout/marketing/Trainer';
import StickyCTA from '@/components/layout/marketing/Stickybar';
import MarketingCheckoutModal from '@/components/layout/marketing/MarketingCheckoutModal';

function metaVideoFallback(
  videoTestimonials: { url?: string; thumbnail?: string }[],
): MediaTestimonial[] {
  return videoTestimonials
    .filter((v) => v.thumbnail || v.url)
    .map((v, i) => ({
      id: `meta-${i}`,
      mediaType: 'video' as const,
      mediaUrl: v.thumbnail || v.url || '',
      videoUrl: v.url || null,
    }));
}

export default function MarketingPage({
  data,
  globalFaqs,
  globalGoogleReviews,
  mediaTestimonials,
}: MarketingPageProps) {
  // Inline checkout: Buy Now opens the quick-register + payment overlay right here
  // instead of routing ad traffic to the course page's login wall. Pages whose admin
  // set a custom checkout URL keep navigating (data.hasCustomCheckoutUrl).
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const openCheckout = useCallback(() => setCheckoutOpen(true), []);
  const onBuy = data.hasCustomCheckoutUrl ? undefined : openCheckout;

  // Hide OneSignal's notification bell here — it parks itself in the bottom-right
  // corner, on top of the sticky Buy CTA, and a permission prompt is the wrong ask
  // of paid ad traffic. The SDK injects the bell into <body>, so a CSS guard keyed
  // off this attribute catches it whenever it loads. Cleared on unmount so the
  // bell returns when a visitor navigates on to the rest of the site.
  useEffect(() => {
    document.body.dataset.onesignalBell = 'off';
    return () => {
      delete document.body.dataset.onesignalBell;
    };
  }, []);

  return (
    <>
      <Head>
        <title>{data.headline} | StudyCafe</title>
        <meta name="description" content={data.subheadline} />
      </Head>
      {/* pb-44 keeps the last section clear of the fixed mobile StickyCTA (~140px tall). */}
      <div className="bg-[#000A1F] text-white pb-44 md:pb-0">
        <BannerSection_digital data={data} onBuy={onBuy} />
        <Expert_marketing data={data} onBuy={onBuy} />
        <Features_marketing data={data} />
        <Stats_marketing data={data} />
        <Expert_marketing data={data} onBuy={onBuy} hideOnMobile />
        <Learning_marketing data={data} />
        <Timer_marketing data={data} />
        <Expert_marketing data={data} onBuy={onBuy} />
        <Bonus_marketing data={data} />
        <Attend_marketing data={data} />
        <Reviews_marketing data={data} />
        <Testimonials_marketing items={mediaTestimonials} />
        <Expert_marketing data={data} onBuy={onBuy} hideOnMobile />
        <Alumini_marketing data={data} />
        <Trainer_marketing data={data} />
        <Gallery_marketing data={data} />
        <Expert_marketing data={data} onBuy={onBuy} />
        <Google_review data={data} globalReviews={globalGoogleReviews} />
        <Faqs_marketing data={data} faqs={globalFaqs} />
        <StickyCTA data={data} onBuy={onBuy} />
        <MarketingCheckoutModal
          data={data}
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<MarketingPageProps> = async (ctx) => {
  return runWithServerApiBase(ctx.req, async () => {
    const slug = ctx.params?.slug as string;
    if (!slug) return { notFound: true };

    const payload = await getMarketingPageBySlug(slug);
    if (!payload?.course) return { notFound: true };

    const [globalFaqs, globalGoogleReviews, platformMedia] = await Promise.all([
      getFaq().catch(() => []),
      getGoogleReviews().catch(() => []),
      getTestimonials().catch(() => []),
    ]);

    const data = resolveMarketingPage(payload, globalFaqs);
    const mediaTestimonials =
      platformMedia.length > 0
        ? platformMedia
        : metaVideoFallback(data.videoTestimonials);

    return {
      props: {
        data,
        globalFaqs,
        globalGoogleReviews,
        mediaTestimonials,
      },
    };
  });
};
