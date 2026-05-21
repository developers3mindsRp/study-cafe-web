import type { CoursePublicDetail, FAQ } from '@/types/models.types';
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

function parseLearnOutcomes(raw?: string | null): string[] {
  if (!raw?.trim()) return [];
  const lines = raw
    .split(/\n|<br\s*\/?>/i)
    .map((s) => s.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
  if (lines.length) return lines;
  return parseJsonArray<string>(raw, []);
}

function parseIncludesBonuses(raw?: string | null): ResolvedMarketingPage['bonusItems'] {
  const items = parseJsonArray<{ title?: string; description?: string; worth?: string; icon?: string; label?: string }>(
    raw,
    [],
  );
  return items.map((b, i) => ({
    label: b.label || `Bonus ${i + 1}`,
    icon: b.icon || '',
    description: b.description || b.title || '',
    worth: b.worth || '',
  }));
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
    ago: r.ago,
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

function formatPrice(course: CoursePublicDetail): string {
  const sale = course.sale_price;
  const price = course.price;
  const n = sale != null && sale !== '' ? Number(sale) : Number(price);
  if (!Number.isFinite(n)) return 'Rs 99';
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

export function resolveMarketingPage(
  payload: MarketingPagePublicPayload,
  globalFaqs: FAQ[],
): ResolvedMarketingPage {
  const { page, course, page_settings: ps } = payload;
  const meta: MarketingPageMeta = page.meta ?? {};
  const author = course.authors?.[0];

  const learningFromCourse = parseLearnOutcomes(course.learn_outcomes);
  const bonusesFromCourse = parseIncludesBonuses(course.includes_info);

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

  return {
    slug: page.slug,
    courseId: course.id,
    announcementText: meta.announcement_text || `Join now for just ${formatPrice(course)} Only`,
    headline: meta.headline || course.title || '',
    subheadline: meta.subheadline || course.brief_description || '',
    bonusBannerText: meta.bonus_banner_text || 'Unblock Bonuses Worth Rs. 12,000',
    masterclassDate: meta.masterclass_date || formatDateFromCourse(course.start_date),
    masterclassTime: meta.masterclass_time || '',
    ctaTitle: meta.cta_title || 'Become a Certified AI Expert',
    ctaSubtitle: meta.cta_subtitle || 'To grow your practice Now!',
    ctaPriceText: meta.cta_price_text || `Only at ${formatPrice(course)}`,
    increasedPriceText: meta.increased_price_text || 'Rs 2,000',
    countdownMinutes: meta.countdown_minutes ?? 15,
    checkoutUrl: meta.checkout_url || `/course/${encodeURIComponent(courseSlug)}`,
    videoUrl,
    youtubeEmbedUrl: youtubeEmbed(videoUrl, true),
    thumbnailUrl: course.thumbnail_url || '/images/c1.png',
    learningBullets:
      meta.learning_bullets?.filter(Boolean)?.length
        ? meta.learning_bullets!.filter(Boolean)
        : learningFromCourse,
    featureCards: (meta.feature_cards ?? [])
      .filter((c) => c.text)
      .map((c) => ({ icon: c.icon || '/images/tick1.png', text: c.text! })),
    bonusItems:
      meta.bonus_items?.filter((b) => b.description)?.length
        ? meta.bonus_items!.map((b, i) => ({
            label: b.label || `Bonus ${i + 1}`,
            icon: b.icon || '',
            description: b.description || '',
            worth: b.worth || '',
          }))
        : bonusesFromCourse,
    whoCanAttend: meta.who_can_attend?.filter(Boolean) ?? [],
    galleryImages: meta.gallery_images?.filter(Boolean) ?? [],
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
        [author?.role, author?.name].filter(Boolean) as string[],
      bioPoints:
        meta.trainer?.bio_points?.filter(Boolean) ??
        (author?.bio ? [author.bio] : []),
    },
    alumniLogos: (ps.alumni_logos ?? []).map((l, i) => ({
      image: (l as { image?: string }).image || `/images/brand_${(i % 6) + 1}.svg`,
      name: (l as { name?: string }).name,
    })),
    faqs,
    googleReviews: feedbackReviews,
  };
}
