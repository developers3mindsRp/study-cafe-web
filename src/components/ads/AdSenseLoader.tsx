import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { useAuth } from "@/providers/AuthProvider";
import { useSubscriptionStatus } from "@/hooks/usePurchases";
import { planHidesAds, shouldShowAds } from "@/lib/adPolicy";

const ADSENSE_CLIENT = "ca-pub-7535560429122052";

/**
 * Loads Google AdSense only where the ad policy allows — by route first, then
 * by membership.
 *
 * Route: home, membership, courses, account and checkout are ad-free for
 * everyone. Member: on the content routes that do carry ads, basic members
 * (and free / logged-out visitors) see them; premium and ultimate do not.
 *
 * The script is withheld until membership is known, so a paying member never
 * gets a flash of ads while `/auth/me` is still in flight. That costs basic
 * members a short delay before ads load, which is the right trade — showing
 * ads to someone who paid to remove them is the bug being fixed.
 *
 * Deliberately does NOT call `adsbygoogle.push({pauseAdRequests})`. Auto ads
 * only places on a page load and never re-scans after a client-side
 * navigation, so pausing proved one-way: once paused, resuming did not bring
 * ads back, and any journey through an ad-free page killed ads on blogs for
 * the rest of the session.
 */
export default function AdSenseLoader() {
  const { pathname } = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const routeAllowsAds = shouldShowAds(pathname);

  // Only a paying member needs the plan lookup — for everyone else
  // `hasActiveMembership` already settles it, and the call is skipped.
  const needsPlan = routeAllowsAds && isAuthenticated && !!user?.hasActiveMembership;
  const { data: subscription, isLoading: planLoading } = useSubscriptionStatus({
    enabled: needsPlan,
  });

  const adsAllowed = useMemo(() => {
    if (!routeAllowsAds) return false;
    if (authLoading) return false;
    if (!isAuthenticated) return true;
    if (!user?.hasActiveMembership) return true;
    if (planLoading) return false;
    return !planHidesAds(subscription?.membershipType);
  }, [
    routeAllowsAds,
    authLoading,
    isAuthenticated,
    user?.hasActiveMembership,
    planLoading,
    subscription?.membershipType,
  ]);

  useEffect(() => {
    // Drives the CSS guard, which hides anchor/vignette units — those attach to
    // <body> and so outlive a client-side navigation into an ad-free page.
    document.body.dataset.ads = adsAllowed ? "on" : "off";
  }, [adsAllowed]);

  if (!adsAllowed) return null;

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
