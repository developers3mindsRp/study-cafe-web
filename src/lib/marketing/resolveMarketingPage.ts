import type { CoursePublicDetail, FAQ } from '@/types/models.types';
import {
  parseGalleryImages,
  parseIncludesInfo,
  parseListField,
  type StructuredBonusItem,
} from '@/lib/parseCourseContent';
import type {
  MarketingPageMeta,
  MarketingPagePublicPayload,
  ResolvedMarketingPage,
} from './types';

function parseJsonArray<T>(raw?: string | null, fallback: T[] = []): T[] {
  if (!raw?.trim()) return fallback;
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : fallback;
  } catch {
    return fallback;
  }
}

function parseCourseFaqs(raw?: string | null): { q: string; a: string }[] {
  const items = parseJsonArray<{ question?: string; answer?: string; q?: string; a?: string }>(raw, []);
  return items
    .map((f) => ({
      q: f.question || f.q || '',
      a: f.answer || f.a || '',
    }))
    .filter((f) => f.q);
}

function parseFeedback(raw?: string | null): ResolvedMarketingPage['googleReviews'] {
  const items = parseJsonArray<{
    name?: string;
    role?: string;
    rating?: number;
    review?: string;
    text?: string;
    ago?: string;
  }>(raw, []);
  return items.map((r) => ({
    name: r.name || 'Student',
    role: r.role || '',
    rating: Math.min(5, Math.max(1, r.rating ?? 5)),
    text: r.review || r.text || '',
    ago: r.ago ?? null,
  }));
}

function youtubeEmbed(url?: string | null, autoplay = true): string | null {
  if (!url?.trim()) return null;
  let id = '';
  if (url.includes('youtu.be/')) {
    id = url.split('youtu.be/')[1]?.split(/[?&#]/)[0] ?? '';
  } else if (url.includes('youtube.com')) {
    const m = url.match(/[?&]v=([^&]+)/);
    id = m?.[1] ?? url.split('/embed/')[1]?.split(/[?&#]/)[0] ?? '';
  }
  if (!id) return null;
  const params = autoplay ? '?autoplay=1&mute=1&playsinline=1&rel=0' : '';
  return `https://www.youtube.com/embed/${id}${params}`;
}

function toPrice(val: string | number | null | undefined): number | null {
  if (val == null || val === '') return null;
  const n = Number(val);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * What the inline checkout charges (pre-GST) and the MRP to strike through.
 * Campaign price off the page meta wins; the course's own pricing is the fallback —
 * mirrors order-service's resolveMarketingCampaignPrice so the summary and the
 * charge can't disagree.
 */
function resolvePricing(meta: MarketingPageMeta, course: CoursePublicDetail): {
  salePrice: number;
  listPrice: number | null;
} {
  const campaignSale = toPrice(meta.sale_price);
  const courseSale = toPrice(course.sale_price);
  const courseList = toPrice(course.price);

  const salePrice = campaignSale ?? courseSale ?? courseList ?? 0;
  const listPrice = campaignSale != null ? toPrice(meta.amount) : courseSale != null ? courseList : null;
  return {
    salePrice,
    listPrice: listPrice != null && listPrice > salePrice ? listPrice : null,
  };
}

function formatPriceValue(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return 'Rs 99';
  return `Rs ${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function formatDateFromCourse(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${days[d.getDay()]}`;
  } catch {
    return '';
  }
}

function mergeUniqueStrings(...groups: string[][]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const group of groups) {
    for (const line of group) {
      const key = line.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(key);
    }
  }
  return out;
}

function mapMetaBonusItems(
  meta: MarketingPageMeta,
): ResolvedMarketingPage['bonusItems'] {
  return (meta.bonus_items ?? [])
    .map((b, i) => {
      const title = String(b.description ?? b.title ?? '').trim();
      if (!title) return null;
      return {
        label: b.label || `Bonus ${i + 1}`,
        image: b.icon || '',
        title,
        worth: b.worth || '',
      };
    })
    .filter((b): b is ResolvedMarketingPage['bonusItems'][number] => b != null);
}

function mapStructuredBonuses(items: StructuredBonusItem[]): ResolvedMarketingPage['bonusItems'] {
  return items.map((b) => ({
    label: b.label,
    image: b.image,
    title: b.title,
    worth: b.worth,
  }));
}

export function resolveMarketingPage(
  payload: MarketingPagePublicPayload,
  globalFaqs: FAQ[],
): ResolvedMarketingPage {
  const { page, course, page_settings: ps } = payload;
  const meta: MarketingPageMeta = page.meta ?? {};
  const author = course.authors?.[0];

  const learningFromCourse = parseListField(course.learn_outcomes);
  const { benefitLines, structuredBonuses } = parseIncludesInfo(course.includes_info);

  const videoUrl = meta.video_url?.trim() || course.youtube_url || null;
  const courseSlug = course.slug || page.slug;

  const useCourseFaq = meta.use_course_faq === true;
  const useGlobalFaq = meta.use_global_faq !== false;
  const courseFaqs = parseCourseFaqs(course.faqs);
  const faqsFromGlobal = globalFaqs.map((f) => ({
    q: f.question,
    a: typeof f.answer === 'string' ? f.answer.replace(/<[^>]+>/g, ' ').trim() : String(f.answer ?? ''),
  }));

  let faqs: { q: string; a: string }[] = [];
  if (useCourseFaq && courseFaqs.length) faqs = courseFaqs;
  else if (useGlobalFaq && faqsFromGlobal.length) faqs = faqsFromGlobal;
  else if (courseFaqs.length) faqs = courseFaqs;
  else faqs = faqsFromGlobal;

  const feedbackReviews = parseFeedback(course.feedback);

  const metaBullets = meta.learning_bullets?.filter(Boolean) ?? [];
  const learningBullets =
    metaBullets.length > 0
      ? metaBullets
      : mergeUniqueStrings(learningFromCourse, benefitLines);

  const metaStructured = mapMetaBonusItems(meta);
  const bonusItems =
    metaStructured.length > 0 ? metaStructured : mapStructuredBonuses(structuredBonuses);

  const bonusesTotalWorth = bonusItems.reduce((sum, b) => {
    const n = Number(String(b.worth).replace(/[^0-9.]/g, ''));
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);

  // Price labels default from the same number the checkout charges, so the page's
  // "Rs 99" copy and the actual charge can't drift apart.
  const { salePrice, listPrice } = resolvePricing(meta, course);
  const salePriceText = formatPriceValue(salePrice);

  return {
    slug: page.slug,
    courseId: course.id,
    courseTitle: course.title || '',
    hasCustomCheckoutUrl: !!meta.checkout_url?.trim(),
    salePrice,
    listPrice,
    announcementText: meta.announcement_text || `Join now for just ${salePriceText} Only`,
    headline: meta.headline || course.title || '',
    subheadline: meta.subheadline || course.brief_description || '',
    bonusBannerText:
      meta.bonus_banner_text ||
      (bonusesTotalWorth > 0
        ? `Unblock Bonuses Worth Rs. ${bonusesTotalWorth.toLocaleString('en-IN')}`
        : 'Unblock Bonuses Worth Rs. 12,000'),
    masterclassDate: meta.masterclass_date || formatDateFromCourse(course.start_date),
    masterclassTime: meta.masterclass_time || '',
    registerBeforeText: meta.register_before_text?.trim() || 'Register Before Tonight to',
    masterclassLabel: meta.masterclass_label?.trim() || 'Masterclass is Starting on',
    // Defaults to shown so existing pages render unchanged until an admin turns it off.
    showPlayIcon: meta.show_play_icon !== false,
    ctaTitle: meta.cta_title || 'Become a Certified AI Expert',
    ctaSubtitle: meta.cta_subtitle || 'To grow your practice Now!',
    ctaPriceText: meta.cta_price_text || `Only at ${salePriceText}`,
    increasedPriceText: meta.increased_price_text || 'Rs 2,000',
    countdownMinutes: meta.countdown_minutes ?? 15,
    checkoutUrl: meta.checkout_url || `/course/${encodeURIComponent(courseSlug)}`,
    videoUrl,
    youtubeEmbedUrl: youtubeEmbed(videoUrl, true),
    thumbnailUrl: course.thumbnail_url || '/images/c1.png',
    learningBullets,
    featureCards: (meta.feature_cards ?? [])
      .filter((c) => c.text)
      .map((c) => ({ icon: c.icon || '/images/tick1.png', text: c.text! })),
    bonusItems,
    whoCanAttend: meta.who_can_attend?.filter(Boolean) ?? [],
    galleryImages: (() => {
      const fromSettings = parseGalleryImages(ps.gallery_images);
      const fromMeta = meta.gallery_images?.filter(Boolean) ?? [];
      return fromSettings.length > 0 ? fromSettings : fromMeta;
    })(),
    stats: {
      people_coached: meta.stats?.people_coached || String(course.enrolled_count || '10000'),
      preferred_by: meta.stats?.preferred_by || '150',
      attended: meta.stats?.attended || String(course.enrolled_count || '8500'),
    },
    textTestimonials: (meta.text_testimonials ?? []).map((t) => ({
      quote: t.quote || '',
      name: t.name || '',
      role: t.role || '',
      rating: t.rating ?? 5,
    })),
    videoTestimonials: (meta.video_testimonials ?? []).map((v) => ({
      url: v.url || '',
      thumbnail: v.thumbnail || course.thumbnail_url || '/images/c1.png',
    })),
    trainer: {
      imageUrl: meta.trainer?.image_url || author?.image || '/images/trainer.png',
      highlights:
        meta.trainer?.highlights?.filter(Boolean) ??
        ([author?.role, author?.name].filter(Boolean) as string[]),
      bioPoints:
        meta.trainer?.bio_points?.filter(Boolean) ??
        (author?.bio ? [author.bio] : []),
    },
    // Admin stores each logo as `logo_url` (see CourseDetail); older rows may use
    // `image`/`image_url`. Reading the wrong key here used to drop every real logo
    // into a 6-image placeholder cycle, so pages with 7+ alumni showed repeats.
    alumniLogos: (ps.alumni_logos ?? []).map((l, i) => {
      const raw = l as { logo_url?: string; image?: string; image_url?: string; url?: string; name?: string };
      const image = (raw.logo_url || raw.image || raw.image_url || raw.url || '').trim();
      return {
        image: image || `/images/brand_${(i % 6) + 1}.svg`,
        name: raw.name,
      };
    }),
    faqs,
    googleReviews: feedbackReviews,
  };
}
