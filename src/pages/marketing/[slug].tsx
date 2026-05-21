import { GetServerSideProps } from 'next';
import Head from 'next/head';
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
  return (
    <>
      <Head>
        <title>{data.headline} | StudyCafe</title>
        <meta name="description" content={data.subheadline} />
      </Head>
      <div className="bg-[#000A1F] text-white">
        <BannerSection_digital data={data} />
        <Expert_marketing data={data} />
        <Features_marketing data={data} />
        <Stats_marketing data={data} />
        <Expert_marketing data={data} />
        <Learning_marketing data={data} />
        <Timer_marketing data={data} />
        <Expert_marketing data={data} />
        <Bonus_marketing data={data} />
        <Attend_marketing data={data} />
        <Reviews_marketing data={data} />
        <Testimonials_marketing items={mediaTestimonials} />
        <Expert_marketing data={data} />
        <Alumini_marketing data={data} />
        <Trainer_marketing data={data} />
        <Gallery_marketing data={data} />
        <Expert_marketing data={data} />
        <Google_review data={data} globalReviews={globalGoogleReviews} />
        <Faqs_marketing data={data} faqs={globalFaqs} />
        <StickyCTA data={data} />
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
