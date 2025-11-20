import { 
  User, 
  Course, 
  CourseDetail,
  UserCourse, 
  Purchase,
  DashboardStats,
  CourseModule 
} from '@/types/models.types';

/**
 * Mock Data for Development
 * Use this when API is not available
 */

// Mock User
export const mockUser: User = {
  id: 'user-1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
  role: 'student',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-11-20T00:00:00Z',
};

// Mock Course Modules
const webDevModules: CourseModule[] = [
  {
    id: 'module-1',
    title: 'Introduction to Web Development',
    description: 'Get started with the basics',
    order: 1,
    lessons: [
      {
        id: 'lesson-1',
        title: 'What is Web Development?',
        description: 'Overview of web development',
        duration: 600,
        order: 1,
        isFree: true,
      },
      {
        id: 'lesson-2',
        title: 'Setting Up Your Environment',
        description: 'Install necessary tools',
        duration: 900,
        order: 2,
        isFree: true,
      },
      {
        id: 'lesson-3',
        title: 'Your First HTML Page',
        description: 'Create your first webpage',
        duration: 1200,
        order: 3,
        isFree: false,
      },
    ],
  },
  {
    id: 'module-2',
    title: 'HTML & CSS Fundamentals',
    description: 'Master the building blocks',
    order: 2,
    lessons: [
      {
        id: 'lesson-4',
        title: 'HTML Structure',
        duration: 1500,
        order: 1,
        isFree: false,
      },
      {
        id: 'lesson-5',
        title: 'CSS Styling Basics',
        duration: 1800,
        order: 2,
        isFree: false,
      },
    ],
  },
];

const reactModules: CourseModule[] = [
  {
    id: 'module-3',
    title: 'React Basics',
    description: 'Introduction to React',
    order: 1,
    lessons: [
      {
        id: 'lesson-6',
        title: 'What is React?',
        duration: 900,
        order: 1,
        isFree: true,
      },
      {
        id: 'lesson-7',
        title: 'Components & Props',
        duration: 1800,
        order: 2,
        isFree: false,
      },
    ],
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, and modern web development from scratch. Perfect for beginners!',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    price: 89.99,
    discountPrice: 49.99,
    category: 'Web Development',
    level: 'beginner',
    duration: 36000, // 600 minutes = 10 hours
    instructorId: 'instructor-1',
    instructor: {
      id: 'instructor-1',
      name: 'Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366F1&color=fff',
    },
    rating: 4.8,
    totalStudents: 12453,
    featured: true,
    status: 'published',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
  },
  {
    id: 'course-2',
    title: 'React & Next.js Masterclass',
    description: 'Master React and Next.js by building real-world applications with modern best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    price: 129.99,
    discountPrice: 79.99,
    category: 'React',
    level: 'intermediate',
    duration: 48000, // 800 minutes
    instructorId: 'instructor-2',
    instructor: {
      id: 'instructor-2',
      name: 'Michael Chen',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=EF4444&color=fff',
    },
    rating: 4.9,
    totalStudents: 8756,
    featured: true,
    status: 'published',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-11-18T00:00:00Z',
  },
  {
    id: 'course-3',
    title: 'Python for Data Science',
    description: 'Learn Python programming and data analysis with pandas, numpy, and matplotlib.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    price: 99.99,
    category: 'Data Science',
    level: 'intermediate',
    duration: 42000,
    instructorId: 'instructor-3',
    instructor: {
      id: 'instructor-3',
      name: 'Emily Rodriguez',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=10B981&color=fff',
    },
    rating: 4.7,
    totalStudents: 5432,
    featured: true,
    status: 'published',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
  {
    id: 'course-4',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn user interface and user experience design principles and tools.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    price: 79.99,
    discountPrice: 39.99,
    category: 'Design',
    level: 'beginner',
    duration: 30000,
    instructorId: 'instructor-4',
    instructor: {
      id: 'instructor-4',
      name: 'David Kim',
      avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=F59E0B&color=fff',
    },
    rating: 4.6,
    totalStudents: 6789,
    featured: true,
    status: 'published',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-11-12T00:00:00Z',
  },
  {
    id: 'course-5',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    price: 109.99,
    category: 'Backend',
    level: 'intermediate',
    duration: 45000,
    instructorId: 'instructor-1',
    instructor: {
      id: 'instructor-1',
      name: 'Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366F1&color=fff',
    },
    rating: 4.8,
    totalStudents: 4321,
    featured: false,
    status: 'published',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-11-08T00:00:00Z',
  },
  {
    id: 'course-6',
    title: 'Machine Learning A-Z',
    description: 'Complete guide to machine learning with Python, scikit-learn, and TensorFlow.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    price: 149.99,
    discountPrice: 99.99,
    category: 'Machine Learning',
    level: 'advanced',
    duration: 60000,
    instructorId: 'instructor-3',
    instructor: {
      id: 'instructor-3',
      name: 'Emily Rodriguez',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=10B981&color=fff',
    },
    rating: 4.9,
    totalStudents: 3456,
    featured: true,
    status: 'published',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-11-14T00:00:00Z',
  },
];

// Mock Course Details (with modules)
export const mockCourseDetails: Record<string, CourseDetail> = {
  'course-1': {
    ...mockCourses[0],
    modules: webDevModules,
    requirements: [
      'A computer with internet connection',
      'No prior programming experience needed',
      'Willingness to learn',
    ],
    whatYouWillLearn: [
      'Build responsive websites with HTML and CSS',
      'Create interactive web pages with JavaScript',
      'Understand modern web development workflows',
      'Deploy your projects to the web',
      'Use version control with Git',
    ],
    totalLessons: 5,
  },
  'course-2': {
    ...mockCourses[1],
    modules: reactModules,
    requirements: [
      'Basic JavaScript knowledge',
      'Understanding of HTML and CSS',
      'Node.js installed on your computer',
    ],
    whatYouWillLearn: [
      'Master React hooks and components',
      'Build full-stack apps with Next.js',
      'Implement server-side rendering',
      'Work with TypeScript in React',
      'Deploy production-ready applications',
    ],
    totalLessons: 2,
  },
};

// Mock User Courses (Purchased courses with progress)
export const mockUserCourses: UserCourse[] = [
  {
    id: 'purchase-1',
    userId: 'user-1',
    courseId: 'course-1',
    course: mockCourses[0],
    purchaseDate: '2024-10-15T00:00:00Z',
    price: 49.99,
    paymentMethod: 'credit_card',
    transactionId: 'txn_1234567890',
    status: 'completed',
    progress: 65,
    lastAccessedAt: '2024-11-19T10:30:00Z',
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
  },
  {
    id: 'purchase-2',
    userId: 'user-1',
    courseId: 'course-2',
    course: mockCourses[1],
    purchaseDate: '2024-11-01T00:00:00Z',
    price: 79.99,
    paymentMethod: 'paypal',
    transactionId: 'txn_0987654321',
    status: 'completed',
    progress: 25,
    lastAccessedAt: '2024-11-18T15:45:00Z',
    completedLessons: ['lesson-6'],
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalCourses: 2,
  completedCourses: 0,
  inProgressCourses: 2,
  totalLearningHours: 23,
  averageProgress: 45,
};

// Mock Categories
export const mockCategories = [
  'Web Development',
  'React',
  'Data Science',
  'Design',
  'Backend',
  'Machine Learning',
  'Mobile Development',
  'DevOps',
];

// Helper to get purchased course IDs
export const getPurchasedCourseIds = (userId: string): string[] => {
  return mockUserCourses
    .filter(uc => uc.userId === userId)
    .map(uc => uc.courseId);
};

