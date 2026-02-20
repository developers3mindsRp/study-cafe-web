// User Model
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Course Model
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
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
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

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
}

// User's purchased course with progress
export interface UserCourse extends Purchase {
  progress: number; // 0-100
  lastAccessedAt?: string;
  completedLessons: string[];
  completedAt?: string;
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

export interface RegisterData {
  name: string;
  email: string;
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
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  badge?: string;
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
  testimonialHighlight?: Testimonial;
  updatedAt?: string;
}

/** Membership plan for pricing page */
export interface Membership {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  status: 'Active' | 'Inactive';
  highlighted?: boolean;
  order?: number;
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

/** CMS page content (about, contact, privacy, etc.) */
export interface PageContent {
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt?: string;
}

/** SEO metadata for a page */
export interface SeoMetadata {
  pageSlug: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  robots?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
}

/** Resolved "Also Read" article from [related id="..."] in legacy article content */
export interface RelatedArticle {
  id: number;
  title: string;
  slug: string;
}

/** Public article by slug (body = content, related_articles from shortcodes) */
export interface ArticleBySlug {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  body: string;
  cover_image_url?: string | null;
  author_name?: number | null;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
  related_articles?: RelatedArticle[];
}