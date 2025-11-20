import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as purchasesService from '@/services/purchases.service';
import * as userService from '@/services/user.service';
import { queryKeys } from '@/lib/react-query';

/**
 * Custom hooks for purchases and user courses
 * Includes optimistic updates for better UX
 */

// Hook to get user's purchased courses
export const useUserPurchases = () => {
  return useQuery({
    queryKey: queryKeys.purchases.list(),
    queryFn: purchasesService.getUserPurchases,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get user's enrolled courses
export const useUserCourses = () => {
  return useQuery({
    queryKey: [...queryKeys.user.all, 'courses'],
    queryFn: userService.getUserCourses,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook for purchase mutation with optimistic updates
export const usePurchaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => purchasesService.createPurchase(courseId),
    onSuccess: (newPurchase) => {
      // Invalidate and refetch purchases list
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases.lists() });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user.all, 'courses'] });
      
      // Also invalidate user stats as it might have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.user.stats() });
      
      console.log('Purchase successful:', newPurchase);
    },
    onError: (error: any) => {
      console.error('Purchase failed:', error);
    },
  });
};

// Hook to check if user has purchased a course
export const useCheckPurchaseStatus = (courseId: string) => {
  return useQuery({
    queryKey: [...queryKeys.purchases.all, 'check', courseId],
    queryFn: () => purchasesService.checkPurchaseStatus(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get purchase details
export const usePurchaseDetails = (id: string) => {
  return useQuery({
    queryKey: queryKeys.purchases.detail(id),
    queryFn: () => purchasesService.getPurchaseDetails(id),
    enabled: !!id,
  });
};

// Hook to get course progress
export const useCourseProgress = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.progress.course(courseId),
    queryFn: () => purchasesService.getCourseProgress(courseId),
    enabled: !!courseId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook to update lesson progress
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, watchTime }: { lessonId: string; watchTime: number }) =>
      purchasesService.updateLessonProgress(lessonId, watchTime),
    onSuccess: (data) => {
      // Invalidate course progress to reflect the update
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.progress.course(data.courseId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.purchases.lists() 
      });
    },
  });
};

// Hook to mark lesson as complete with optimistic update
export const useMarkComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) => purchasesService.markLessonComplete(lessonId),
    onMutate: async (lessonId) => {
      // Optionally show celebration UI before API call completes
      console.log('Marking lesson complete:', lessonId);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.progress.course(data.courseId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.purchases.lists() 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.user.stats() 
      });
      
      console.log('Lesson marked complete!');
    },
  });
};

// Hook to get overall user progress
export const useOverallProgress = () => {
  return useQuery({
    queryKey: [...queryKeys.progress.all, 'overall'],
    queryFn: purchasesService.getOverallProgress,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook to get dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.user.stats(),
    queryFn: userService.getDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updatedUser) => {
      // Update user in cache
      queryClient.setQueryData(queryKeys.auth.currentUser, updatedUser);
      queryClient.setQueryData(queryKeys.user.profile(), updatedUser);
      
      console.log('Profile updated successfully');
    },
  });
};

// Hook to upload avatar
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: (avatarUrl) => {
      // Invalidate user queries to refetch with new avatar
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      
      console.log('Avatar uploaded:', avatarUrl);
    },
  });
};

