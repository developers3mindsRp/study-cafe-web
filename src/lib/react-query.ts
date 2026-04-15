import { QueryClient, DefaultOptions } from '@tanstack/react-query';

// Configure default options for React Query
const queryConfig: DefaultOptions = {
  queries: {
    // Data is considered stale after 5 minutes
    staleTime: 5 * 60 * 1000,

    // Cache data for 10 minutes
    gcTime: 10 * 60 * 1000,

    // Retry failed requests 1 time
    retry: 1,

    // Don't refetch on window focus in development
    refetchOnWindowFocus: process.env.NODE_ENV === 'production',

    // Don't refetch on mount if data is fresh
    refetchOnMount: false,

    // Don't refetch on reconnect by default
    refetchOnReconnect: false,
  },
  mutations: {
    // Retry failed mutations 0 times (don't retry by default)
    retry: 0,
  },
};

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Helper function to create a new query client (useful for SSR)
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
};

// Query keys factory for better organization and type safety
export const queryKeys = {
  // Auth keys
  auth: {
    currentUser: ['auth', 'currentUser'] as const,
  },

  // Course keys
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.courses.lists(), { filters }] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    search: (query: string) => [...queryKeys.courses.all, 'search', query] as const,
  },

  // Platform keys
  platform: {
    all: ['platform'] as const,
    home: () => [...queryKeys.platform.all, 'home'] as const,
    memberships: () => [...queryKeys.platform.all, 'memberships'] as const,
  },

  // Article/Blog keys
  articles: {
    all: ['articles'] as const,
    list: (filters?: any) => [...queryKeys.articles.all, 'list', { filters }] as const,
    categories: () => [...queryKeys.articles.all, 'categories'] as const,
    detail: (slug: string) => [...queryKeys.articles.all, 'detail', slug] as const,
    spotlight: (filters?: Record<string, unknown>) =>
      [...queryKeys.articles.all, 'spotlight', filters ?? {}] as const,
  },

  // Purchase/User Course keys
  purchases: {
    all: ['purchases'] as const,
    lists: () => [...queryKeys.purchases.all, 'list'] as const,
    list: (userId?: string) => [...queryKeys.purchases.lists(), { userId }] as const,
    detail: (id: string) => [...queryKeys.purchases.all, 'detail', id] as const,
  },

  // User keys
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    stats: () => [...queryKeys.user.all, 'stats'] as const,
  },

  // Progress keys
  progress: {
    all: ['progress'] as const,
    course: (courseId: string) => [...queryKeys.progress.all, 'course', courseId] as const,
    lesson: (lessonId: string) => [...queryKeys.progress.all, 'lesson', lessonId] as const,
  },
};

