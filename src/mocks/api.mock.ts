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
  RegisterData,
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
        user: mockUser,
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };
    }
    
    throw new Error('Invalid credentials');
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    await delay(1000);
    
    return {
      user: {
        ...mockUser,
        email: data.email,
        name: data.name,
      },
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
    };
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
    return mockMemberships.filter(m => m.status === 'Active');
  },

  getFaq: async (): Promise<FAQ[]> => {
    await delay(300);
    return [...mockFaq].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  getTestimonials: async (limit?: number): Promise<Testimonial[]> => {
    await delay(300);
    const list = [...mockTestimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return limit != null ? list.slice(0, limit) : list;
  },  getPageContent: async (slug: string): Promise<PageContent> => {
    await delay(300);
    const page = mockPageContent[slug];
    if (!page) throw new Error(`Page not found: ${slug}`);
    return page;
  },

  getSeoMetadata: async (pageSlug: string): Promise<SeoMetadata | null> => {
    await delay(200);
    return mockSeoMetadata[pageSlug] ?? null;
  },

  getArticleBySlug: async (_slug: string): Promise<import('@/types/models.types').ArticleBySlug | null> => {
    await delay(200);
    return null;
  },
};