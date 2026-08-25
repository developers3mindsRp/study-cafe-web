import { useEffect, useMemo, useRef } from 'react';
import { resolveApiAssetUrl } from '@/utils/mediaUrl';
import { activateAdScripts, neutralizeAdScripts } from '@/lib/siteDisplayAds';
import type { SiteAdsSlot } from '@/types/models.types';

function safeHref(url: string): string | undefined {
  const t = url.trim();
  if (!t) return undefined;
  const lower = t.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return undefined;
  return t;
}

type Props = {
  slot?: SiteAdsSlot | null;
  className?: string;
};

/**
 * Raw ad-network markup. The script tags are rendered inert and then activated
 * on mount, so the slot runs exactly once whether the markup arrived in the SSR
 * stream (where a live tag would execute during parsing) or from a client-side
 * navigation (where it would never execute at all).
 */
function AdScriptSlot({ code, className }: { code: string; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inert = useMemo(() => neutralizeAdScripts(code), [code]);

  useEffect(() => {
    activateAdScripts(ref.current);
  }, [inert]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: inert }} />;
}

/** Clickable CMS banner — image-only when no URL. */
export default function SiteAdBanner({ slot, className = '' }: Props) {
  if (slot?.mode === 'script') {
    const code = slot.script?.trim();
    if (!code) return null;
    return <AdScriptSlot code={code} className={className} />;
  }

  const src = resolveApiAssetUrl(slot?.image_url);
  if (!src) return null;
  const href = slot?.link_url ? safeHref(String(slot.link_url)) : undefined;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- remote CMS uploads
    <img
      src={src}
      alt=""
      className="rounded-[10px] w-full max-w-full h-auto object-cover"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );

  return (
    <div className={className}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}
