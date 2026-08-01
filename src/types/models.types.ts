export interface CurriculumSection {
  title: string;
  description?: string;
  duration?: string | number | null;
  videoId?: string;
}

export interface CurriculumDay {
  title: string;
  sections?: CurriculumSection[];
  files?: any[];
  total_duration?: number | null;
}

// User Model (auth-service / public site)
export interface User {
  id?: string;
  email?: string;
  name?: string;
  /** Short about text from users.bio */
  bio?: string | null;
  avatar?: string;
  /** e.g. user, admin, super_admin — from auth-service Role */
  role?: string;
  permissions?: string[];
  /** Active membership window in user_memberships (from /auth/me & login). */
  hasActiveMembership?: boolean;
  phone?: string | null;
  profession?: string | null;
  company?: string | null;
  designation?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  /** 15-character GSTIN (optional). */
  gst?: string | null;
  referralCode?: string | null;
  /** Explicit `false`: must complete email OTP verification (see `/verify-email`). */
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  bank_account_holder_name?: string | null;
  bank_account_number?: string | null;
  bank_ifsc?: string | null;
  bank_name?:string | null;
  bank_branch?: string | null;
}

// Course Model
export interface Course {
  id: string;
  title: string;
  /** Public course URL segment when present. */
  slug?: string | null;
  description: string;
  thumbnail: string;
  thumbnail_url?: string | null;
  price: number;
  discountPrice?: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  instructorId: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating?: number;
  totalStudents: number;
  totalLessons?: number;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}
export interface CertificateDetail  {
  certificate_url?: string;
  courseTitle?: string;
  studentName?: string;
  completionDate?: string;
  /** Per-course 4-digit serial (e.g. "0001"); null until assigned on first open. */
  certificateNumber?: string | null;
  // add more fields if API returns more
};

// Course Content/Curriculum
export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  duration: number;
  videoUrl?: string;
  order: number;
  isFree: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
}

export interface CourseDetail extends Course {
  modules: CourseModule[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  totalLessons: number;
}

/** Live cohort tied to a course purchase (from order-service my-purchases). */
export type EnrolledBatchPhase = 'upcoming' | 'live' | 'completed';

export interface EnrolledBatchInfo {
  batchId: number;
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  meetLink?: string | null;
  phase: EnrolledBatchPhase;
}

// Purchase/Enrollment Model
export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  purchaseDate: string;
  price: number;
  paymentMethod?: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  /** Order row batch lock-in (numeric id). */
  batchId?: number | null;
  /** Enriched batch schedule + phase for My Courses UI. */
  enrolledBatch?: EnrolledBatchInfo | null;
  /** Course access window end (ISO) — null means lifetime. */
  accessExpiresAt?: string | null;
  /** Whether course access is currently 'active' or 'expired'. */
  accessStatus?: 'active' | 'expired';
  /** Legacy WP workflow status carried from migration: 'publish' | 'draft' | null. */
  wpPostStatus?: string | null;
}

// User's purchased course with progress
export interface UserCourse extends Purchase {
  progress: number; // 0-100
  lastAccessedAt?: string;
  completedLessons: string[];
  completedAt?: string;
  /** True when course was admin-granted (no paid order). From GET /user/courses. */
  isAdminGranted?: boolean;
}

// Progress tracking
export interface LessonProgress {
  lessonId: string;
  courseId: string;
  userId: string;
  completed: boolean;
  watchTime: number; // in seconds
  lastWatchedAt: string;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  progress: number; // 0-100
  completedLessons: number;
  totalLessons: number;
  lastAccessedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginOtpCredentials {
  email: string;
  otp: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  profession: string;
  company?: string;
  designation?: string;
  city: string;
  state: string;
  country?: string;
  /** 15-character GSTIN (optional). */
  gst?: string;
}

/**
 * Checkout signup (/signup). Profession, city and state are asked for after
 * payment instead of before it — see RegisterData for the full /register form.
 */
export interface QuickRegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// User Profile Update
export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string | null;
  phone?: string;
  profession?: string;
  company?: string;
  designation?: string;
  city?: string;
  state?: string;
  country?: string;
  /** 15-character GSTIN (optional). */
  gst?: string;
  bank_account_holder_name?:string;
  bank_account_number?:string;
  bank_name?:string;
  bank_ifsc?:string;
  bank_branch?:string;
}

export interface UserSubscription {
  hasActiveMembership: boolean;
  membershipType?: string | null;
  startsAt?: string | null;
  expiresAt?: string | null;
}

export interface MembershipCourseItem {
  id: number;
  title: string;
  slug: string;
  brief_description?: string | null;
  thumbnail_url?: string | null;
  price?: number;
  sale_price?: number | null;
  category?: string | null;
  cat_slug?: string | null;
}

export interface MembershipPlanCourses {
  membershipId: number;
  planSlug: string;
  planName: string;
  startsAt: string | null;
  expiresAt: string | null;
  courses: MembershipCourseItem[];
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLearningHours: number;
  averageProgress: number;
}

// ========== Platform / Website (public) types ==========

/** Home page hero and above-the-fold content */
export interface HomeHero {
  title: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  badge?: string;
  description?: string;
}

/** Feature or value proposition for home page */
export interface HomeFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order?: number;
}

/** Stat or counter for home page */
export interface HomeStat {
  label: string;
  value: string | number;
  suffix?: string;
}

/** Aggregated home page data for landing */
export interface HomePageData {
  hero: HomeHero;
  features?: HomeFeature[];
  stats?: HomeStat[];
  testimonials?: Testimonial[];
  faqs?: FAQ[];
  updatedAt?: string;
}

/** Structured features for membership plans */
export interface MembershipFeatures {
  mrp: number;
  included: string[];
  excluded: string[];
}

/** A single feature row from the plan comparison table */
export interface ComparisonFeature {
  id: number;
  name: string;
  available: boolean;
}

/** Membership plan for pricing page */
export interface Membership {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  price: string | number;
  currency: string;
  duration_days: number;
  is_lifetime?: boolean;
  features: MembershipFeatures | string[];
  comparison_features?: ComparisonFeature[];
  is_popular?: boolean;
  sort_order: number;
}

/** FAQ item */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order?: number;
}/** Testimonial for home or testimonials page */
export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  order?: number;
}

/** Google Review (platform testimonials with rating) */
export interface GoogleReview {
  id: number | string;
  name: string;
  role: string;
  rating: number;
  text: string;
  ago?: string | null;
  avatarUrl?: string | null;
}

/** Video/image testimonial card (marketing section) */
export interface MediaTestimonial {
  id: number | string;
  title?: string | null;
  mediaType: 'video' | 'image';
  mediaUrl: string;
  videoUrl?: string | null;
  order?: number;
}

/** CMS page row from GET /platform/cms-pages/:slug (about, contact, privacy, etc.) */
export interface PageContent {
  slug: string;
  title: string | null;
  content: string | null;
  meta?: Record<string, unknown> | null;
  /** Legacy client fields (optional) */
  metaTitle?: string;
  metaDescription?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

/** SEO metadata for a page */
export interface SeoMetadata {
  pageSlug: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string | null;
  robots?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
}

/** Resolved "Also Read" / category suggestions */
export interface RelatedArticle {
  id: number;
  title: string;
  slug: string;
  thumbnail_url?: string | null;
  cover_image_url?: string | null;
  excerpt?: string | null;
  sub_heading?: string | null;
  author_name?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  description_preview?: string | null;
}

/** Paginated courses response from the server */
export interface PaginatedCourses {
  data: PublicCourse[];
  total: number;
  page: number;
  pageCount: number;
}

/** Course category (for filter tabs) */
export interface CourseCat {
  id: number;
  name: string;
  slug: string;
  is_featured?: boolean;
}


export interface Categories {
  id: number;
  name: string;
  slug: string;
  is_featured?: boolean;
}

/** Public course card */
export interface PublicCourse {
  id: number;
  title: string;
  slug?: string | null;
  brief_description?: string | null;
  price: string | number;
  sale_price?: string | number | null;
  thumbnail_url?: string | null;
  enrolled_count?: number;
  ratings?: string | number | null;
  language?: any;
  is_published?: boolean;
  duration?:any;
}

/** Recording inside a session */
export interface CourseRecording {
  id: number;
  url: string;
  source?: string;
  is_visible?: boolean;
}

/** A single session (day or sub-section of a day) within a batch */
export interface CourseSession {
  id: number;
  batch_id: number;
  day_number: number;
  /** 0-based index of the sub-section inside the day. 0 when the day has no subsections. */
  section_index?: number;
  /** Day-level title (same across all sub-sections of the same day). */
  title: string;
  /** Subsection title. Null when the day has no subsections. */
  section_title?: string | null;
  /** Duration in minutes (optional). */
  duration?: number | null;
  scheduled_at?: string | null;
  meet_link?: string | null;
  recordings: CourseRecording[];
}

/** A batch containing multiple sessions */
export interface CourseBatch {
  id: number;
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  meet_link?: string | null;
  created_at?: string;
  sessions: CourseSession[];
}

export interface CourseAuthorProfile {
  user_id: number;
  sort_order: number;
  name: string | null;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  image: string | null;
}

/** Full course detail returned by GET /courses/:id */
export interface CoursePublicDetail {
  id: number;
  title: string;
  short_title?: string | null;
  slug?: string | null;
  brief_description?: string | null;
  description?: string | null;
  curriculum?: CurriculumDay[] | string | null;
  learn_outcomes?: string | null;
  requirements?: string | null;
  terms_conditions?: string | null;
  price: string | number;
  sale_price?: string | number | null;
  enrolled_count?: number;
  ratings?: string | number | null;
  rating_users?: number;
  thumbnail_url?: string | null;
  youtube_url?: string | null;
  language?: string | null;
  course_type?: string | null;
  keywords?: string | null;
  faqs?: string | null;
  feedback?: string | null;
  includes_info?: string | null;
  /** JSON [{ image, title }] — banner "This course includes" (not bonuses). */
  course_includes?: string | null;
  certifications?: string | null;
  is_published?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
  authors?: CourseAuthorProfile[];
  featured_in_logos:any;
certificate_enabled:any;
  author_user_id?: number | null;
  author_name?: string | null;
  author_role?: string | null;
  author_bio?: string | null;
  author_image?: string | null;
  /** Computed: true when validity === 'lifetime'. */
  is_lifetime?: boolean;
  validity?: 'lifetime' | '1year';
  /** JSON string of DetailSection[] for the course detail page dynamic sections. */
  detail_sections?: string | null;
}

/** List / spotlight card (public); `access` reflects optional JWT + membership. */
export interface ArticleAccessMeta {
  can_read_full: boolean;
  reason: string;
  show_read_more_cta?: boolean;
  can_download?: boolean;
}

export interface BlogSpotlightArticleCard {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  sub_heading?: string | null;
  meta_description?: string | null;
  thumbnail_url?: string | null;
  cover_image_url?: string | null;
  author_id?: number | null;
  author_name?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  blog_access_tier?: 'free' | 'premium';
  access?: ArticleAccessMeta;
  categories?: { id: number; name: string; slug: string }[];
  /** Plain-text intro for hero (server-computed). */
  description_preview?: string;
}

export interface BlogSpotlightAuthor {
  id: number;
  display_name?: string | null;
  name?: string | null;
  profession?: string | null;
  designation?: string | null;
  company?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  profile_pic_url?: string | null;
  published_article_count?: number;
  bio?:any;
  linkedin?:string;
}

export interface BlogSpotlightTag {
  id: number;
  name: string;
  slug?: string | null;
  article_count: number;
}

export interface BlogSpotlightFeed {
  hero: BlogSpotlightArticleCard | null;
  recent_posts: BlogSpotlightArticleCard[];
  all_posts: BlogSpotlightArticleCard[];
  author: BlogSpotlightAuthor | null;
  author_recent_articles: BlogSpotlightArticleCard[];
  popular_tags: BlogSpotlightTag[];
}

/** Public article by slug (body = content; membership may truncate premium posts) */
export interface ArticleBySlug {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  sub_heading?: string | null;
  body: string;
  citation:any;
  thumbnail_url?: string | null;
  cover_image_url?: string | null;
  author_name?: string | number | null;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
  blog_access_tier?: 'free' | 'premium';
  access?: ArticleAccessMeta;
  /** Category-based suggestions when premium content is locked */
  related_articles?: RelatedArticle[];
  download_url?: string | null;
  toc?:any;
  whatsapp_link?:any;
  telegram_link?:any;
  google_news_url?:any;
  categories?:any;
  /** Article's own tags — used for clickable tag links on the detail page. */
  tags?: { id: number; name: string }[];
  /** Tax notification metadata (number, date, type). */
  notification?: ArticleNotification | null;
  /** Convenience mirrors of `notification` for simple field access. */
  noti_no?: string | null;
  noti_date?: string | null;
  type_of_tax?: string | null;
  /** True when any notification field is present. */
  has_notification?: boolean;
  embed_scripts?:any;
  article_types?:any;
  
  
}

/** Article tax notification block from `GET /platform/articles/:slug`. */
export interface ArticleNotification {
  noti_no: string | null;
  noti_date: string | null;
  type_of_tax: string | null;
}

/** CMS-managed promotional placements (stored in platform footer_data.site_display_ads) */
export interface SiteAdsSlot {
  image_url: string;
  link_url: string;
}

export interface SiteDisplayAds {
  popup: SiteAdsSlot & { enabled: boolean };
  article_detail_sidebar: SiteAdsSlot[];
  article_listing_sidebar: SiteAdsSlot;
  between_article: {
    after_paragraph_3: SiteAdsSlot;
    after_paragraph_6: SiteAdsSlot;
    below_featured_post: SiteAdsSlot;
  };
}

export interface FooterContent  {
  links: {
    title: string;
    url: string;
  }[];
  copyright: string;
  social?: {
    platform: string;
    url: string;
  }[];
};