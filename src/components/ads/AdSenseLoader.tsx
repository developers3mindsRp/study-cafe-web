import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { shouldShowAds } from "@/lib/adPolicy";

const ADSENSE_CLIENT = "ca-pub-7535560429122052";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Set once AdSense is actually on the page. Module-level, not state: the queue
 * it guards is global, and pushing config before the tag exists means the tag
 * replays it on load — on whatever page happens to be open by then.
 */
let adsenseLoaded = false;

/**
 * AdSense reads any push it does not recognise as config as a request to fill
 * an `<ins class="adsbygoogle">`, and throws TagError when none is free. Never
 * let that reach the page.
 */
function pushConfig(config: Record<string, unknown>): void {
  if (!adsenseLoaded) return;
  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push(config);
  } catch {
    /** Blocked, not yet initialised, or already torn down — non-fatal */
  }
}

/**
 * Loads Google AdSense only on routes `adPolicy` allows.
 *
 * Three guards, because on a SPA one is not enough — client-side navigation
 * never unloads the ad runtime, so a user who enters through a blog would
 * otherwise keep seeing ads on every page they click through to:
 *
 *  1. the tag is never rendered on an ad-free route (covers direct hits)
 *  2. `pauseAdRequests` stops further ad calls once the runtime is loaded
 *  3. `data-ads` on <body> lets CSS hide units Google already placed
 */
export default function AdSenseLoader() {
  const { pathname } = useRouter();
  const adsAllowed = shouldShowAds(pathname);
  const paused = useRef(false);

  useEffect(() => {
    document.body.dataset.ads = adsAllowed ? "on" : "off";

    // Only on a real transition. Pushing every render would double up under
    // StrictMode, which runs this effect twice in development.
    if (!adsAllowed && !paused.current) {
      pushConfig({ pauseAdRequests: 1 });
      paused.current = true;
    } else if (adsAllowed && paused.current) {
      pushConfig({ pauseAdRequests: 0 });
      paused.current = false;
    }
  }, [adsAllowed]);

  if (!adsAllowed) return null;

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        adsenseLoaded = true;
      }}
    />
  );
}
