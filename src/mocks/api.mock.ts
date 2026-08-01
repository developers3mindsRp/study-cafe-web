import { 
  mockUser, 
  mockCourses, 
  mockCourseDetails,
  mockUserCourses, 
  mockDashboardStats,
  mockCategories,
  getPurchasedCourseIds,
  mockHomePageData,
  mockMemberships,
  mockFaq,
  mockTestimonials,
  mockPageContent,
  mockSeoMetadata,
} from './data';
import {
  User,
  Course,
  CourseDetail,
  UserCourse,
  Purchase,
  DashboardStats,
  LoginCredentials,
  LoginOtpCredentials,
  RegisterData,
  QuickRegisterData,
  AuthResponse,
  UpdateProfileData,
  LessonProgress,
  CourseProgress,
  HomePageData,
  Membership,
  FAQ,
  Testimonial,
  PageContent,
  SeoMetadata,
} from '@/types/models.types';
import { PaginatedResponse, CourseFilters, ApiResponse } from '@/types/api.types';

/**
 * Mock API Service
 * Simulates API calls with realistic delays
 */

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to wrap responses in API response format
const wrapResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  success: true,
  message: 'Success',
});

/**
 * Auth Mock APIs
 */
export const mockAuthApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800);
    
    // Simple mock validation
    if (credentials.email && credentials.password) {
      return {
        user: { ...mockUser, emailVerified: true },
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };
    }
    
    throw new Error('Invalid credentials');
  },

  requestLoginOtp: async (_email: string): Promise<void> => {
    await delay(400);
  },

  loginWithEmailOtp: async (credentials: LoginOtpCredentials): Promise<AuthResponse> => {
    await delay(800);
    if (credentials.otp === '123456') {
      return {
        user: { ...mockUser, email: credentials.email.trim(), emailVerified: true },
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };
    }
    throw new Error('Invalid or expired code');
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    await delay(1000);
    
    return {
      user: {
        ...mockUser,
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        profession: data.profession || null,
        company: data.company || null,
        designation: data.designation || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || null,
        emailVerified: false,
      },
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
    };
  },

  registerQuick: async (data: QuickRegisterData): Promise<AuthResponse> => {
    await delay(1000);

    return {
      user: {
        ...mockUser,
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        profession: null,
        company: null,
        designation: null,
        city: null,
        state: null,
        emailVerified: false,
      },
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
    };
  },

  verifyEmailWithOtp: async (otp: string): Promise<AuthResponse> => {
    await delay(600);
    if (otp.trim() === '123456') {
      return {
        user: { ...mockUser, emailVerified: true },
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };
    }
    throw new Error('Invalid or expired verification code');
  },

  resendVerificationEmail: async (): Promise<void> => {
    await delay(400);
  },

  getCurrentUser: async (): Promise<User> => {
    await delay(300);
    return mockUser;
  },

  logout: async (): Promise<void> => {
    await delay(200);
  },

  refreshToken: async (): Promise<string> => {
    await delay(300);
    return 'mock_jwt_token_' + Date.now();
  },
};

/**
 * Courses Mock APIs
 */
export const mockCoursesApi = {
  getCourses: async (filters?: CourseFilters): Promise<PaginatedResponse<Course>> => {
    await delay(600);
    
    let filteredCourses = [...mockCourses];
    
    // Apply filters
    if (filters?.category) {
      filteredCourses = filteredCourses.filter(c => 
        c.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    
    if (filters?.level) {
      filteredCourses = filteredCourses.filter(c => c.level === filters.level);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredCourses = filteredCourses.filter(c =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
      );
    }
    
    if (filters?.priceMin !== undefined) {
      filteredCourses = filteredCourses.filter(c => 
        (c.discountPrice || c.price) >= filters.priceMin!
      );
    }
    
    if (filters?.priceMax !== undefined) {
      filteredCourses = filteredCourses.filter(c => 
        (c.discountPrice || c.price) <= filters.priceMax!
      );
    }
    
    if (filters?.featured !== undefined) {
      filteredCourses = filteredCourses.filter(c => c.featured === filters.featured);
    }
    
    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredCourses.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredCourses.length,
        totalPages: Math.ceil(filteredCourses.length / limit),
      },
    };
  },

  getCourseById: async (id: string): Promise<CourseDetail> => {
    await delay(400);
    
    const courseDetail = mockCourseDetails[id];
    if (!courseDetail) {
      // If not in details, create from basic course
      const course = mockCourses.find(c => c.id === id);
      if (!course) {
        throw new Error('Course not found');
      }
      
      return {
        ...course,
        modules: [],
        requirements: ['Basic computer skills'],
        whatYouWillLearn: ['Complete the course to learn more'],
        totalLessons: 0,
      };
    }
    
    return courseDetail;
  },

  searchCourses: async (query: string, filters?: Partial<CourseFilters>): Promise<PaginatedResponse<Course>> => {
    await delay(500);
    
    return mockCoursesApi.getCourses({ ...filters, search: query });
  },

  getFeaturedCourses: async (limit: number = 6): Promise<Course[]> => {
    await delay(400);
    
    return mockCourses.filter(c => c.featured).slice(0, limit);
  },

  getCoursesByCategory: async (
    category: string,
    filters?: Partial<CourseFilters>
  ): Promise<PaginatedResponse<Course>> => {
    await delay(500);
    
    return mockCoursesApi.getCourses({ ...filters, category });
  },

  getCategories: async (): Promise<string[]> => {
    await delay(300);
    return mockCategories;
  },

  getRelatedCourses: async (courseId: string, limit: number = 4): Promise<Course[]> => {
    await delay(400);
    
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return [];
    
    // Return courses from same category
    return mockCourses
      .filter(c => c.id !== courseId && c.category === course.category)
      .slice(0, limit);
  },
};

/**
 * User Mock APIs
 */
export const mockUserApi = {
  getUserProfile: async (): Promise<User> => {
    await delay(300);
    return mockUser;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    await delay(600);
    return { ...mockUser, ...data };
  },

  uploadAvatar: async (file: File): Promise<string> => {
    await delay(1000);
    // Simulate avatar upload
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(mockUser.name)}&background=random`;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(400);
    return mockDashboardStats;
  },

  getUserCourses: async (): Promise<UserCourse[]> => {
    await delay(500);
    return mockUserCourses;
  },
};

/**
 * Purchases Mock APIs
 */
export const mockPurchasesApi = {
  createPurchase: async (courseId: string): Promise<Purchase> => {
    await delay(1000);
    
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    
    const newPurchase: Purchase = {
      id: 'purchase-' + Date.now(),
      userId: mockUser.id,
      courseId,
      course,
      purchaseDate: new Date().toISOString(),
      price: course.discountPrice || course.price,
      paymentMethod: 'credit_card',
      transactionId: 'txn_' + Date.now(),
      status: 'completed',
    };
    
    // Add to mock data
    mockUserCourses.push({
      ...newPurchase,
      progress: 0,
      completedLessons: [],
    });
    
    return newPurchase;
  },

  getUserPurchases: async (): Promise<UserCourse[]> => {
    await delay(500);
    return mockUserCourses;
  },

  getPurchaseDetails: async (id: string): Promise<Purchase> => {
    await delay(300);
    
    const purchase = mockUserCourses.find(p => p.id === id);
    if (!purchase) {
      throw new Error('Purchase not found');
    }
    
    return purchase;
  },

  checkPurchaseStatus: async (courseId: string): Promise<boolean> => {
    await delay(300);
    
    const purchased = getPurchasedCourseIds(mockUser.id);
    return purchased.includes(courseId);
  },

  getCourseProgress: async (courseId: string): Promise<CourseProgress> => {
    await delay(300);
    
    const userCourse = mockUserCourses.find(uc => uc.courseId === courseId);
    
    if (!userCourse) {
      throw new Error('Course not purchased');
    }
    
    return {
      courseId,
      userId: mockUser.id,
      progress: userCourse.progress,
      completedLessons: userCourse.completedLessons.length,
      totalLessons: mockCourseDetails[courseId]?.totalLessons || 0,
      lastAccessedAt: userCourse.lastAccessedAt || new Date().toISOString(),
    };
  },

  updateLessonProgress: async (
    lessonId: string,
    watchTime: number
  ): Promise<LessonProgress> => {
    await delay(200);
    
    return {
      lessonId,
      courseId: 'course-1',
      userId: mockUser.id,
      completed: false,
      watchTime,
      lastWatchedAt: new Date().toISOString(),
    };
  },

  markLessonComplete: async (lessonId: string): Promise<LessonProgress> => {
    await delay(400);
    
    // Find which course this lesson belongs to
    let foundCourseId = 'course-1';
    for (const [courseId, courseDetail] of Object.entries(mockCourseDetails)) {
      const hasLesson = courseDetail.modules.some(m => 
        m.lessons.some(l => l.id === lessonId)
      );
      if (hasLesson) {
        foundCourseId = courseId;
        break;
      }
    }
    
    // Update mock data
    const userCourse = mockUserCourses.find(uc => uc.courseId === foundCourseId);
    if (userCourse && !userCourse.completedLessons.includes(lessonId)) {
      userCourse.completedLessons.push(lessonId);
      
      // Update progress percentage
      const totalLessons = mockCourseDetails[foundCourseId]?.totalLessons || 1;
      userCourse.progress = Math.round((userCourse.completedLessons.length / totalLessons) * 100);
    }
    
    return {
      lessonId,
      courseId: foundCourseId,
      userId: mockUser.id,
      completed: true,
      watchTime: 0,
      lastWatchedAt: new Date().toISOString(),
    };
  },

  getOverallProgress: async (): Promise<CourseProgress[]> => {
    await delay(400);
    
    return mockUserCourses.map(uc => ({
      courseId: uc.courseId,
      userId: mockUser.id,
      progress: uc.progress,
      completedLessons: uc.completedLessons.length,
      totalLessons: mockCourseDetails[uc.courseId]?.totalLessons || 0,
      lastAccessedAt: uc.lastAccessedAt || new Date().toISOString(),
    }));
  },
};

/**
 * Platform / Website mock APIs (home, memberships, FAQ, testimonials, page content, SEO)
 */
export const mockPlatformApi = {
  getHomePageData: async (): Promise<HomePageData> => {
    await delay(400);
    return mockHomePageData;
  },

  getMemberships: async (): Promise<Membership[]> => {
    await delay(300);
    return mockMemberships.filter((m: any) => m.status === 'Active');
  },

  getFaq: async (): Promise<FAQ[]> => {
    await delay(300);
    return [...mockFaq].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  getHomeTestimonialQuotes: async (limit?: number): Promise<Testimonial[]> => {
    await delay(300);
    const list = [...mockTestimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return limit != null ? list.slice(0, limit) : list;
  },

  getGoogleReviews: async () => {
    await delay(300);
    return mockTestimonials.slice(0, 3).map((t, i) => ({
      id: i + 1,
      name: t.authorName,
      role: t.authorRole || '',
      rating: 5,
      text: t.quote,
      ago: '2 weeks ago',
    }));
  },

  getTestimonials: async () => {
    await delay(300);
    return [];
  },

  getPageContent: async (slug: string): Promise<PageContent | null> => {
    await delay(300);
    const page = mockPageContent[slug];
    if (!page) return null;
    return page;
  },

  getSeoMetadata: async (pageSlugOrPath: string): Promise<SeoMetadata | null> => {
    await delay(200);
    const normalized = pageSlugOrPath.startsWith('/')
      ? pageSlugOrPath
      : `/${pageSlugOrPath}`;
    const noLead = normalized === '/' ? '/' : normalized.replace(/^\/+/, '');
    return mockSeoMetadata[normalized] ?? mockSeoMetadata[noLead] ?? null;
  },

  getSiteDisplayAds: async (): Promise<import('@/types/models.types').SiteDisplayAds> => {
    await delay(100);
    return {
      popup: { enabled: false, image_url: '', link_url: '' },
      article_detail_sidebar: [
        { image_url: '', link_url: '' },
        { image_url: '', link_url: '' },
      ],
      article_listing_sidebar: { image_url: '', link_url: '' },
      between_article: {
        after_paragraph_3: { image_url: '', link_url: '' },
        after_paragraph_6: { image_url: '', link_url: '' },
        below_featured_post: { image_url: '', link_url: '' },
      },
    };
  },

  getPublicTrackingSettings: async (): Promise<import('@/types/api.types').PublicTrackingSettings> => ({
    tracking_meta_pixel: null,
    tracking_google_analytics: null,
    tracking_linkedin_pixel: null,
  }),

  getArticleBySlug: async (_slug: string): Promise<import('@/types/models.types').ArticleBySlug | null> => {
    await delay(200);
    return null;
  },

  getBlogSpotlightFeed: async (): Promise<import('@/types/models.types').BlogSpotlightFeed> => {
    await delay(200);
    return {
      hero: null,
      recent_posts: [],
      all_posts: [],
      author: null,
      author_recent_articles: [],
      popular_tags: [],
    };
  },

  subscribeNewsletter: async (
    _email: string
  ): Promise<{ subscribed: true; already_subscribed: boolean }> => {
    await delay(500);
    return { subscribed: true, already_subscribed: false };
  },

  submitContactInquiry: async (body: {
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    country_code?: string;
    subject?: string;
    message: string;
  }): Promise<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    country_code?: string;
    subject?: string | null;
    message: string;
    status: string;
    created_at: string;
  }> => {
    await delay(500);
    return {
      id: 1,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      mobile_number: body.mobile_number,
      country_code: body.country_code,
      subject: body.subject ?? null,
      message: body.message,
      status: "new",
      created_at: new Date().toISOString(),
    };
  },
};