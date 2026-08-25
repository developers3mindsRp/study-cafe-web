import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { resolveApiAssetUrl } from '@/utils/mediaUrl';
import { activateAdScripts, prepareCmsAdMarkup } from '@/lib/siteDisplayAds';
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
  /**
   * Whether the ad script may run yet. Callers that gate on membership pass
   * their "decision is settled" flag: an AdSense unit initialised while the
   * ad-policy CSS still has it hidden measures zero width and never recovers.
   * Irrelevant to image slots, which have nothing to run.
   */
  active?: boolean;
};

/**
 * Raw ad-network markup, with the slot's own image behind it as a house
 * fallback where one is configured.
 *
 * The script tags render inert and are activated on mount, so the slot runs
 * exactly once whether the markup arrived in the SSR stream (where a live tag
 * executes during parsing) or from a client-side navigation (where it would
 * never execute at all). `site-ad-slot` on the wrapper is what lets the
 * fallback rules in globals.css find the unit.
 */
function AdScriptSlot({
  code,
  className,
  fallback,
  active,
}: {
  code: string;
  className: string;
  fallback: ReactNode;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inert = useMemo(() => prepareCmsAdMarkup(code), [code]);

  useEffect(() => {
    if (!active) return;
    activateAdScripts(ref.current);
  }, [inert, active]);

  return (
    <div ref={ref} className={`site-ad-slot site-ad-script ${className}`.trim()}>
      <div dangerouslySetInnerHTML={{ __html: inert }} />
      {fallback ? <div className="site-ad-fallback">{fallback}</div> : null}
    </div>
  );
}

/** Clickable CMS banner — image-only when no URL. */
export default function SiteAdBanner({ slot, className = '', active = true }: Props) {
  const src = resolveApiAssetUrl(slot?.image_url);
  const href = slot?.link_url ? safeHref(String(slot.link_url)) : undefined;

  const img = src ? (
    // eslint-disable-next-line @next/next/no-img-element -- remote CMS uploads
    <img
      src={src}
      alt=""
      className="rounded-[10px] w-full max-w-full h-auto object-cover"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  ) : null;

  const linked =
    img && href ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {img}
      </a>
    ) : (
      img
    );

  if (slot?.mode === 'script') {
    const code = slot.script?.trim();
    if (!code) return null;
    return <AdScriptSlot code={code} className={className} fallback={linked} active={active} />;
  }

  if (!linked) return null;
  return <div className={className}>{linked}</div>;
}
