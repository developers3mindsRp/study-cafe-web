import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { getHomePageData, getMemberships } from '@/services/platform.service';
import type { HomePageData, Membership } from '@/types/models.types';

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
    staleTime: 10 * 60 * 1000,
  });
};

export const useMemberships = (initialData?: Membership[]) => {
  return useQuery({
    queryKey: queryKeys.platform.memberships(),
    queryFn: () => getMemberships(),
    // When initialData is provided from SSR (getServerSideProps), mark it as
    // fresh so the stale cache from a previous HydrationBoundary (plans page
    // getStaticProps) doesn't override it and cause a hydration mismatch.
    ...(initialData !== undefined
      ? { initialData, initialDataUpdatedAt: Date.now() }
      : {}),
    staleTime: 10 * 60 * 1000,
  });
};
