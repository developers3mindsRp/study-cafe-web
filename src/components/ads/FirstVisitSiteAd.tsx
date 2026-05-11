import { useEffect, useState } from 'react';
import { getSiteDisplayAds } from '@/services/platform.service';
import { resolveApiAssetUrl } from '@/utils/mediaUrl';

const STORAGE_KEY = 'studycafe_first_visit_popup_seen';

function safeHref(url: string): string | undefined {
  const t = url.trim();
  if (!t) return undefined;
  const lower = t.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return undefined;
  return t;
}

/**
 * First-session promotional overlay (image + link from CMS).
 * Dismiss is remembered in localStorage for this browser.
 */
export default function FirstVisitSiteAd() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const ads = await getSiteDisplayAds();
        if (cancelled || !ads) return;
        if (ads.popup?.enabled === false) return;
        const src = ads.popup?.image_url?.trim();
        if (!src) return;
        setImageUrl(resolveApiAssetUrl(src));
        const href = ads.popup.link_url?.trim();
        setLinkUrl(href ? safeHref(href) : undefined);
        setOpen(true);
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open || !imageUrl) return null;

  const body = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt=""
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
