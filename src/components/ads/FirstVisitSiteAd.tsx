import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSiteDisplayAds } from '@/services/platform.service';
import { resolveApiAssetUrl, isUnoptimizedImageSrc } from '@/utils/mediaUrl';

const STORAGE_KEY = 'studycafe_first_visit_popup_seen';

function safeHref(url: string): string | undefined {
  const t = url.trim();
  if (!t) return undefined;
  const lower = t.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return undefined;
  return t;
}

/** First sign that a real person is doing something with the page. Deliberately excludes
 *  anything that fires on its own: no timers, no load events. `scroll` covers nearly
 *  everyone, the rest catch people who interact without scrolling first. */
const ENGAGEMENT_EVENTS = ['scroll', 'wheel', 'touchmove', 'keydown'] as const;
// Note: no 'pointerdown'. A plain click is usually someone following a link, and opening
// the promo over them mid-navigation reads as a trap — with client-side routing the
// overlay would still be sitting there on the page they navigated to.

/**
 * First-session promotional overlay (image + link from CMS).
 * Dismiss is remembered in localStorage for this browser.
 *
 * WHY THIS WAITS FOR AN INTERACTION
 *
 * The overlay is `fixed inset-0`, so whenever it paints it covers the viewport and
 * becomes the Largest Contentful Paint element. It used to appear as soon as the ads
 * API answered — straight into the initial page load — which made it, not the hero, the
 * thing LCP measured. It scored 43 where the same page without it scored 78, and
 * shrinking the image only made that worse: a faster popup wins the race every time
 * instead of sometimes losing it. The cost was never the bytes, it was appearing during
 * load at all.
 *
 * Holding it until the visitor does something fixes both halves of the measurement:
 *   - Lab (Lighthouse/PSI) never scrolls, clicks or types, so the popup never opens
 *     during an audit and the hero is measured instead.
 *   - Field (real Chrome users) stops recording LCP at the first interaction, so an
 *     overlay that only appears after that interaction can never be someone's LCP.
 *
 * The trade-off is real and deliberate: a visitor who leaves without scrolling, tapping
 * or typing never sees the promo. In exchange it stops costing every visitor their LCP.
 * If marketing wants those bounces covered too, a timer is the wrong instrument — it
 * fires with no interaction, so a slow audit whose trace is still open when it elapses
 * puts the popup straight back in LCP. Prefer a scroll-depth or exit-intent trigger.
 *
 * The CMS config is prefetched during idle time so the image can start loading the
 * instant the trigger fires; the fetch paints nothing, so it costs no LCP.
 */
export default function FirstVisitSiteAd() {
  const [engaged, setEngaged] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState<string | undefined>(undefined);
  const [dismissed, setDismissed] = useState(false);

  // Arm the popup: fetch the CMS config, but do not show anything yet.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        const ads = await getSiteDisplayAds();
        if (cancelled || !ads) return;
        if (ads.popup?.enabled === false) return;
        const src = ads.popup?.image_url?.trim();
        if (!src) return;
        setImageUrl(resolveApiAssetUrl(src));
        const href = ads.popup.link_url?.trim();
        setLinkUrl(href ? safeHref(href) : undefined);
      } catch {
        /* ignore */
      }
    };

    // Idle rather than immediate, so the request queues behind the page's own work.
    // requestIdleCallback is missing on older Safari, hence the timeout fallback.
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    const handle = ric ? ric(load, { timeout: 3000 }) : window.setTimeout(load, 1500);

    return () => {
      cancelled = true;
      const cic = (window as unknown as {
        cancelIdleCallback?: (h: number) => void;
      }).cancelIdleCallback;
      if (ric && cic) cic(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  // Trigger: the visitor's first deliberate action on the page.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onEngage = () => setEngaged(true);
    for (const evt of ENGAGEMENT_EVENTS) {
      window.addEventListener(evt, onEngage, { once: true, passive: true });
    }

    return () => {
      for (const evt of ENGAGEMENT_EVENTS) {
        window.removeEventListener(evt, onEngage);
      }
    };
  }, []);

  const open = engaged && !dismissed;

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  if (!open || !imageUrl) return null;

  /**
   * Served through next/image rather than a bare <img>.
   *
   * This overlay is `fixed inset-0`, so the moment it paints it covers the viewport and
   * becomes the page's LCP element — on the homepage it displaced a hero that paints in
   * well under a second. The CMS asset behind it is a 1080x1080 JPEG at ~395 KB, sent
   * verbatim at full size to every device. Through the optimizer the same image is WebP
   * at roughly a fifth of that.
   *
   * Explicit width/height (the asset's own 1:1 aspect) reserve the box before the bytes
   * arrive, so the modal does not resize around the image as it loads.
   *
   * Note there is deliberately no `priority` here: this is promotional, it must never
   * preload ahead of real page content, and it is mounted only after the ads API responds.
   */
  const body = (
    <Image
      src={imageUrl}
      alt=""
      width={1080}
      height={1080}
      unoptimized={isUnoptimizedImageSrc(imageUrl)}
      sizes="(max-width: 672px) 90vw, 640px"
      className="max-h-[min(80vh,640px)] w-auto max-w-full rounded-lg object-contain shadow-lg"
    />
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Promotional offer"
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === "Escape") dismiss();
      }}
    >
      <div
        className="relative max-w-2xl w-full flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute -top-2 -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-800 shadow-md hover:bg-gray-100"
          aria-label="Close"
        >
          ×
        </button>
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" onClick={dismiss} className="block">
            {body}
          </a>
        ) : (
          body
        )}
        <button
          type="button"
          onClick={dismiss}
          className="rounded-md bg-white/90 px-6 py-2 text-sm font-medium text-gray-800 hover:bg-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
