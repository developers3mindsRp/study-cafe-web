import { useMemo } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useSubscriptionStatus } from "@/hooks/usePurchases";
import { viewerSeesAds } from "@/lib/adPolicy";

type Options = {
  /** Skip the plan lookup entirely and answer `false` (e.g. an ad-free route). */
  enabled?: boolean;
  /**
   * Answer to give while auth / plan are still in flight.
   *
   * AdSense passes `false` — a paying member must never get a flash of ads.
   * Server-rendered banners pass whatever SSR already decided from the request
   * cookie, so the first paint is not thrown away and re-rendered.
   */
  whileLoading?: boolean;
};

export type ViewerAdsDecision = {
  adsAllowed: boolean;
  /**
   * False while the answer is still a guess.
   *
   * Callers that *act* on the decision — hiding units, running an ad script —
   * must wait for this. Acting early is what broke the in-article slots: the
   * CSS guard hid the `<ins>` during the unknown window, AdSense measured it at
   * zero width, and the slot stayed blank for good.
   */
  isResolved: boolean;
};

/**
 * Whether this viewer should be shown ads: free and logged-out readers yes,
 * basic members yes, premium and ultimate no.
 *
 * The plan lookup only fires for someone who actually holds a membership —
 * for everyone else `hasActiveMembership` already settles it.
 */
export function useViewerAdsAllowed({
  enabled = true,
  whileLoading = false,
}: Options = {}): ViewerAdsDecision {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const needsPlan = enabled && isAuthenticated && !!user?.hasActiveMembership;
  const { data: subscription, isLoading: planLoading } = useSubscriptionStatus({
    enabled: needsPlan,
  });

  return useMemo(() => {
    if (!enabled) return { adsAllowed: false, isResolved: true };
    if (authLoading) return { adsAllowed: whileLoading, isResolved: false };
    if (!isAuthenticated) return { adsAllowed: true, isResolved: true };
    if (!user?.hasActiveMembership) return { adsAllowed: true, isResolved: true };
    if (planLoading) return { adsAllowed: whileLoading, isResolved: false };
    return { adsAllowed: viewerSeesAds(subscription), isResolved: true };
  }, [
    enabled,
    whileLoading,
    authLoading,
    isAuthenticated,
    user?.hasActiveMembership,
    planLoading,
    subscription,
  ]);
}
