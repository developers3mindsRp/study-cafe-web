import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as progressService from '@/services/progress.service';
import { queryKeys } from '@/lib/react-query';

export const useCourseProgress = (courseId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.progress.course(courseId),
    queryFn: () => progressService.getCourseProgress(courseId),
    enabled: !!courseId && (options?.enabled ?? true),
    staleTime: 60 * 1000,
  });
};

export const useOverallProgress = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [...queryKeys.progress.all, 'overall'] as const,
    queryFn: progressService.getOverallProgress,
    staleTime: 2 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

export const useHeartbeat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      watchSeconds,
      durationSeconds,
    }: {
      sessionId: string | number;
      watchSeconds: number;
      durationSeconds?: number;
    }) => progressService.heartbeatSession(sessionId, { watchSeconds, durationSeconds }),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all });
    },
  });
};

export const useMarkSessionComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string | number) => progressService.completeSession(sessionId),
    onSuccess: (data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases.lists() });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user.all, 'courses'] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.user.all, 'membership-courses'] });
      const cid = data && typeof data === 'object' && 'courseId' in data ? (data as any).courseId : undefined;
      if (cid) queryClient.invalidateQueries({ queryKey: queryKeys.progress.course(String(cid)) });
    },
  });
};
