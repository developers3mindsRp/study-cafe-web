import type { CoursePublicDetail, FAQ, GoogleReview, MediaTestimonial } from '@/types/models.types';

export interface MarketingPageMeta {
  announcement_text?: string;
  headline?: string;
  subheadline?: string;
  bonus_banner_text?: string;
  masterclass_date?: string;
  masterclass_time?: string;
  cta_title?: string;
  cta_subtitle?: string;
  cta_price_text?: string;
  increased_price_text?: string;
  countdown_minutes?: number;
  use_global_faq?: boolean;
  use_course_faq?: boolean;
  checkout_url?: string;
  stats?: {
    people_coached?: string;
    preferred_by?: string;
    attended?: string;
  };
  learning_bullets?: string[];
  feature_cards?: { icon?: string; text?: string }[];
  bonus_items?: { label?: string; icon?: string; description?: string; title?: string; worth?: string }[];
  who_can_attend?: string[];
  gallery_images?: string[];
  video_url?: string;
  text_testimonials?: { quote?: string; name?: string; role?: string; rating?: number }[];
  video_testimonials?: { url?: string; thumbnail?: string }[];
  trainer?: {
    highlights?: string[];
    bio_points?: string[];
    image_url?: string;
  };
}

export interface MarketingPagePublicPayload {
  page: {
    id: number;
    course_id: number;
    slug: string;
    meta: MarketingPageMeta;
  };
  course: CoursePublicDetail;
  page_settings: {
    alumni_logos: { image?: string; url?: string; name?: string }[];
    featured_in_logos: { image?: string; url?: string; name?: string }[];
    gallery_images: string[];
  };
}

export interface ResolvedMarketingPage {
  slug: string;
  courseId: number;
  announcementText: string;
  headline: string;
  subheadline: string;
  bonusBannerText: string;
  masterclassDate: string;
  masterclassTime: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPriceText: string;
  increasedPriceText: string;
  countdownMinutes: number;
  checkoutUrl: string;
  videoUrl: string | null;
  youtubeEmbedUrl: string | null;
  thumbnailUrl: string;
  learningBullets: string[];
  featureCards: { icon: string; text: string }[];
  bonusItems: { label: string; image: string; title: string; worth: string }[];
  whoCanAttend: string[];
  galleryImages: string[];
  stats: { people_coached: string; preferred_by: string; attended: string };
  textTestimonials: { quote: string; name: string; role: string; rating: number }[];
  videoTestimonials: { url: string; thumbnail: string }[];
  trainer: {
    imageUrl: string;
    highlights: string[];
    bioPoints: string[];
  };
  alumniLogos: { image: string; name?: string }[];
  faqs: { q: string; a: string }[];
  googleReviews: { name: string; role: string; rating: number; text: string; ago?: string }[];
}

export interface MarketingPageProps {
  data: ResolvedMarketingPage;
  globalFaqs: FAQ[];
  globalGoogleReviews: GoogleReview[];
  mediaTestimonials: MediaTestimonial[];
}
