import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { shouldShowAds } from "@/lib/adPolicy";
import { useViewerAdsAllowed } from "@/hooks/useViewerAdsAllowed";

const ADSENSE_CLIENT = "ca-pub-7535560429122052";

/**
 * Loads Google AdSense only where the ad policy allows — by route first, then
 * by membership.
 *
 * Route: home, membership, courses, account and checkout are ad-free for
 * everyone. Member: on the content routes that do carry ads, basic members
 * (and free / logged-out visitors) see them; premium and ultimate do not —
 * the same call `useViewerAdsAllowed` makes for the in-article CMS banners.
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
  const { adsAllowed, isResolved } = useViewerAdsAllowed({
    enabled: shouldShowAds(pathname),
    whileLoading: false,
  });

  useEffect(() => {
    // Drives the CSS guard, which hides anchor/vignette units — those attach to
    // <body> and so outlive a client-side navigation into an ad-free page.
    //
    // Left untouched until membership is known. Writing "off" during that window
    // hid the in-article <ins> elements too, and an AdSense slot measured at zero
    // width fails permanently — the blank gap mid-article. On a client-side
    // navigation the answer is already settled, so the guard is still in place
    // before the next page mounts.
    if (!isResolved) return;
    document.body.dataset.ads = adsAllowed ? "on" : "off";
  }, [adsAllowed, isResolved]);

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
