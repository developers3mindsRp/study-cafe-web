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

