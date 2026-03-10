import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { getHomePageData } from '@/services/platform.service';
import type { HomePageData } from '@/types/models.types';

/**
 * Hook for home page data (hero, features, stats, testimonialHighlight).
 * Pass `initialData` from getStaticProps so SSG and client render the same HTML,
 * preventing React hydration mismatches.
 */
export const useHomePageData = (initialData?: HomePageData) => {
  return useQuery({
    queryKey: queryKeys.platform.home(),
    queryFn: () => getHomePageData(),
    initialData,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
