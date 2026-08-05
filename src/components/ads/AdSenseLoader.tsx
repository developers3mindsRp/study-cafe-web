import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { shouldShowAds } from "@/lib/adPolicy";

const ADSENSE_CLIENT = "ca-pub-7535560429122052";

/**
 * Loads Google AdSense only on routes `adPolicy` allows.
 *
 * Deliberately does NOT call `adsbygoogle.push({pauseAdRequests})`. Auto ads
 * only places ads on a page load and never re-scans after a client-side
 * navigation, so pausing is one-way in practice: once paused, resuming does
 * not bring ads back for the rest of the session, and every journey through an
 * ad-free page (i.e. nearly all of them) killed ads on blogs for good.
 *
 * Two guards remain:
 *  1. the tag is never rendered on an ad-free route — the load-time decision,
 *     which is the only one Auto ads actually acts on
 *  2. `data-ads` on <body> lets CSS hide anchor/vignette units, which attach
 *     to <body> and so survive a route change into an ad-free page
 *
 * The authoritative third layer lives outside this repo: AdSense page
 * exclusions, which stop Google serving for those URLs at all.
 */
export default function AdSenseLoader() {
  const { pathname } = useRouter();
  const adsAllowed = shouldShowAds(pathname);

  useEffect(() => {
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
